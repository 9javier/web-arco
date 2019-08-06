package com.mirasense.scanditsdk.plugin;
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import android.content.Context;

import com.scandit.matrixscan.Frame;
import com.scandit.matrixscan.MatrixScan;
import com.scandit.matrixscan.MatrixScanListener;
import com.scandit.recognition.TrackedBarcode;

import org.apache.cordova.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;

public class MatrixSimpleOverlayListener implements MatrixScanListener {

  private Context context = null;

  public MatrixSimpleOverlayListener() {
  }

  @Override
  public void matrixScan(MatrixScan matrixScan, Frame didUpdate) {
    if (didUpdate.getTrackedCodes().isEmpty()) {
      return;
    }

    for (long id : didUpdate.getAddedIdentifiers()) {
      if (didUpdate.getTrackedCodes().containsKey(id)) {
        if (this.context != null) {
          if (this.context instanceof MatrixProductInfo) {
            ((MatrixProductInfo) this.context).showProgressBar(true);
          }
        }

        JSONObject jsonObject = new JSONObject();
        try {
          jsonObject.put("result", true);
          JSONObject jsonObjectBarcode = new JSONObject();
          jsonObjectBarcode.put("id", id);
          jsonObjectBarcode.put("data", didUpdate.getTrackedCodes().get(id).getData());
          jsonObject.put("barcode", jsonObjectBarcode);
        } catch (JSONException e) {

        }
        PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
        pResult.setKeepCallback(true);
        ScanditSDK.mCallbackContextMatrixSimple.sendPluginResult(pResult);
      }
    }
  }

  public void setContextActivity(Context context) {
    this.context = context;
  }

  @Override
  public boolean shouldRejectCode(MatrixScan matrixScan, TrackedBarcode trackedBarcode) {
    return false;
  }
}
