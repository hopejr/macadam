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
 ** Copyright (c) 2010 Blackmagic Design
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

#ifndef PLAYBACK_PROMISE_H
#define PLAYBACK_PROMISE_H

#include <map>

#ifdef WIN32
#include <tchar.h>
#include <conio.h>
#include <objbase.h>		// Necessary for COM
#include <comdef.h>
#endif

#include "macadam_util.h"
#include "timecode.h"
#include "node_api.h"
#include "DeckLinkAPI.h"

napi_value playback(napi_env env, napi_callback_info info);
void playedFrame(napi_env env, napi_value jsCb, void* context, void* data);
void playbackTsFnFinalize(napi_env env, void* data, void* hint);
napi_value displayFrame(napi_env env, napi_callback_info info);
napi_value startPlayback(napi_env env, napi_callback_info info);
napi_value stopPlayback(napi_env env, napi_callback_info info);
napi_value schedule(napi_env env, napi_callback_info info);
napi_value played(napi_env env, napi_callback_info info);
napi_value referenceStatus(napi_env env, napi_callback_info info);
napi_value scheduledStreamTime(napi_env env, napi_callback_info info);
napi_value hardwareReferenceClock(napi_env env, napi_callback_info info);
napi_value bufferedVideoFrameCount(napi_env env, napi_callback_info info);
napi_value bufferedAudioSampleFrameCount(napi_env env, napi_callback_info info);
napi_value rampUp(napi_env env, napi_callback_info info);
napi_value rampDown(napi_env env, napi_callback_info info);
napi_value setLevel(napi_env env, napi_callback_info info);
napi_value setTimecode(napi_env env, napi_callback_info info);
napi_value getTimecode(napi_env env, napi_callback_info info);
napi_value getTimecodeUserbits(napi_env env, napi_callback_info info);
napi_value setTimecodeUserbits(napi_env env, napi_callback_info info);

struct playbackCarrier : carrier {
  IDeckLinkOutput* deckLinkOutput = nullptr;
  IDeckLinkKeyer* deckLinkKeyer = nullptr;
  uint32_t deviceIndex = 0;
  BMDDisplayMode requestedDisplayMode;
  BMDPixelFormat requestedPixelFormat;
  BMDAudioSampleRate requestedSampleRate = bmdAudioSampleRate48kHz;
  BMDAudioSampleType requestedSampleType = bmdAudioSampleType16bitInteger;
  uint32_t channels = 0; // Set to zero for no channels
  IDeckLinkDisplayMode* selectedDisplayMode = NULL;
  int32_t rejectTimeoutMs = 1000;
  bool enableKeying = false;
  bool isExternal = false;
  uint8_t keyLevel = 255;
  macadamTimecode* timecode = nullptr;
  ~playbackCarrier() {
    if (deckLinkOutput != nullptr) { deckLinkOutput->Release(); }
    if (deckLinkKeyer != nullptr) { deckLinkKeyer->Release(); }
    if (selectedDisplayMode != nullptr) { selectedDisplayMode->Release(); }
    if (timecode != nullptr) { delete timecode; }
  }
};

struct macadamFrame : IDeckLinkVideoFrame {
  int32_t width;
  int32_t height;
  int32_t rowBytes;
  BMDPixelFormat pixelFormat;
  BMDTimeScale timeScale;
  BMDFrameFlags frameFlags = bmdFrameFlagDefault;
  void* data;
  size_t dataSize;
  BMDTimeValue scheduledTime;
  BMDTimeValue completionTimestamp;
  IDeckLinkOutput* deckLinkOutput = nullptr;
  napi_ref sourceBufferRef = nullptr;
  macadamTimecode* tc = nullptr;
  BMDOutputFrameCompletionResult result;
  long GetWidth (void) { return width; };
  long GetHeight (void) { return height; };
  long GetRowBytes (void) { return rowBytes; };
  BMDPixelFormat GetPixelFormat (void) { return pixelFormat; };
  BMDFrameFlags GetFlags (void) { return bmdVideoOutputRP188; };
  HRESULT GetTimecode (/* in */BMDTimecodeFormat format, /* out */ IDeckLinkTimecode **timecode) {
    if (tc != nullptr) {
      *timecode = tc;
      return S_OK;
    }
    return S_FALSE;
  };
  HRESULT GetAncillaryData (/* out */ IDeckLinkVideoFrameAncillary **ancillary) {
    // TODO Consider implementing this
    return E_FAIL;
  }
  HRESULT GetBytes (void **buffer) { *buffer = data; return S_OK; };
  HRESULT	QueryInterface (REFIID iid, LPVOID *ppv) { return E_NOINTERFACE; }
  ULONG AddRef() { return 1; };
  ULONG Release() { return 1; };
};

struct displayFrameCarrier : carrier, macadamFrame {
  void* audioData = nullptr;
  size_t audioDataSize;
  uint32_t sampleFrameCount;
  napi_ref audioRef = nullptr;
  ~displayFrameCarrier() {}
};

struct scheduleCarrier : carrier {
  BMDTimeValue scheduledTime;
  ~scheduleCarrier () { };
};

struct playbackThreadsafe : IDeckLinkVideoOutputCallback {
  playbackThreadsafe() { };
  HRESULT ScheduledFrameCompleted(IDeckLinkVideoFrame* completedFrame, BMDOutputFrameCompletionResult result);
  HRESULT ScheduledPlaybackHasStopped();
  HRESULT	QueryInterface (REFIID iid, LPVOID *ppv) { return E_NOINTERFACE; }
  ULONG AddRef() { return 1; }
  ULONG Release() { return 1; }
  napi_threadsafe_function tsFn;
  IDeckLinkOutput* deckLinkOutput = nullptr;
  IDeckLinkKeyer* deckLinkKeyer = nullptr;
  IDeckLinkDisplayMode* displayMode = nullptr;
  BMDPixelFormat pixelFormat;
  BMDAudioSampleRate sampleRate;
  BMDAudioSampleType sampleType;
  uint32_t sampleByteFactor;
  uint32_t channels = 0; // Set to zero for no channels
  BMDTimeScale timeScale;
  BMDTimeValue frameDuration;
  int32_t width;
  int32_t height;
  int32_t rowBytes;
  bool started = false;
  std::map<BMDTimeValue, scheduleCarrier*> pendingPlays;
  BMDTimeValue pendingTimeoutTicks = 1000;
  bool enableKeying = false;
  bool isExternal = false;
  uint8_t keyLevel = 255;
  macadamTimecode* timecode = nullptr;
  ~playbackThreadsafe() {
    if (deckLinkOutput != nullptr) { deckLinkOutput->Release(); }
    if (deckLinkKeyer != nullptr) { deckLinkKeyer->Release(); }
    if (displayMode != nullptr) { displayMode->Release(); }
    if (timecode == nullptr) { delete timecode; }
  }
};

#endif // PLAYBACK_PROMISE_H
