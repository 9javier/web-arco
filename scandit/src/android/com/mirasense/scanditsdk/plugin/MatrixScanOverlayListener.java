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
import android.graphics.Point;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.content.res.Resources;

import com.scandit.barcodepicker.BarcodePicker;
import com.scandit.matrixscan.Frame;
import com.scandit.matrixscan.MatrixScan;
import com.scandit.matrixscan.MatrixScanListener;
import com.scandit.matrixscan.SimpleMatrixScanOverlay;
import com.scandit.matrixscan.ViewBasedMatrixScanOverlay;
import com.scandit.recognition.Quadrilateral;
import com.scandit.recognition.TrackedBarcode;
import com.mirasense.scanditsdk.plugin.bubbles.BaseBubble;
import com.mirasense.scanditsdk.plugin.bubbles.IndicatorState;
import com.mirasense.scanditsdk.plugin.bubbles.IndicatorViewModelFactory;
import com.mirasense.scanditsdk.plugin.utility.UiUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentSkipListMap;

import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;

import static com.mirasense.scanditsdk.plugin.bubbles.IndicatorState.HIGHLIGHT_ONLY;
import static com.mirasense.scanditsdk.plugin.bubbles.IndicatorState.MAXIMISED;
import static com.mirasense.scanditsdk.plugin.bubbles.IndicatorState.MINIMISED;

/**
 * A class implementing 3 interfaces related to matrix scan:
 * - MatrixScanListener - an interface used by the {@link MatrixScan} to control the processing of
 * tracked barcodes,
 * - SimpleMatrixScanOverlay.SimpleMatrixScanOverlayListener - an interface required by the
 * {@link SimpleMatrixScanOverlay} providing user basic control over the overlay,
 * - ViewBasedMatrixScanOverlay.ViewBasedMatrixScanOverlayListener - an interface required by the
 * {@link ViewBasedMatrixScanOverlay} providing user basic control over the overlay.
 */
public class MatrixScanOverlayListener implements
  SimpleMatrixScanOverlay.SimpleMatrixScanOverlayListener,
  ViewBasedMatrixScanOverlay.ViewBasedMatrixScanOverlayListener, MatrixScanListener {

  private static final float MINIMISED_RATIO = 0.1f;
  private static final float MAXIMISED_RATIO = 0.25f;
  private static final int MAX_INDICATOR_NUMBER = 10;

  private Context context;
  private ClickCallback bubbleClickCallback;
  private BarcodePicker picker;

  private ViewBasedMatrixScanOverlay viewBasedMatrixScanOverlay;

  private IndicatorState lastIndicatorState = IndicatorState.MINIMISED;
  private IndicatorViewModelFactory bubbleFactory;
  //    private Map<Long, BaseBubble> bubbles = new ConcurrentSkipListMap<>();
  private float screenWidth;
  private String package_name;
  private Resources resources;

  public MatrixScanOverlayListener(Context context, ClickCallback bubbleClickCallback, BarcodePicker picker, String package_name, Resources resources) {
    this.context = context;
    this.bubbleClickCallback = bubbleClickCallback;
    this.picker = picker;
    this.package_name = package_name;
    this.resources = resources;

    Point size = new Point();
    ((WindowManager) context.getSystemService(Context.WINDOW_SERVICE))
      .getDefaultDisplay().getSize(size);
    screenWidth = size.x;
    bubbleFactory = new IndicatorViewModelFactory(context);
  }

  public void setViewBasedMatrixScanOverlay(ViewBasedMatrixScanOverlay viewBasedMatrixScanOverlay) {
    this.viewBasedMatrixScanOverlay = viewBasedMatrixScanOverlay;
  }

  private IndicatorState calculateIndicatorState(Map<Long, TrackedBarcode> recognizedCodes) {
    return MAXIMISED;
  }

  private Quadrilateral convertQuadrilateral(Quadrilateral quadrilateral) {
    return new Quadrilateral(picker.convertPointToPickerCoordinates(quadrilateral.top_left),
      picker.convertPointToPickerCoordinates(quadrilateral.top_right),
      picker.convertPointToPickerCoordinates(quadrilateral.bottom_left),
      picker.convertPointToPickerCoordinates(quadrilateral.bottom_right));
  }

  @Override
  public int getColorForCode(TrackedBarcode barcode, long trackingId) {
    if(ScanditSDK.bubbles.get(barcode.getData()) != null){
      return ScanditSDK.bubbles.get(barcode.getData()).highlightColor;
    } else {
      return 0;
    }
  }

  @Override
  public View getViewForCode(TrackedBarcode barcode, long trackingId) {
    LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    if(ScanditSDK.bubbles.get(barcode.getData()) != null){

      return ScanditSDK.bubbles.get(barcode.getData()).getView(context, inflater);
    } else {
      return null;
    }

  }

  @Override
  public Point getOffsetForCode(TrackedBarcode barcode, long trackingId) {
    BaseBubble indicator = ScanditSDK.bubbles.get(barcode.getData());

    if(indicator != null){
      return new Point(-UiUtils.pxFromDp(context, indicator.getWidth()) / 2,
        -UiUtils.pxFromDp(context, indicator.getHeight()));
    } else {
      return new Point();
    }

  }

  @Override
  public void onCodeTouched(TrackedBarcode barcode, long trackingId) {
    bubbleClickCallback.run(barcode);
  }

  @Override
  public void matrixScan(MatrixScan matrixScan, Frame didUpdate) {
    if (didUpdate.getTrackedCodes().isEmpty()) {
      return;
    }

    IndicatorState indicatorState = calculateIndicatorState(didUpdate.getTrackedCodes());
    if (lastIndicatorState != indicatorState) {
      ScanditSDK.bubbles.clear();
      if (indicatorState != HIGHLIGHT_ONLY) {
        for (final Map.Entry<Long, TrackedBarcode> it : didUpdate.getTrackedCodes().entrySet()) {
          ScanditSDK.bubbles.put(it.getValue().getData(), bubbleFactory.createBubbleReferenceSerauto(indicatorState, it.getValue(), package_name, resources));

          viewBasedMatrixScanOverlay
            .setOffsetForCode(getOffsetForCode(it.getValue(), it.getKey()), it.getKey());
          viewBasedMatrixScanOverlay.post(new Runnable() {
            @Override
            public void run() {
              viewBasedMatrixScanOverlay
                .setViewForCode(getViewForCode(it.getValue(), it.getKey()), it.getKey());
            }
          });
        }
      }
    }
    lastIndicatorState = indicatorState;

    for (long id : didUpdate.getAddedIdentifiers()) {
      if (didUpdate.getTrackedCodes().containsKey(id)) {

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
        ScanditSDK.mCallbackContextMatrixBubble.sendPluginResult(pResult);

        ScanditSDK.bubbles.put(didUpdate.getTrackedCodes().get(id).getData(), bubbleFactory.createBubbleReferenceSerauto(indicatorState, didUpdate.getTrackedCodes().get(id), package_name, resources));
      }
    }

//        for (long id : didUpdate.getRemovedIdentifiers()) {
//          for (final Map.Entry<String, BaseBubble> bubbleEntry : ScanditSDK.bubbles.entrySet()) {
//            String key = bubbleEntry.getKey();
//            if(key.equalsIgnoreCase(didUpdate.getTrackedCodes().get(id).getData())){
//              ScanditSDK.bubbles.remove(id);
//            }
//          }
//
//        }

  }

  @Override
  public boolean shouldRejectCode(MatrixScan matrixScan, TrackedBarcode trackedBarcode) {
    return false;
  }
}
