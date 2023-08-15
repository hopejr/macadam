/* Copyright 2018 Streampunk Media Ltd.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/* -LICENSE-START-
** Copyright (c) 2015 Blackmagic Design
**
** Permission is hereby granted, free of charge, to any person or organization
** obtaining a copy of the software and accompanying documentation covered by
** this license (the "Software") to use, reproduce, display, distribute,
** execute, and transmit the Software, and to prepare derivative works of the
** Software, and to permit third-parties to whom the Software is furnished to
** do so, all subject to the following:
**
** The copyright notices in the Software and this entire statement, including
** the above license grant, this restriction and the following disclaimer,
** must be included in all copies of the Software, in whole or in part, and
** all derivative works of the Software, unless such copies or derivative
** works are solely in the form of machine-executable object code generated by
** a source language processor.
**
** THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
** IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
** FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO EVENT
** SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE
** FOR ANY DAMAGES OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT OR OTHERWISE,
** ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
** DEALINGS IN THE SOFTWARE.
** -LICENSE-END-
*/

'use strict';
//var os = require('os');
//var isWinOrMac = (os.platform() === 'win32') || (os.platform() === 'darwin');
// if (!isWinOrMac)
//   throw('Macadam is not currently supported on this platform');

const macadamNative = require('bindings')('macadam');
const util = require('util');
const EventEmitter = require('events');

// Capture class is deprecated
function Capture (deviceIndex, displayMode, pixelFormat) {
  this.deviceIndex = deviceIndex;
  this.displayMode = displayMode;
  this.pixelFormat = pixelFormat;
  this.emergencyBrake = null;
  if (arguments.length !== 3 || typeof deviceIndex !== 'number' ||
      typeof displayMode !== 'number' || typeof pixelFormat !== 'number' ) {
    this.emit('error', new Error('Capture requires three number arguments: ' +
      'device index, display mode and pixel format'));
  } else {
    this.capture = macadamNative.capture({
      deviceIndex: deviceIndex,
      displayMode: displayMode,
      pixelFormat: pixelFormat
    });//.catch(err => { this.emit('error', err); });
    this.capture.then(x => { this.emergencyBrake = x; });
    this.running = true;
    /* process.on('exit', function () {
      console.log('Exiting node.');
      if (this.emergencyBrake) this.emergencyBrake.stop();
      this.emergencyBrake = null;
      process.exit(0);
    }); */
    process.on('SIGINT', () => {
      console.log('Received SIGINT.');
      if (this.emergencyBrake) this.emergencyBrake.stop();
      this.emergencyBrake = null;
      this.running = false;
      process.exit();
    });
    EventEmitter.call(this);
  }
}

util.inherits(Capture, EventEmitter);

Capture.prototype.start = function () {
  this.capture = this.capture.then(x => {
    return x.frame().then(f => {
      if (f.audio) {
        this.emit('frame', f.video.data, f.audio.data);
      } else {
        this.emit('frame', f.video.data);
      }
      if (this.running === true) this.start();
    });
  }).catch(err => { this.emit('error', err); });
};

Capture.prototype.stop = function () {
  this.running = false;
  this.capture.then(x => {
    x.stop();
    this.emit('done');
    this.emergencyBrake = null;
  }).catch(err => { this.emit('error', err); });
};

Capture.prototype.enableAudio = function (sampleRate, sampleType, channelCount) {
  this.capture.then(x => {
    x.stop();
    this.capture = macadam.capture({ // substitute promise - yuk - deprecating
      deviceIndex: this.deviceIndex,
      pixelFormat: this.pixelFormat,
      displayMode: this.displayMode,
      channels: channelCount,
      sampleRate: sampleRate,
      sampleTyoe: sampleType
    }).catch(err => { this.emit('error', err); });
  }).catch(err => { this.emit('error', err); } );
};

// Playback class is deprecated
function Playback (deviceIndex, displayMode, pixelFormat) {
  this.index = 0;
  this.deviceIndex = deviceIndex;
  this.displayMode = displayMode;
  this.pixelFormat = pixelFormat;
  this.running = true;
  this.emergencyBrake = null;
  if (arguments.length !== 3 || typeof deviceIndex !== 'number' ||
      typeof displayMode !== 'number' || typeof pixelFormat !== 'number' ) {
    this.emit('error', new Error('Playback requires three number arguments: ' +
      'index, display mode and pixel format'));
  } else {
    this.playback = macadamNative.playback({
      deviceIndex: deviceIndex,
      displayMode: displayMode,
      pixelFormat: pixelFormat
    }).catch(err => { this.emit('error', err); });
    /* process.on('exit', function () {
      console.log('Exiting node.');
      if (this.emergencyBrake) this.emergencyBrake.stop();
      this.running = false;
      process.exit(0);
    }); */
    process.on('SIGINT', () => {
      console.log('Received SIGINT.');
      if (this.emergencyBrake) this.emergencyBrake.stop();
      this.running = false;
      process.exit();
    });
  }

  EventEmitter.call(this);
}

util.inherits(Playback, EventEmitter);

Playback.prototype.start = function () {
  let index = this.index;
  this.playback.then(x => {
    x.start({ startTime: index * x.frameRate[0] });
  }).catch(err => { this.emit('error', err); });
};

Playback.prototype.frame = function (f, a) {
  let index = this.index++;
  this.playback.then(x => {
    if (!this.running) return;
    x.schedule({
      video: f,
      audio: a,
      time: index * x.frameRate[0]
    });
    x.played(index * x.frameRate[0]).then(r => {
      this.emit('played', r.result);
    });
  }).catch(err => { this.emit('error', err); });
};

Playback.prototype.stop = function () {
  this.playback.then(x => {
    x.stop();
    this.emit('done');
    this.emergencyBrake = null;
    this.running = false;
  }).catch(err => { this.emit('error', err); });
};

Playback.prototype.enableAudio = function (sampleRate, sampleType, channelCount) {
  this.playback.then(x => {
    x.stop();
    this.playback = macadam.playback({ // substitute promise - yuk - deprecating
      deviceIndex: this.deviceIndex,
      pixelFormat: this.pixelFormat,
      displayMode: this.displayMode,
      channels: channelCount,
      sampleRate: sampleRate,
      sampleTyoe: sampleType
    }).catch(err => { this.emit('error', err); });
  }).catch(err => { this.emit('error', err); } );
};

function bmCodeToInt (s) {
  return Buffer.from(s.substring(0, 4)).readUInt32BE(0);
}

function intToBMCode(i) {
  let b = Buffer.allocUnsafe(4);
  b.writeUInt32BE(i, 0);
  return b.toString();
}

function modeWidth (mode) {
  switch (mode) {
  case macadam.bmdModeNTSC:
  case macadam.bmdModeNTSC2398:
  case macadam.bmdModeNTSCp:
  case macadam.bmdModePAL:
  case macadam.bmdModePALp:
    return 720;
  case macadam.bmdModeHD720p50:
  case macadam.bmdModeHD720p5994:
  case macadam.bmdModeHD720p60:
    return 1280;
  case macadam.bmdModeHD1080p2398:
  case macadam.bmdModeHD1080p24:
  case macadam.bmdModeHD1080p25:
  case macadam.bmdModeHD1080p2997:
  case macadam.bmdModeHD1080p30:
  case macadam.bmdModeHD1080i50:
  case macadam.bmdModeHD1080i5994:
  case macadam.bmdModeHD1080i6000:
  case macadam.bmdModeHD1080p50:
  case macadam.bmdModeHD1080p5994:
  case macadam.bmdModeHD1080p6000:
    return 1920;
  case macadam.bmdMode2k2398:
  case macadam.bmdMode2k24:
  case macadam.bmdMode2k25:
  case macadam.bmdMode2kDCI2398:
  case macadam.bmdMode2kDCI24:
  case macadam.bmdMode2kDCI25:
  case macadam.bmdMode2kDCI2997:
  case macadam.bmdMode2kDCI30:
  case macadam.bmdMode2kDCI50:
  case macadam.bmdMode2kDCI5994:
  case macadam.bmdMode2kDCI60:
    return 2048;
  case macadam.bmdMode4K2160p2398:
  case macadam.bmdMode4K2160p24:
  case macadam.bmdMode4K2160p25:
  case macadam.bmdMode4K2160p2997:
  case macadam.bmdMode4K2160p30:
  case macadam.bmdMode4K2160p50:
  case macadam.bmdMode4K2160p5994:
  case macadam.bmdMode4K2160p60:
    return 3840;
  case macadam.bmdMode4kDCI2398:
  case macadam.bmdMode4kDCI24:
  case macadam.bmdMode4kDCI25:
  case macadam.bmdMode4kDCI2997:
  case macadam.bmdMode4kDCI30:
  case macadam.bmdMode4kDCI50:
  case macadam.bmdMode4kDCI5994:
  case macadam.bmdMode4kDCI60:
    return 4096;
  case macadam.bmdMode8K4320p2398:
  case macadam.bmdMode8K4320p24:
  case macadam.bmdMode8K4320p25:
  case macadam.bmdMode8K4320p2997:
  case macadam.bmdMode8K4320p30:
  case macadam.bmdMode8K4320p50:
  case macadam.bmdMode8K4320p5994:
  case macadam.bmdMode8K4320p60:
    return 7680;
  case macadam.bmdMode8kDCI2398:
  case macadam.bmdMode8kDCI24:
  case macadam.bmdMode8kDCI25:
  case macadam.bmdMode8kDCI2997:
  case macadam.bmdMode8kDCI30:
  case macadam.bmdMode8kDCI50:
  case macadam.bmdMode8kDCI5994:
  case macadam.bmdMode8kDCI60:
    return 8192;
  default:
    return 0;
  }
}

function modeHeight (mode) {
  switch (mode) {
  case macadam.bmdModeNTSC:
  case macadam.bmdModeNTSC2398:
  case macadam.bmdModeNTSCp:
    return 486;
  case macadam.bmdModePAL:
  case macadam.bmdModePALp:
    return 576;
  case macadam.bmdModeHD720p50:
  case macadam.bmdModeHD720p5994:
  case macadam.bmdModeHD720p60:
    return 720;
  case macadam.bmdModeHD1080p2398:
  case macadam.bmdModeHD1080p24:
  case macadam.bmdModeHD1080p25:
  case macadam.bmdModeHD1080p2997:
  case macadam.bmdModeHD1080p30:
  case macadam.bmdModeHD1080i50:
  case macadam.bmdModeHD1080i5994:
  case macadam.bmdModeHD1080i6000:
  case macadam.bmdModeHD1080p50:
  case macadam.bmdModeHD1080p5994:
  case macadam.bmdModeHD1080p6000:
    return 1080;
  case macadam.bmdMode2k2398:
  case macadam.bmdMode2k24:
  case macadam.bmdMode2k25:
    return 1556;
  case macadam.bmdMode2kDCI2398:
  case macadam.bmdMode2kDCI24:
  case macadam.bmdMode2kDCI25:
  case macadam.bmdMode2kDCI2997:
  case macadam.bmdMode2kDCI30:
  case macadam.bmdMode2kDCI50:
  case macadam.bmdMode2kDCI5994:
  case macadam.bmdMode2kDCI60:
    return 1080;
  case macadam.bmdMode4K2160p2398:
  case macadam.bmdMode4K2160p24:
  case macadam.bmdMode4K2160p25:
  case macadam.bmdMode4K2160p2997:
  case macadam.bmdMode4K2160p30:
  case macadam.bmdMode4K2160p50:
  case macadam.bmdMode4K2160p5994:
  case macadam.bmdMode4K2160p60:
  case macadam.bmdMode4kDCI2398:
  case macadam.bmdMode4kDCI24:
  case macadam.bmdMode4kDCI25:
  case macadam.bmdMode4kDCI2997:
  case macadam.bmdMode4kDCI30:
  case macadam.bmdMode4kDCI50:
  case macadam.bmdMode4kDCI5994:
  case macadam.bmdMode4kDCI60:
    return 2160;
  case macadam.bmdMode8K4320p2398:
  case macadam.bmdMode8K4320p24:
  case macadam.bmdMode8K4320p25:
  case macadam.bmdMode8K4320p2997:
  case macadam.bmdMode8K4320p30:
  case macadam.bmdMode8K4320p50:
  case macadam.bmdMode8K4320p5994:
  case macadam.bmdMode8K4320p60:
  case macadam.bmdMode8kDCI2398:
  case macadam.bmdMode8kDCI24:
  case macadam.bmdMode8kDCI25:
  case macadam.bmdMode8kDCI2997:
  case macadam.bmdMode8kDCI30:
  case macadam.bmdMode8kDCI50:
  case macadam.bmdMode8kDCI5994:
  case macadam.bmdMode8kDCI60:
    return 4320;
  default:
    return 0;
  }
}

// Returns the duration of a frame as fraction of a second as an array:
//   [<enumverator>, [denominotor>]
function modeGrainDuration (mode) {
  switch (mode) {
  case macadam.bmdModeNTSC:
    return [1001, 30000];
  case macadam.bmdModeNTSC2398: // 3:2 pulldown applied on card
    return [1001, 30000];
  case macadam.bmdModeNTSCp:
    return [1001, 60000];
  case macadam.bmdModePAL:
    return [1000, 25000];
  case macadam.bmdModePALp:
    return [1000, 50000];
  case macadam.bmdModeHD720p50:
    return [1000, 50000];
  case macadam.bmdModeHD720p5994:
    return [1001, 60000];
  case macadam.bmdModeHD720p60:
    return [1000, 60000];
  case macadam.bmdModeHD1080p2398:
    return [1001, 24000];
  case macadam.bmdModeHD1080p24:
    return [1000, 24000];
  case macadam.bmdModeHD1080p25:
    return [1000, 25000];
  case macadam.bmdModeHD1080p2997:
    return [1001, 30000];
  case macadam.bmdModeHD1080p30:
    return [1000, 30000];
  case macadam.bmdModeHD1080i50:
    return [1000, 25000];
  case macadam.bmdModeHD1080i5994:
    return [1001, 60000];
  case macadam.bmdModeHD1080i6000:
    return [1000, 60000];
  case macadam.bmdModeHD1080p50:
    return [1000, 50000];
  case macadam.bmdModeHD1080p5994:
    return [1001, 60000];
  case macadam.bmdModeHD1080p6000:
    return [1000, 60000];
  case macadam.bmdMode2k2398:
    return [1001, 24000];
  case macadam.bmdMode2k24:
    return [1000, 24000];
  case macadam.bmdMode2k25:
    return [1000, 25000];
  case macadam.bmdMode2kDCI2398:
    return [1001, 24000];
  case macadam.bmdMode2kDCI24:
    return [1000, 24000];
  case macadam.bmdMode2kDCI25:
    return [1000, 25000];
  case macadam.bmdMode2kDCI2997:
    return [1001, 30000];
  case macadam.bmdMode2kDCI30:
    return [1000, 30000];
  case macadam.bmdMode2kDCI50:
    return [1000, 50000];
  case macadam.bmdMode2kDCI5994:
    return [1001, 60000];
  case macadam.bmdMode2kDCI60:
    return [1000, 60000];
  case macadam.bmdMode4K2160p2398:
    return [1001, 24000];
  case macadam.bmdMode4K2160p24:
    return [1000, 24000];
  case macadam.bmdMode4K2160p25:
    return [1000, 25000];
  case macadam.bmdMode4K2160p2997:
    return [1001, 30000];
  case macadam.bmdMode4K2160p30:
    return [1000, 30000];
  case macadam.bmdMode4K2160p50:
    return [1000, 50000];
  case macadam.bmdMode4K2160p5994:
    return [1001, 60000];
  case macadam.bmdMode4K2160p60:
    return [1000, 60000];
  case macadam.bmdMode4kDCI2398:
    return [1001, 24000];
  case macadam.bmdMode4kDCI24:
    return [1000, 24000];
  case macadam.bmdMode4kDCI25:
    return [1000, 25000];
  case macadam.bmdMode4KDCI2997:
    return [1001, 30000];
  case macadam.bmdMode4KDCI30:
    return [1000, 30000];
  case macadam.bmdMode4KDCI50:
    return [1000, 50000];
  case macadam.bmdMode4KDCI5994:
    return [1001, 60000];
  case macadam.bmdMode4KDCI60:
    return [1000, 60000];
  case macadam.bmdMode8K4320p2398:
    return [1001, 24000];
  case macadam.bmdMode8K4320p24:
    return [1000, 24000];
  case macadam.bmdMode8K4320p25:
    return [1000, 25000];
  case macadam.bmdMode8K4320p2997:
    return [1001, 30000];
  case macadam.bmdMode8K4320p30:
    return [1000, 30000];
  case macadam.bmdMode8K4320p50:
    return [1000, 50000];
  case macadam.bmdMode8K4320p5994:
    return [1001, 60000];
  case macadam.bmdMode8K4320p60:
    return [1000, 60000];
  case macadam.bmdMode8kDCI2398:
    return [1001, 24000];
  case macadam.bmdMode8kDCI24:
    return [1000, 24000];
  case macadam.bmdMode8kDCI25:
    return [1000, 25000];
  case macadam.bmdMode8kDCI2997:
    return [1001, 30000];
  case macadam.bmdMode8kDCI30:
    return [1000, 30000];
  case macadam.bmdMode8kDCI50:
    return [1000, 50000];
  case macadam.bmdMode8kDCI5994:
    return [1001, 60000];
  case macadam.bmdMode8kDCI60:
    return [1000, 60000];
  default:
    return [0, 1];
  }
}

function modeInterlace (mode) {
  switch (mode) {
  case macadam.bmdModeNTSC:
  case macadam.bmdModeNTSC2398:
  case macadam.bmdModePAL:
  case macadam.bmdModeHD1080i50:
  case macadam.bmdModeHD1080i5994:
  case macadam.bmdModeHD1080i6000:
    return true;
  default:
    return false;
  }
}

function formatDepth (format) {
  switch (format) {
  case macadam.bmdFormat8BitYUV:
    return 8;
  case macadam.bmdFormat10BitYUV:
    return 10;
  case macadam.bmdFormat8BitARGB:
  case macadam.bmdFormat8BitBGRA:
    return 8;
  case macadam.bmdFormat10BitRGB:
    return 10;
  case macadam.bmdFormat12BitRGB:
  case macadam.bmdFormat12BitRGBLE:
    return 12;
  case macadam.bmdFormat10BitRGBXLE:
  case macadam.bmdFormat10BitRGBX:
    return 10;
  default:
    return 0;
  }
}

function formatFourCC (format) {
  switch (format) {
  case macadam.bmdFormat8BitYUV:
    return 'UYVY';
  case macadam.bmdFormat10BitYUV:
    return 'v210';
  case macadam.bmdFormat8BitARGB:
    return 'ARGB';
  case macadam.bmdFormat8BitBGRA:
    return 'BGRA';
  // Big-endian RGB 10-bit per component with SMPTE video levels (64-960). Packed as 2:10:10:10
  case macadam.bmdFormat10BitRGB:
    return 'r210';
  // Big-endian RGB 12-bit per component with full range (0-4095). Packed as 12-bit per component
  case macadam.bmdFormat12BitRGB:
    return 'R12B';
  // Little-endian RGB 12-bit per component with full range (0-4095). Packed as 12-bit per component
  case macadam.bmdFormat12BitRGBLE:
    return 'R12L';
  // Little-endian 10-bit RGB with SMPTE video levels (64-940)
  case macadam.bmdFormat10BitRGBXLE:
    return 'R10l';
  // Big-endian 10-bit RGB with SMPTE video levels (64-940)
  case macadam.bmdFormat10BitRGBX:
    return 'R10b';
  }
}

function fourCCFormat(fourCC) {
  switch (fourCC) {
  case 'UYVY':
    return macadam.bmdFormat8BitYUV;
  case 'v210':
  case 'pgroup':
    return macadam.bmdFormat10BitYUV;
  case 'ARGB':
    return macadam.bmdFormat8BitARGB;
  case 'BGRA':
    return macadam.bmdFormat8BitBGRA;
  // Big-endian RGB 10-bit per component with SMPTE video levels (64-960). Packed as 2:10:10:10
  case 'r210':
    return macadam.bmdFormat10BitRGB;
  // Big-endian RGB 12-bit per component with full range (0-4095). Packed as 12-bit per component
  case 'R12B':
    return macadam.bmdFormat12BitRGB;
  // Little-endian RGB 12-bit per component with full range (0-4095). Packed as 12-bit per component
  case 'R12L':
    return macadam.bmdFormat12BitRGBLE;
  // Little-endian 10-bit RGB with SMPTE video levels (64-940)
  case 'R10l':
    return macadam.bmdFormat10BitRGBXLE;
  // Big-endian 10-bit RGB with SMPTE video levels (64-940)
  case 'R10b':
    return macadam.bmdFormat10BitRGBX;
  }
}

function formatSampling (format) {
  switch (format) {
  case macadam.bmdFormat8BitYUV:
    return 'YCbCr-4:2:2';
  case macadam.bmdFormat10BitYUV:
    return 'YCbCr-4:2:2';
  case macadam.bmdFormat8BitARGB:
    return 'ARGB';
  case macadam.bmdFormat8BitBGRA:
    return 'BGRA';
  // Big-endian RGB 10-bit per component with SMPTE video levels (64-960). Packed as 2:10:10:10
  case macadam.bmdFormat10BitRGB:
    return 'RGB';
  // Big-endian RGB 12-bit per component with full range (0-4095). Packed as 12-bit per component
  case macadam.bmdFormat12BitRGB:
    return 'RGB';
  // Little-endian RGB 12-bit per component with full range (0-4095). Packed as 12-bit per component
  case macadam.bmdFormat12BitRGBLE:
    return 'RGB';
  // Little-endian 10-bit RGB with SMPTE video levels (64-940)
  case macadam.bmdFormat10BitRGBXLE:
    return 'RGB';
  // Big-endian 10-bit RGB with SMPTE video levels (64-940)
  case macadam.bmdFormat10BitRGBX:
    return 'RGB';
  default:
    return '';
  }
}

function formatColorimetry (format) {
  switch (format) {
  case macadam.bmdFormat8BitYUV:
    return 'BT601-5';
  case macadam.bmdFormat10BitYUV:
    return 'BT709-2';
  case macadam.bmdFormat8BitARGB:
    return 'FULL';
  case macadam.bmdFormat8BitBGRA:
    return 'FULL';
  // Big-endian RGB 10-bit per component with SMPTE video levels (64-960). Packed as 2:10:10:10
  case macadam.bmdFormat10BitRGB:
    return 'SMPTE240M';
  // Big-endian RGB 12-bit per component with full range (0-4095). Packed as 12-bit per component
  case macadam.bmdFormat12BitRGB:
    return 'FULL';
  // Little-endian RGB 12-bit per component with full range (0-4095). Packed as 12-bit per component
  case macadam.bmdFormat12BitRGBLE:
    return 'FULL';
  // Little-endian 10-bit RGB with SMPTE video levels (64-940)
  case macadam.bmdFormat10BitRGBXLE:
    return 'SMPTE240M';
  // Big-endian 10-bit RGB with SMPTE video levels (64-940)
  case macadam.bmdFormat10BitRGBX:
    return 'SMPTE240M';
  default:
    return '';
  }
}

var macadam = {
  /* Enum BMDDisplayMode - Video display modes */
  /* SD Modes */
  bmdModeNTSC                     : bmCodeToInt('ntsc'),
  bmdModeNTSC2398                 : bmCodeToInt('nt23'),	// 3:2 pulldown
  bmdModePAL                      : bmCodeToInt('pal '),
  bmdModeNTSCp                    : bmCodeToInt('ntsp'),
  bmdModePALp                     : bmCodeToInt('palp'),
  /* HD 1080 Modes */
  bmdModeHD1080p2398              : bmCodeToInt('23ps'),
  bmdModeHD1080p24                : bmCodeToInt('24ps'),
  bmdModeHD1080p25                : bmCodeToInt('Hp25'),
  bmdModeHD1080p2997              : bmCodeToInt('Hp29'),
  bmdModeHD1080p30                : bmCodeToInt('Hp30'),
  bmdModeHD1080i50                : bmCodeToInt('Hi50'),
  bmdModeHD1080i5994              : bmCodeToInt('Hi59'),
  bmdModeHD1080i6000              : bmCodeToInt('Hi60'),	// N.B. This _really_ is 60.00 Hz.
  bmdModeHD1080p50                : bmCodeToInt('Hp50'),
  bmdModeHD1080p5994              : bmCodeToInt('Hp59'),
  bmdModeHD1080p6000              : bmCodeToInt('Hp60'),	// N.B. This _really_ is 60.00 Hz.
  /* HD 720 Modes */
  bmdModeHD720p50                 : bmCodeToInt('hp50'),
  bmdModeHD720p5994               : bmCodeToInt('hp59'),
  bmdModeHD720p60                 : bmCodeToInt('hp60'),
  /* 2k Modes */
  bmdMode2k2398                   : bmCodeToInt('2k23'),
  bmdMode2k24                     : bmCodeToInt('2k24'),
  bmdMode2k25                     : bmCodeToInt('2k25'),
  /* 2k DCI modes */
  bmdMode2kDCI2398                : bmCodeToInt('2d23'),
  bmdMode2kDCI24                  : bmCodeToInt('2d24'),
  bmdMode2kDCI25                  : bmCodeToInt('2d25'),
  bmdMode2kDCI2997                : bmCodeToInt('2d29'),
  bmdMode2kDCI30                  : bmCodeToInt('2d30'),
  bmdMode2kDCI50                  : bmCodeToInt('2d50'),
  bmdMode2kDCI5994                : bmCodeToInt('2d59'),
  bmdMode2kDCI60                  : bmCodeToInt('2d60'),
  /* 4k UHD Modes */
  bmdMode4K2160p2398              : bmCodeToInt('4k23'),
  bmdMode4K2160p24                : bmCodeToInt('4k24'),
  bmdMode4K2160p25                : bmCodeToInt('4k25'),
  bmdMode4K2160p2997              : bmCodeToInt('4k29'),
  bmdMode4K2160p30                : bmCodeToInt('4k30'),
  bmdMode4K2160p50                : bmCodeToInt('4k50'),
  bmdMode4K2160p5994              : bmCodeToInt('4k59'),
  bmdMode4K2160p60                : bmCodeToInt('4k60'),
  /* 4k DCI modes  */
  bmdMode4kDCI2398                : bmCodeToInt('4d23'),
  bmdMode4kDCI24                  : bmCodeToInt('4d24'),
  bmdMode4kDCI25                  : bmCodeToInt('4d25'),
  bmdMode4kDCI2997                : bmCodeToInt('4d29'),
  bmdMode4kDCI30                  : bmCodeToInt('4d30'),
  bmdMode4kDCI50                  : bmCodeToInt('4d50'),
  bmdMode4kDCI5994                : bmCodeToInt('4d59'),
  bmdMode4kDCI60                  : bmCodeToInt('4d60'),
  /* 8K UHD Modes */
  bmdMode8K4320p2398              : bmCodeToInt('8k23'),
  bmdMode8K4320p24                : bmCodeToInt('8k24'),
  bmdMode8K4320p25                : bmCodeToInt('8k25'),
  bmdMode8K4320p2997              : bmCodeToInt('8k29'),
  bmdMode8K4320p30                : bmCodeToInt('8k30'),
  bmdMode8K4320p50                : bmCodeToInt('8k50'),
  bmdMode8K4320p5994              : bmCodeToInt('8k59'),
  bmdMode8K4320p60                : bmCodeToInt('8k60'),
  /* 8K DCI Modes */
  bmdMode8kDCI2398                : bmCodeToInt('8d23'),
  bmdMode8kDCI24                  : bmCodeToInt('8d24'),
  bmdMode8kDCI25                  : bmCodeToInt('8d25'),
  bmdMode8kDCI2997                : bmCodeToInt('8d29'),
  bmdMode8kDCI30                  : bmCodeToInt('8d30'),
  bmdMode8kDCI50                  : bmCodeToInt('8d50'),
  bmdMode8kDCI5994                : bmCodeToInt('8d59'),
  bmdMode8kDCI60                  : bmCodeToInt('8d60'),
  /* Special Modes */
  bmdModeUnknown                  : bmCodeToInt('iunk'),
  /* Enum BMDFieldDominance - Video field dominance */
  bmdUnknownFieldDominance        : 0,
  bmdLowerFieldFirst              : bmCodeToInt('lowr'),
  bmdUpperFieldFirst              : bmCodeToInt('uppr'),
  bmdProgressiveFrame             : bmCodeToInt('prog'),
  bmdProgressiveSegmentedFrame    : bmCodeToInt('psf '),
  /* Enum BMDPixelFormat - Video pixel formats supported for output/input */
  bmdFormat8BitYUV                : bmCodeToInt('2vuy'),
  bmdFormat10BitYUV               : bmCodeToInt('v210'),
  bmdFormat8BitARGB               : 32,
  bmdFormat8BitBGRA               : bmCodeToInt('BGRA'),
  // Big-endian RGB 10-bit per component with SMPTE video levels (64-960). Packed as 2:10:10:10
  bmdFormat10BitRGB               : bmCodeToInt('r210'),
  // Big-endian RGB 12-bit per component with full range (0-4095). Packed as 12-bit per component
  bmdFormat12BitRGB               : bmCodeToInt('R12B'),
  // Little-endian RGB 12-bit per component with full range (0-4095). Packed as 12-bit per component
  bmdFormat12BitRGBLE             : bmCodeToInt('R12L'),
  // Little-endian 10-bit RGB with SMPTE video levels (64-940)
  bmdFormat10BitRGBXLE            : bmCodeToInt('R10l'),
  // Big-endian 10-bit RGB with SMPTE video levels (64-940)
  bmdFormat10BitRGBX              : bmCodeToInt('R10b'),
  /* Enum BMDDisplayModeFlags - Flags to describe the characteristics of an IDeckLinkDisplayMode. */
  bmdDisplayModeSupports3D        : 1 << 0,
  bmdDisplayModeColorspaceRec601  : 1 << 1,
  bmdDisplayModeColorspaceRec709  : 1 << 2,
  bmdDisplayModeColorspaceRec2020 : 1 << 3,
  // Audio parameters
  bmdAudioSampleRate48kHz	        : 48000,
  bmdAudioSampleType16bitInteger	: 16,
  bmdAudioSampleType32bitInteger	: 32,
  // BMDVideo3DPackingFormat
  bmdVideo3DPackingSidebySideHalf : bmCodeToInt('sbsh'), // Frames are packed side-by-side as a single stream.
  bmdVideo3DPackingLinebyLine     : bmCodeToInt('lbyl'), // The two eye frames are packed on alternating lines of the source frame.
  bmdVideo3DPackingTopAndBottom   : bmCodeToInt('tabo'), // The two eye frames are packed into the top and bottom half of the source frame.
  bmdVideo3DPackingFramePacking   : bmCodeToInt('frpk'), // Frame packing is a standard HDMI 1.4a 3D mode (Top / Bottom full).
  bmdVideo3DPackingLeftOnly       : bmCodeToInt('left'), // Only the left eye frame is displayed.
  bmdVideo3DPackingRightOnly      : bmCodeToInt('righ'), // Only the right eye frame is displayed.
  // BMDDeckLinkCapturePassthroughMode
  bmdDeckLinkCapturePassthroughModeDisabled    : bmCodeToInt('pdis'), // Electronic connection - input to output
  bmdDeckLinkCapturePassthroughModeDirect      : bmCodeToInt('pdir'), // Uses playout mechanism for clear switch
  bmdDeckLinkCapturePassthroughModeCleanSwitch : bmCodeToInt('pcln'), // No input to output link - use idle mode
  // BMDVideoOutputConversionMode
  bmdNoVideoOutputConversion                             : bmCodeToInt('none'), // No video output conversion
  bmdVideoOutputLetterboxDownconversion                  : bmCodeToInt('ltbx'), // Down-converted letterbox SD output
  bmdVideoOutputAnamorphicDownconversion                 : bmCodeToInt('amph'), // Down-converted anamorphic SD output
  bmdVideoOutputHD720toHD1080Conversion                  : bmCodeToInt('720c'), // HD720 to HD1080 conversion output
  bmdVideoOutputHardwareLetterboxDownconversion          : bmCodeToInt('HWlb'), // Simultaneous HD and down-converted letterbox SD
  bmdVideoOutputHardwareAnamorphicDownconversion         : bmCodeToInt('HWam'), // Simultaneous HD and down-converted anamorphic SD
  bmdVideoOutputHardwareCenterCutDownconversion          : bmCodeToInt('HWcc'), // Simultaneous HD and center cut SD
  bmdVideoOutputHardware720p1080pCrossconversion         : bmCodeToInt('xcap'), // Simultaneous 720p and 1080p cross-conversion
  bmdVideoOutputHardwareAnamorphic720pUpconversion       : bmCodeToInt('ua7p'), // Simultaneous SD and up-converted anamorphic 720p
  bmdVideoOutputHardwareAnamorphic1080iUpconversion      : bmCodeToInt('ua1i'), // Simultaneous SD and up-converted anamorphic 1080i
  bmdVideoOutputHardwareAnamorphic149To720pUpconversion  : bmCodeToInt('u47p'), // Simultaneous SD and up-converted anamorphic widescreen aspect ratio 14:9 to 720p.
  bmdVideoOutputHardwareAnamorphic149To1080iUpconversion : bmCodeToInt('u41i'), // Simultaneous SD and up-converted anamorphic widescreen aspect ratio 14:9 to 1080i.
  bmdVideoOutputHardwarePillarbox720pUpconversion        : bmCodeToInt('up7p'), // Simultaneous SD and up-converted pillarbox 720p
  bmdVideoOutputHardwarePillarbox1080iUpconversion       : bmCodeToInt('up1i'), // Simultaneous SD and up-converted pillarbox 1080i
  // BMDVideoInputConversionMode
  bmdNoVideoInputConversion                       : bmCodeToInt('none'), // No video input conversion
  bmdVideoInputLetterboxDownconversionFromHD1080  : bmCodeToInt('10lb'), // HD1080 to SD video input down conversion
  bmdVideoInputAnamorphicDownconversionFromHD1080 : bmCodeToInt('10am'), // Anamorphic from HD1080 to SD video input down conversion
  bmdVideoInputLetterboxDownconversionFromHD720   : bmCodeToInt('72lb'), // Letter box from HD720 to SD video input down conversion
  bmdVideoInputAnamorphicDownconversionFromHD720  : bmCodeToInt('72am'), // Anamorphic from HD720 to SD video input down conversion
  bmdVideoInputLetterboxUpconversion              : bmCodeToInt('lbup'), // Letterbox video input up conversion
  bmdVideoInputAnamorphicUpconversion             : bmCodeToInt('amup'), // Anamorphic video input up conversion
  // BMDAnalogVideoFlags
  bmdAnalogVideoFlagCompositeSetup75        : 1 << 0, // If set, composite black level is 7.5 IRE (USA) rather than 0.0 IRE (Japan)
  bmdAnalogVideoFlagComponentBetacamLevels  : 1 << 1, // IF set, component video color different channels boosted 4/3 for Betacam
  // BMDVideoConnection
  bmdVideoConnectionSDI        : 1 << 0,
  bmdVideoConnectionHDMI       : 1 << 1,
  bmdVideoConnectionOpticalSDI : 1 << 2,
  bmdVideoConnectionComponent  : 1 << 3,
  bmdVideoConnectionComposite  : 1 << 4,
  bmdVideoConnectionSVideo     : 1 << 5,
  // BMDAudioConnectionAnalog
  bmdAudioConnectionEmbedded   : 1 << 0,
  bmdAudioConnectionAESEBU     : 1 << 1,
  bmdAudioConnectionAnalog     : 1 << 2,
  bmdAudioConnectionAnalogXLR  : 1 << 3,
  bmdAudioConnectionAnalogRCA  : 1 << 4,
  bmdAudioConnectionMicrophone : 1 << 5,
  bmdAudioConnectionHeadphones : 1 << 6,
  // BMDLinkConfiguration
  bmdLinkConfigurationSingleLink : bmCodeToInt('lcsl'), // A single video stream uses one connector
  bmdLinkConfigurationDualLink   : bmCodeToInt('lcdl'), // A single video stream uses two connectors
  bmdLinkConfigurationQuadLink   : bmCodeToInt('lcql'), // A single video stream uses four connectors
  // BMDIdleVideoOutputOperation
  bmdIdleVideoOutputBlack      : bmCodeToInt('blac'), // When not playing video, the device will output black frames
  bmdIdleVideoOutputLastFrame  : bmCodeToInt('lafa'), // When not playing video, the device will output the last frame played
  // BMDDeckControlConnection
  bmdDeckControlConnectionRS422Remote1 : 1 << 0, // First RS422 deck control connection
  bmdDeckControlConnectionRS422Remote2 : 1 << 1, // Second RS422 deck control connection
  // BMDDuplexMode
  bmdDuplexModeFull : bmCodeToInt('fdup'), // Configure this sub-device to use two connectors (full-duplex).
  bmdDuplexModeHalf : bmCodeToInt('hdup'), // Configure this sub-device to use a single connector (half-duplex).
  // Convert to and from Black Magic codes.
  intToBMCode : intToBMCode,
  bmCodeToInt : bmCodeToInt, //
  // Get parameters from modes and formats
  modeWidth : modeWidth,
  modeHeight : modeHeight,
  modeGrainDuration : modeGrainDuration,
  modeInterlace : modeInterlace,
  formatDepth : formatDepth,
  formatFourCC : formatFourCC,
  fourCCFormat : fourCCFormat,
  formatSampling : formatSampling,
  formatColorimetry : formatColorimetry,
  // access details about the currently connected devices
  deckLinkVersion : macadamNative.deckLinkVersion,
  getFirstDevice : macadamNative.getFirstDevice,
  getDeviceInfo : macadamNative.getDeviceInfo,
  getDeviceConfig : macadamNative.getDeviceConfig,
  setDeviceConfig : macadamNative.setDeviceConfig,
  // Raw access to device classes
  DirectCapture : macadamNative.Capture,
  Capture : Capture,
  Playback : Playback,
  capture : macadamNative.capture,
  playback : macadamNative.playback
};

module.exports = macadam;
