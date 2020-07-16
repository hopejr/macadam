/* Copyright 2020 Streampunk Media Ltd.

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

/* Enum BMDDisplayMode - Video display modes */
/* SD Modes */
export const bmdModeNTSC                     : number
export const bmdModeNTSC2398                 : number	// 3:2 pulldown
export const bmdModePAL                      : number
export const bmdModeNTSCp                    : number
export const bmdModePALp                     : number
/* HD 1080 Modes */
export const bmdModeHD1080p2398              : number
export const bmdModeHD1080p24                : number
export const bmdModeHD1080p25                : number
export const bmdModeHD1080p2997              : number
export const bmdModeHD1080p30                : number
export const bmdModeHD1080i50                : number
export const bmdModeHD1080i5994              : number
export const bmdModeHD1080i6000              : number	// N.B. This _really_ is 60.00 Hz.
export const bmdModeHD1080p50                : number
export const bmdModeHD1080p5994              : number
export const bmdModeHD1080p6000              : number	// N.B. This _really_ is 60.00 Hz.
/* HD 720 Modes */
export const bmdModeHD720p50                 : number
export const bmdModeHD720p5994               : number
export const bmdModeHD720p60                 : number
/* 2k Modes */
export const bmdMode2k2398                   : number
export const bmdMode2k24                     : number
export const bmdMode2k25                     : number
/* 2k DCI modes */
export const bmdMode2kDCI2398                : number
export const bmdMode2kDCI24                  : number
export const bmdMode2kDCI25                  : number
export const bmdMode2kDCI2997                : number
export const bmdMode2kDCI30                  : number
export const bmdMode2kDCI50                  : number
export const bmdMode2kDCI5994                : number
export const bmdMode2kDCI60                  : number
/* 4k UHD Modes */
export const bmdMode4K2160p2398              : number
export const bmdMode4K2160p24                : number
export const bmdMode4K2160p25                : number
export const bmdMode4K2160p2997              : number
export const bmdMode4K2160p30                : number
export const bmdMode4K2160p50                : number
export const bmdMode4K2160p5994              : number
export const bmdMode4K2160p60                : number
/* 4k DCI modes  */
export const bmdMode4kDCI2398                : number
export const bmdMode4kDCI24                  : number
export const bmdMode4kDCI25                  : number
export const bmdMode4kDCI2997                : number
export const bmdMode4kDCI30                  : number
export const bmdMode4kDCI50                  : number
export const bmdMode4kDCI5994                : number
export const bmdMode4kDCI60                  : number
/* 8K UHD Modes */
export const bmdMode8K4320p2398              : number
export const bmdMode8K4320p24                : number
export const bmdMode8K4320p25                : number
export const bmdMode8K4320p2997              : number
export const bmdMode8K4320p30                : number
export const bmdMode8K4320p50                : number
export const bmdMode8K4320p5994              : number
export const bmdMode8K4320p60                : number
/* 8K DCI Modes */
export const bmdMode8kDCI2398                : number
export const bmdMode8kDCI24                  : number
export const bmdMode8kDCI25                  : number
export const bmdMode8kDCI2997                : number
export const bmdMode8kDCI30                  : number
export const bmdMode8kDCI50                  : number
export const bmdMode8kDCI5994                : number
export const bmdMode8kDCI60                  : number
/* Special Modes */
export const bmdModeUnknown                  : number
/* Enum BMDFieldDominance - Video field dominance */
export const bmdUnknownFieldDominance        : number
export const bmdLowerFieldFirst              : number
export const bmdUpperFieldFirst              : number
export const bmdProgressiveFrame             : number
export const bmdProgressiveSegmentedFrame    : number
/* Enum BMDPixelFormat - Video pixel formats supported for output/input */
export const bmdFormat8BitYUV                : number
export const bmdFormat10BitYUV               : number
export const bmdFormat8BitARGB               : number
export const bmdFormat8BitBGRA               : number
// Big-endian RGB 10-bit per component with SMPTE video levels (64-960). Packed as 2:10:10:10
export const bmdFormat10BitRGB               : number
// Big-endian RGB 12-bit per component with full range (0-4095). Packed as 12-bit per component
export const bmdFormat12BitRGB               : number
// Little-endian RGB 12-bit per component with full range (0-4095). Packed as 12-bit per component
export const bmdFormat12BitRGBLE             : number
// Little-endian 10-bit RGB with SMPTE video levels (64-940)
export const bmdFormat10BitRGBXLE            : number
// Big-endian 10-bit RGB with SMPTE video levels (64-940)
export const bmdFormat10BitRGBX              : number
/* Enum BMDDisplayModeFlags - Flags to describe the characteristics of an IDeckLinkDisplayMode. */
export const bmdDisplayModeSupports3D        : number
export const bmdDisplayModeColorspaceRec601  : number
export const bmdDisplayModeColorspaceRec709  : number
export const bmdDisplayModeColorspaceRec2020 : number
// Audio parameters
export const bmdAudioSampleRate48kHz	       : number
export const bmdAudioSampleType16bitInteger	 : number
export const bmdAudioSampleType32bitInteger  : number
  // BMDVideo3DPackingFormat
export const bmdVideo3DPackingSidebySideHalf : number // Frames are packed side-by-side as a single stream.
export const bmdVideo3DPackingLinebyLine     : number // The two eye frames are packed on alternating lines of the source frame.
export const bmdVideo3DPackingTopAndBottom   : number // The two eye frames are packed into the top and bottom half of the source frame.
export const bmdVideo3DPackingFramePacking   : number // Frame packing is a standard HDMI 1.4a 3D mode (Top / Bottom full).
export const bmdVideo3DPackingLeftOnly       : number // Only the left eye frame is displayed.
export const bmdVideo3DPackingRightOnly      : number // Only the right eye frame is displayed.
// BMDDeckLinkCapturePassthroughMode
export const bmdDeckLinkCapturePassthroughModeDisabled    : number // Electronic connection - input to output
export const bmdDeckLinkCapturePassthroughModeDirect      : number // Uses playout mechanism for clear switch
export const bmdDeckLinkCapturePassthroughModeCleanSwitch : number // No input to output link - use idle mode
// BMDVideoOutputConversionMode
export const bmdNoVideoOutputConversion                             : number // No video output conversion
export const bmdVideoOutputLetterboxDownconversion                  : number // Down-converted letterbox SD output
export const bmdVideoOutputAnamorphicDownconversion                 : number // Down-converted anamorphic SD output
export const bmdVideoOutputHD720toHD1080Conversion                  : number // HD720 to HD1080 conversion output
export const bmdVideoOutputHardwareLetterboxDownconversion          : number // Simultaneous HD and down-converted letterbox SD
export const bmdVideoOutputHardwareAnamorphicDownconversion         : number // Simultaneous HD and down-converted anamorphic SD
export const bmdVideoOutputHardwareCenterCutDownconversion          : number // Simultaneous HD and center cut SD
export const bmdVideoOutputHardware720p1080pCrossconversion         : number // Simultaneous 720p and 1080p cross-conversion
export const bmdVideoOutputHardwareAnamorphic720pUpconversion       : number // Simultaneous SD and up-converted anamorphic 720p
export const bmdVideoOutputHardwareAnamorphic1080iUpconversion      : number // Simultaneous SD and up-converted anamorphic 1080i
export const bmdVideoOutputHardwareAnamorphic149To720pUpconversion  : number // Simultaneous SD and up-converted anamorphic widescreen aspect ratio 14:9 to 720p.
export const bmdVideoOutputHardwareAnamorphic149To1080iUpconversion : number // Simultaneous SD and up-converted anamorphic widescreen aspect ratio 14:9 to 1080i.
export const bmdVideoOutputHardwarePillarbox720pUpconversion        : number // Simultaneous SD and up-converted pillarbox 720p
export const bmdVideoOutputHardwarePillarbox1080iUpconversion       : number // Simultaneous SD and up-converted pillarbox 1080i
// BMDVideoInputConversionMode
export const bmdNoVideoInputConversion                       : number // No video input conversion
export const bmdVideoInputLetterboxDownconversionFromHD1080  : number // HD1080 to SD video input down conversion
export const bmdVideoInputAnamorphicDownconversionFromHD1080 : number // Anamorphic from HD1080 to SD video input down conversion
export const bmdVideoInputLetterboxDownconversionFromHD720   : number // Letter box from HD720 to SD video input down conversion
export const bmdVideoInputAnamorphicDownconversionFromHD720  : number // Anamorphic from HD720 to SD video input down conversion
export const bmdVideoInputLetterboxUpconversion              : number // Letterbox video input up conversion
export const bmdVideoInputAnamorphicUpconversion             : number // Anamorphic video input up conversion
// BMDAnalogVideoFlags
export const bmdAnalogVideoFlagCompositeSetup75        : number // If set, composite black level is 7.5 IRE (USA) rather than 0.0 IRE (Japan)
export const bmdAnalogVideoFlagComponentBetacamLevels  : number // IF set, component video color different channels boosted 4/3 for Betacam
// BMDVideoConnection
export const bmdVideoConnectionSDI        : number
export const bmdVideoConnectionHDMI       : number
export const bmdVideoConnectionOpticalSDI : number
export const bmdVideoConnectionComponent  : number
export const bmdVideoConnectionComposite  : number
export const bmdVideoConnectionSVideo     : number
// BMDAudioConnectionAnalog
export const bmdAudioConnectionEmbedded   : number
export const bmdAudioConnectionAESEBU     : number
export const bmdAudioConnectionAnalog     : number
export const bmdAudioConnectionAnalogXLR  : number
export const bmdAudioConnectionAnalogRCA  : number
export const bmdAudioConnectionMicrophone : number
export const bmdAudioConnectionHeadphones : number
// BMDLinkConfiguration
export const bmdLinkConfigurationSingleLink : number // A single video stream uses one connector
export const bmdLinkConfigurationDualLink   : number // A single video stream uses two connectors
export const bmdLinkConfigurationQuadLink   : number // A single video stream uses four connectors
// BMDIdleVideoOutputOperation
export const bmdIdleVideoOutputBlack      : number // When not playing video, the device will output black frames
export const bmdIdleVideoOutputLastFrame  : number // When not playing video, the device will output the last frame played
// BMDDeckControlConnection
export const bmdDeckControlConnectionRS422Remote1 : number // First RS422 deck control connection
export const bmdDeckControlConnectionRS422Remote2 : number // Second RS422 deck control connection
// BMDDuplexMode
export const bmdDuplexModeFull : number // Configure this sub-device to use two connectors (full-duplex).
export const bmdDuplexModeHalf : number // Configure this sub-device to use a single connector (half-duplex).

  // Convert to and from Black Magic codes.
export function intToBMCode(i: number) : string
export function bmCodeToInt(s: string) : number

// Get parameters from modes and formats
export function modeWidth(m: number) : number
export function modeHeight(m: number) : number
/** Returns the duration of a frame as fraction of a second as an array: [<numerator>, <denominator>] */
export function modeGrainDuration(m: number) : number[]
export function modeInterlace(m: number) : boolean
export function formatDepth(f: number) :  number
export function formatFourCC(f: number) : number
export function fourCCFormat(fcc: string) : number
export function formatSampling(f: number) : string
export function formatColorimetry(f: number) : string

// access details about the currently connected devices
export function deckLinkVersion() : string
export function getFirstDevice() : string

export function getDeviceInfo() : { [key: string]: unknown }

export type ConfigParams = { [key: string]: unknown }

export function getDeviceConfig(i: number) : ConfigParams
export function setDeviceConfig(config: ConfigParams) : ConfigParams

export type Dominance = 'progressiveFrame' | 'upperFieldFirst' | 'lowerFieldFirst' | 'unknown'

export interface CaptureFrame {
  type: 'frame',
  video: {
    type: 'videoFrame',
    width: number,
    height: number,
    rowBytes: number,
    frameTime: number,
    frameDuration: number,
    data: Buffer,
    flipVertical?: boolean
    hasNoInputSource?: boolean,
    capturedAsPsF?: boolean,
    timecode: string,
    userbits: number,
    hardwareRefFrameTime: number,
    hardwareRefFrameDuration: number
  }
  audio: {
    type: 'audioPacket',
    packetTime: number,
    sampleFrameCount: number,
    data: Buffer
  }
}

export interface CaptureChannel {
  type: 'capture'
  displayModeName: string
  width: number
  height: number
  fieldDominance: Dominance
  frameRate: number[]
  pixelFormat: string
  audioEnabled: boolean

  /** Wait for the next frames-worth of data */
  frame(): Promise<CaptureFrame>

  /** Stop the resolution of outstanding frame promises and skip frames on the input */
  pause(): undefined

  /** Stop the capture and release resources */
  stop(): undefined
}

export function capture(params: {
  /** Index relative to the 'macadam.getDeviceInfo()' array */
  deviceIndex: number, // Index relative to the 'macadam.getDeviceInfo()' array
  /** A bmdMode* value to describe the video standard */
  displayMode?: number,
  /** A bmdFormat* value to describe the video format */
  pixelFormat?: number,
  /** Enables audio - omit if audio is not required */
  channels?: number, // enables audio - omit if audio is not required
  /** A bmdAudioSampleRate* value to describe the audio sample rate */
  sampleRate?: number,
  /** A bmdAudioSampleType* value to describe the audio sample type */
  sampleType?: number
}): CaptureChannel

export type PlayoutResult = { [key: string]: unknown }

export interface PlaybackChannel {
  type: 'playback'
  displayModeName: string
  width: number
  height: number
  rowBytes: number
  bufferSize: number
  fieldDominance: Dominance
  frameRate: number[]
  pixelFormat: string
  audioEnabled: boolean
  rejectTimeout: number
  enableKeying: boolean
  startTimecode: string | undefined

  /**
   * For synchronous playback, frame data is sent to the card immediately for display
   * at the next possible opportunity using the `displayFrame` method.
   * It is up to the user of the synchronous API to make sure that frame data is
   * replaced at a suitable frequency to ensure smooth playback.
   * The `playback.hardwareTime()` method can be used to help with this.
   * @param frame A Node.js Buffer containing frame data
   */
  displayFrame(frame: Buffer): Promise<void>

  /**
   * To playback data using the scheduler, you need to place the frames onto a virtual timeline
   * and then start the scheduler's clock.
   */
  schedule(params: {
    /** Video frame data. Decklink SDK docs have byte packing */
    video: Buffer,
    /** Relative to `frameRate` in playback object. Hint: Use 1001 for fractional framerates like 59.94 */
    time: number,
    /** Frames-worth of interleaved audio data */
    audio?: Buffer,
    /** Optional - otherwise based on buffer length */
    sampleFrameCount?: number
  }): undefined

  /**
   * Start the scheduler's clock. You must keep the queue of frames to be played ahead
   * of the current playback position by at least a couple of frames.
   * The best way to do this is to create a promise that waits for a specific frame to be
   * played and use the promise resolution as a trigger to show the next one.
   */
  start(params?: {
    /**
     * Time to start scheduled playback from, measured in units of playback `frameRate`.
     * Defaults to `0`.
     */
    startTime?: number,
    /**
     * Relative playback speed. Allows slower or reverse play.
     * Defaults to `1.0` for real time forward playback.
     */
    playbackSpeed?: number
  }): undefined

  /** Once playback if finished, call `playback.stop()` to release the associated resources. */
  stop(): undefined

  /**
   * Regulate playback based on played time - latency depends on hw.
   * @param time Measured in units of `frameRate` in playback object
   * @returns a promise that resolves to an object with details of playout
   */
  played(time: number): Promise<PlayoutResult>

  /** Get the status of the playback reference */
  referenceStatus(): 'ReferenceNotSupportedByHardware' | 'ReferenceLocked' | 'ReferenceNotLocked'
  /**
   * How many ticks have elapsed from the start time until now.
   * In units of the `frameRate` defined for the playback
   */
  scheduledTime(): { type: 'scheduledStreamTime', streamTime: number, playbackSpeed: number }

  /** Details of the current hardware reference clock */
  hardwareTime(): {
    type: 'hardwareRefClock',
    timeScale: number,
    /** Relative value with no specific reference to an external clock but that can be compared between values */
    hardwareTime: number,
    /** Number of ticks relative to the timescale since the last frame was displayed */
    timeInFrame: number,
    ticksPerFrame: number
  }

  /** Number of frames currently buffered for playback */
  bufferedFrames(): number

  /**
   * Number of audio frames (e.g. 1920 _audio frames_ per video frame at 1080i50)
   * currently buffered for playback
   */  
  bufferedAudioFrames(): number

  /** Ramp up the key level to `255` over a given number of frames */
  rampUp(frameCount: number): undefined

  /** Ramp down the key level to `0` over a given number of frames */
  rampDown(frameCount: number): undefined

  /** Set the overall key level */
  setLevel(level: number): undefined

  /** Sets a new timecode value based on the given string to be used. Used from the next frame onwards */
  setTimecode(tc: string): string

  /** Gets the current timecode value - the one to be used for the next frame to be output */
  getTimecode(): string

  /** Sets the timecode user bits field from a 32-bit integer. These become the user bits to be sent with the next frame */
  setTimecodeUserbits(ub: number): undefined

  /** Gets the current timecode user bits represented as a 32-bit integer. These are the user bits to be sent with the next frame */
  getTimecodeUserbits(): number
}

/** Create a playback channel on a selected device index */
export function playback(params: {
  /** Index relative to the 'macadam.getDeviceInfo()' array */
  deviceIndex: number,
  /** A bmdMode* value to describe the video standard */
  displayMode?: number,
  /** A bmdFormat* value to describe the video format */
  pixelFormat?: number,
  /** Enables audio - omit if audio is not required */
  channels?: number,
  /** A bmdAudioSampleRate* value to describe the audio sample rate */
  sampleRate?: number,
  /** A bmdAudioSampleType* value to describe the audio sample type */
  sampleType?: number,
  /** Scheduled playback timeout */
  rejectTimeout?: number,
  /** Only 8-bit ARGB and BGRA are supported */
  enableKeying?: boolean,
  /** Default is false for internal keying */
  isExternal?: boolean,
  /**
   * Range between `0` (fully translucent) and `255` (opaque) and a default value of `255`.
   * The alpha level in the image key is reduced according to overall level set for the keyer.
   */
  level?: number,
  /** Leave unset or set to undefined for no timecode */
  startTimecode?: string
}): PlaybackChannel;
