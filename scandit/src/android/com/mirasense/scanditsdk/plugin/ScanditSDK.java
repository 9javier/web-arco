//  Copyright 2016 Scandit AG
//
//  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
//  in compliance with the License. You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software distributed under the
//  License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
//  express or implied. See the License for the specific language governing permissions and
//  limitations under the License.

package com.mirasense.scanditsdk.plugin;

import android.Manifest;
import android.app.ActionBar;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.mirasense.scanditsdk.plugin.models.FiltersPickingStores;
import com.mirasense.scanditsdk.plugin.models.PickingStoreRejectionReason;
import com.mirasense.scanditsdk.plugin.models.ProductModel;
import com.scandit.barcodepicker.ScanSettings;
import com.scandit.barcodepicker.ScanditLicense;
import com.scandit.barcodepicker.internal.ScanditSDKGlobals;
import com.scandit.base.util.JSONParseException;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.content.res.Resources;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentSkipListMap;
import java.util.HashMap;

import com.mirasense.scanditsdk.plugin.bubbles.BaseBubble;
import com.mirasense.scanditsdk.plugin.models.StockReference;

import java.util.Iterator;

import android.widget.TableLayout;
import android.widget.LinearLayout;
import android.widget.TableRow;
import android.graphics.Color;
import android.view.Gravity;
import android.util.TypedValue;

public class ScanditSDK extends CordovaPlugin {

  public static CallbackContext mCallbackContextMatrixBubble;
  public static CallbackContext mCallbackContextMatrixSimple;
  public static Map<String, BaseBubble> bubbles = new ConcurrentSkipListMap<>();
  public static Map<String, Product> products = new ConcurrentSkipListMap<>();

  public static final String DID_SCAN_EVENT = "didScan";
  public static final String DID_MANUAL_SEARCH_EVENT = "didManualSearch";
  public static final String DID_RECOGNIZE_TEXT_EVENT = "didRecognizeText";
  public static final String DID_CHANGE_STATE_EVENT = "didChangeState";
  public static final String DID_RECOGNIZE_NEW_CODES = "didRecognizeNewCodes";
  public static final String DID_CHANGE_PROPERTY = "didChangeProperty";
  public static final String DID_FAIL_TO_VALIDATE_LICENSE = "didFailToValidateLicense";
  public static final String DID_PROCESS_FRAME = "didProcessFrame";


  private static final String INIT_LICENSE_COMMAND = "initLicense";
  private static final String SHOW_COMMAND = "show";
  private static final String APPLY_SETTINGS_COMMAND = "applySettings";
  private static final String CANCEL_COMMAND = "cancel";
  private static final String PAUSE_COMMAND = "pause";
  private static final String RESUME_COMMAND = "resume";
  private static final String START_COMMAND = "start";
  private static final String STOP_COMMAND = "stop";
  private static final String RESIZE_COMMAND = "resize";
  private static final String UPDATE_OVERLAY_COMMAND = "updateOverlay";
  private static final String ENABLE_TORCH_COMMAND = "torch";
  private static final String FINISH_DID_SCAN_COMMAND = "finishDidScanCallback";
  private static final String FINISH_DID_RECOGNIZE_NEW_CODES_COMMAND = "finishDidRecognizeNewCodesCallback";
  private static final String MATRIX_SIMPLE = "matrixSimple";
  private static final String MATRIX_PICKING_STORES = "matrixPickingStores";
  private static final String MATRIX_PRODUCT_INFO = "matrixProductInfo";
  private static final String SET_MATRIX_SIMPLE_TEXT = "setMatrixSimpleText";
  private static final String SHOW_MATRIX_SIMPLE_TEXT = "matrixSimpleShowText";
  private static final String SHOW_MATRIX_SIMPLE_TEXT_LOADER = "matrixSimpleShowLoader";
  private static final String SHOW_MATRIX_SIMPLE_WARNING_TO_FORCE= "matrixSimpleShowWarningToForce";
  private static final String MATRIX_SIMPLE_FINISH = "matrixSimpleFinish";
  private static final String SET_MATRIX_SIMPLE_NET_PRODUCT_TO_SCAN = "matrixSimpleSetNextProductToScan";
  private static final String SHOW_MATRIX_SIMPLE_NEXT_PRODUCT_TO_SCAN = "matrixSimpleShowNextProductToScan";
  private static final String MATRIX_SIMPLE_SHOW_TEXT_START_SCAN_PACKING = "matrixSimpleShowTextStartScanPacking";
  private static final String MATRIX_SIMPLE_SHOW_TEXT_END_SCAN_PACKING = "matrixSimpleShowTextEndScanPacking";
  private static final String MATRIX_SIMPLE_SHOW_FIXED_TEXT_BOTTOM = "matrixSimpleShowFixedTextBottom";
  private static final String MATRIX_PICKING_STORES_LOAD_PRODUCTS = "matrixPickingStoresLoadProducts";
  private static final String MATRIX_PICKING_STORES_SET_TEXT= "matrixPickingStoresSetText";
  private static final String MATRIX_PICKING_STORES_FINISH = "matrixPickingStoresFinish";
  private static final String MATRIX_PICKING_STORES_SHOW_BUTTON_FINISH = "matrixPickingStoresShowButtonFinish";
  private static final String MATRIX_PICKING_STORES_SHOW_BUTTON_PACKING = "matrixPickingStoresShowButtonPacking";
  private static final String MATRIX_PRINT_TAGS = "matrixPrintTags";
  private static final String MATRIX_SIMPLE_SHOW_BUTTON_FINISH_RECEPTION = "matrixSimpleShowButtonFinishReception";
  private static final String MATRIX_SIMPLE_SHOW_WARNING = "matrixSimpleShowWarning";
  private static final String MATRIX_SIMPLE_ALERT_SELECT_SIZE_TO_PRINT = "matrixSimpleAlertSelectSizeToPrint";
  private static final String MATRIX_PRODUCT_INFO_SHOW_EXTENDED = "matrixProductInfoShowExtended";
  private static final String MATRIX_SHOW_PROGRESS_BAR_PRODUCT_EXTENDED_INFO = "matrixShowProgressBarProductExtendedInfo";
  private static final String SWITCH_TO_IONIC = "switchToIonic";
  private static final String SWITCH_TO_IONIC_SET_MAIN_TEXT = "switchToIonicSetMainText";
  private static final String SWITCH_TO_IONIC_SET_ORIGIN_TEXT = "switchToIonicSetOriginText";
  private static final String SHOW_LOADING_DIALOG = "showLoadingDialog";
  private static final String HIDE_LOADING_DIALOG = "hideLoadingDialog";
  private static final String MATRIX_PICKING_STORES_LOAD_REJECTION_REASONS = "matrixPickingStoresLoadRejectionReasons";
  private static final String MATRIX_PICKING_STORES_HIDE_INFO_PRODUCT_DIALOG = "matrixPickingStoresHideInfoProductDialog";
  private static final int REQUEST_CAMERA_PERMISSION = 505;

  private static final int COLOR_TRANSPARENT = 0x00000000;

  private CallbackContext mCallbackContext;

  private ScanditWorker mWorker = null;
  private boolean mRequestingCameraPermission = false;
  private IPickerController mPickerController;

  public static View viewProductData = null;
  public static View viewDataMatrixSimple = null;
  public static ActionBar actionBarMatrixSimple = null;

  private String lastColorTextMatrixSimple;
  private String lastBackgroundMatrixSimple;

  public static String packageName = "";
  public static Resources resources = null;

  static class Command {
    Command(String action, JSONArray args, CallbackContext callbackContext) {
      this.action = action;
      this.args = args;
      this.callbackContext = callbackContext;
    }

    JSONArray args;
    String action;
    CallbackContext callbackContext;
  }

  private ArrayList<Command> mQueuedCommands = new ArrayList<Command>();

  private static Activity activityStarted = null;
  private ProgressDialog loadingDialog = null;

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
    Log.d("CORDOVA_MATRIX", "execute action:" + action);
    packageName = cordova.getActivity().getApplication().getPackageName();
    resources = cordova.getActivity().getApplication().getResources();
    return this.executeCommand(action, args, callbackContext, false);
  }

  private boolean executeCommand(String action, JSONArray args, CallbackContext callbackContext,
                                 boolean isQueuedCommand) {
    if (mWorker == null) {
      mWorker = new ScanditWorker();
      mWorker.start();
    }

    // check if we have to request camera permission before executing commands.
    if (!mRequestingCameraPermission && !isQueuedCommand && (action.equals(SHOW_COMMAND) || action.equals("matrixWithData") || action.equals("matrix_bubble") || action.equals(MATRIX_SIMPLE))) {
      mRequestingCameraPermission =
        !PermissionHelper.hasPermission(this, Manifest.permission.CAMERA);
      if (mRequestingCameraPermission) {
        // request permission
        PermissionHelper.requestPermission(this, REQUEST_CAMERA_PERMISSION,
          Manifest.permission.CAMERA);
      }
    }

    if (mRequestingCameraPermission) {
      // queue all the commands until we have finished asking for permission. We will then
      // either have the permission, or display a message in the picker that says that we
      // don't have permission to access the camera.
      mQueuedCommands.add(new Command(action, args, callbackContext));
      return true;
    }

    if (action.equals(INIT_LICENSE_COMMAND)) {
      initLicense(args);
    } else if (action.equals(SHOW_COMMAND)) {
      mCallbackContext = callbackContext;
      show(args);
    } else if (action.equals(APPLY_SETTINGS_COMMAND)) {
      applySettings(args);
    } else if (action.equals(CANCEL_COMMAND)) {
      cancel(args);
    } else if (action.equals(PAUSE_COMMAND)) {
      setPickerState(PickerStateMachine.PAUSED);
    } else if (action.equals(RESUME_COMMAND)) {
      setPickerState(PickerStateMachine.ACTIVE);
    } else if (action.equals(STOP_COMMAND)) {
      setPickerState(PickerStateMachine.STOPPED);
    } else if (action.equals(START_COMMAND)) {
      // can't use setPickerState(PickerStateMachine.ACTIVE), because we need to call
      // startScanning, even if the picker was in paused state.
      startScanning();
    } else if (action.equals(RESIZE_COMMAND)) {
      resize(args);
    } else if (action.equals(UPDATE_OVERLAY_COMMAND)) {
      updateOverlay(args);
    } else if (action.equals(ENABLE_TORCH_COMMAND)) {
      torch(args);
    } else if (action.equals(FINISH_DID_SCAN_COMMAND)) {
      finishDidScanCallback(args);
    } else if (action.equals(FINISH_DID_RECOGNIZE_NEW_CODES_COMMAND)) {
      finishDidRecognizeNewCodesCallback(args);
    } else if (action.equals("matrix_bubble")) {
      mCallbackContextMatrixBubble = callbackContext;

      String company = "";
      String warehouse = "";
      int permissionRegularization = 0;
      boolean captureScreenshot = false;
      double secondsScreenshot = 0;
      try {
        company = args.getString(0);
        warehouse = args.getString(1);
        permissionRegularization = Integer.parseInt(args.getString(2));
        if(args.length() > 3){
          captureScreenshot = args.getBoolean(3);
          secondsScreenshot = args.getDouble(4);
        }
      } catch (JSONException e) {
        e.printStackTrace();
      }

      Bundle b = new Bundle();
      b.putString("company", company);
      b.putString("warehouse", warehouse);
      b.putInt("regularization", permissionRegularization);
      b.putBoolean("captureScreenshot", captureScreenshot);
      b.putDouble("secondsScreenshot", secondsScreenshot);

      Intent intent = new Intent(this.cordova.getActivity(), MatrixBubblesActivity.class);
      intent.putExtras(b);
      this.cordova.startActivityForResult(this, intent, 4);
    } else if (action.equals("setBarcode")) {

      Long id = 0L;
      String barcodeData = "";
      int stock = 0;

      try {
        id = Long.valueOf(args.getString(0));
        barcodeData = args.getString(1);
        stock = Integer.parseInt(args.getString(2));
      } catch (JSONException e) {
        e.printStackTrace();
      }

      Log.d("CORDOVA_MATRIX", "setBarcode id " + id);
      Log.d("CORDOVA_MATRIX", "setBarcode barcodeData " + barcodeData);
      Log.d("CORDOVA_MATRIX", "setBarcode stock " + stock);
      BaseBubble bubble = bubbles.get(barcodeData);
      if (bubble != null) {
        //      Log.d("CORDOVA_MATRIX", "setBarcode bubble stock old" + bubble.getBubbleData().getStock());
        bubble.getBubbleData().setStock(stock);
//      Log.d("CORDOVA_MATRIX", "setBarcode bubble stock new" + bubble.getBubbleData().getStock());
        bubbles.put(barcodeData, bubble);
      }

      for (Map.Entry<String, BaseBubble> bubble2 : bubbles.entrySet()) {
        String key = bubble2.getKey();
        BaseBubble value = bubble2.getValue();
        Log.d("CORDOVA_MATRIX", "BUBBLES key: " + key + " Barcode: " + value.getBubbleData().getCode() + " Stock: " + value.getBubbleData().getStock());
        if (value.getBubbleData().getCode().equalsIgnoreCase(barcodeData)) {
          value.getBubbleData().setStock(stock);

          final int stockTextView = stock;

          this.cordova.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
              View view = value.getViewUse();
              if (view != null && view.findViewById(resources.getIdentifier("stock_value", "id", packageName)) != null) {
                ((TextView) view.findViewById(resources.getIdentifier("stock_value", "id", packageName))).setText("" + stockTextView);
              }
            }
          });

          bubbles.put(key, value);
          Log.d("CORDOVA_MATRIX", "BUBBLES key2: " + key + " Barcode: " + bubbles.get(key).getBubbleData().getCode() + " Stock: " + bubbles.get(key).getBubbleData().getStock());
        }
      }


    } else if (action.equals("setBarcodeName")) {

      Long id = 0L;
      String barcodeData = "";
      String name = "";

      try {
        id = Long.valueOf(args.getString(0));
        barcodeData = args.getString(1);
        name = args.getString(2);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      BaseBubble bubble = bubbles.get(barcodeData);
      if (bubble != null) {
        bubble.getBubbleData().setName(name);
        bubbles.put(barcodeData, bubble);
      }

      for (Map.Entry<String, BaseBubble> bubble2 : bubbles.entrySet()) {
        String key = bubble2.getKey();
        BaseBubble value = bubble2.getValue();
        if (value.getBubbleData().getCode().equalsIgnoreCase(barcodeData)) {
          value.getBubbleData().setName(name);

          final String nameTextView = name;

          this.cordova.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
              View view = value.getViewUse();
              if (view != null && view.findViewById(resources.getIdentifier("name_value", "id", packageName)) != null) {
                ((TextView) view.findViewById(resources.getIdentifier("name_value", "id", packageName))).setText(nameTextView);
              }
            }
          });
          bubbles.put(key, value);
        }
      }
    } else if (action.equalsIgnoreCase("setDataReference")){

      //exec(null, null, PLUGIN_NAME, "setDataReference", [id, data, name, stock, price, location, id_reference]);

      Log.d("CORDOVA_MATRIX","setDataReference");

      Long id = 0L;
      String barcodeData = "";
      String name = "asdf";
      String stock = "0";
      String price = "38";
      String location = "asdf";
      String id_reference = "";
      String supplier = "asdf";
      boolean exist = true;

      String reference = "";
      String pvpSizeScanned = "";
      Map<String, String> stocksResume = new HashMap();
      JSONArray jsonArray = null;
      boolean isFromSQLite = false;

      try {
        id = Long.valueOf(args.getString(0));
        barcodeData = args.getString(1);
        reference = args.getString(2);
        id_reference = args.getString(2);
        pvpSizeScanned = args.getString(3);
        jsonArray = args.getJSONArray(4);
        isFromSQLite = args.getBoolean(5);
//          name = args.getString(2);
//          stock = args.getString(3);
//          price = args.getString(4);
//          location = args.getString(5);
//          id_reference = args.getString(6);
//          supplier = args.getString(7);
//          Log.d("CORDOVA_MATRIX", "setDataReference id_reference" + id_reference);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      BaseBubble bubble = bubbles.get(barcodeData);
      if (bubble != null) {
        bubble.getBubbleData().setName(name);
        bubble.getBubbleData().setStock(Integer.parseInt(stock));
        bubble.getBubbleData().setPrice(price);
        bubble.getBubbleData().setLocation(location);
        bubble.getBubbleData().setIdReference(id_reference);
        bubble.getBubbleData().setSupplier(supplier);
        exist = !id_reference.isEmpty();
        Log.d("CORDOVA_MATRIX","setDataReference "+id + " name: "+name);
        bubble.getBubbleData().setReference(reference);
        bubble.getBubbleData().setPvpSizeScanned(Float.parseFloat(pvpSizeScanned));

        try {
          if (jsonArray != null && jsonArray.length() > 0) {
            for (int i = 0; i < jsonArray.length(); i++) {
              if (jsonArray.getJSONObject(i) != null && jsonArray.getJSONObject(i).getString("color") != null && !jsonArray.getJSONObject(i).getString("color").equals("null")) {
                String size = jsonArray.getJSONObject(i).getString("attribute_name");
                String stockColor = jsonArray.getJSONObject(i).getString("color");

                if (stocksResume.get(size) != null) {
                  continue;
                }

                stocksResume.put(size, stockColor);
              } else {
                Log.d("CORDOVA_MATRIX", "No hay code");
              }
            }
          }
        } catch (JSONException e) {
          e.printStackTrace();
        }

        bubble.getBubbleData().setStocksResume(stocksResume);
        bubble.getBubbleData().setExist(exist);
        bubbles.put(barcodeData, bubble);
      }

      final View viewProductDataFinal = this.viewProductData;
      final String referenceFinal = reference;
      final String pvpSizeScannedFinal = pvpSizeScanned;
      final Map<String, String> stocksResumeFinal = stocksResume;
      boolean finalIsFromSQLite = isFromSQLite;
      cordova.getActivity().runOnUiThread(new Runnable() {
        public void run() {
          LinearLayout llProductData;
          TextView tvReference;
          TextView tvPrice;
          TextView tvNoStocks;
          TableLayout tlStocks;
          RelativeLayout rlLoader;
          if (viewProductDataFinal != null) {
            llProductData = viewProductDataFinal.findViewById(resources.getIdentifier("llProductData", "id", packageName));
            tvReference = viewProductDataFinal.findViewById(resources.getIdentifier("tvReference", "id", packageName));
            tvPrice = viewProductDataFinal.findViewById(resources.getIdentifier("tvPrice", "id", packageName));
            tvNoStocks = viewProductDataFinal.findViewById(resources.getIdentifier("tvNoStocks", "id", packageName));
            tlStocks = viewProductDataFinal.findViewById(resources.getIdentifier("tlStocks", "id", packageName));
            rlLoader = viewProductDataFinal.findViewById(resources.getIdentifier("rlLoader", "id", packageName));
            if(llProductData != null && llProductData.getVisibility() == View.GONE) {
              llProductData.setVisibility(View.VISIBLE);
            }
            if (tvReference != null) {
              tvReference.setText(referenceFinal);
            }
            if (tvPrice != null) {
              tvPrice.setText(pvpSizeScannedFinal + " €");
            }

            tlStocks.removeAllViews();
            if(stocksResumeFinal.size() > 0){
              tvNoStocks.setVisibility(View.GONE);
              rlLoader.setVisibility(View.GONE);
              tlStocks.setVisibility(View.VISIBLE);

              TableRow rowSizes = new TableRow(cordova.getActivity().getApplicationContext());
              TableRow.LayoutParams lp = new TableRow.LayoutParams(TableRow.LayoutParams.WRAP_CONTENT);
              rowSizes.setLayoutParams(lp);

              int qtySizes = 0;
              int qtyRows = 0;
              for (Map.Entry<String, String> stockSize : stocksResumeFinal.entrySet()) {
                qtySizes++;
                if (qtySizes == 5) {
                  tlStocks.addView(rowSizes, qtyRows);
                  qtyRows++;
                  rowSizes = new TableRow(cordova.getActivity().getApplicationContext());
                  rowSizes.setLayoutParams(lp);
                  qtySizes = 0;
                }
                TextView tv = new TextView(cordova.getActivity().getApplicationContext());
                tv.setGravity(Gravity.CENTER | Gravity.BOTTOM);
                tv.setText(String.valueOf(stockSize.getKey()));
                tv.setTextColor(Color.parseColor(stockSize.getValue()));
                tv.setTextSize(TypedValue.COMPLEX_UNIT_SP, 20f);

                rowSizes.addView(tv);
              }
              tlStocks.addView(rowSizes, qtyRows);
            } else if (!finalIsFromSQLite) {
              tvNoStocks.setVisibility(View.VISIBLE);
              rlLoader.setVisibility(View.GONE);
              tlStocks.setVisibility(View.GONE);
            } else {
              tvNoStocks.setVisibility(View.GONE);
              rlLoader.setVisibility(View.VISIBLE);
              tlStocks.setVisibility(View.GONE);
            }
          }
        }
      });
    } else if(action.equalsIgnoreCase("setLocationsReference")) {
      //exec(null, null, PLUGIN_NAME, "setLocationsReference", [id, data, locations]);

      Log.d("CORDOVA_MATRIX","setLocationsReference");

      Long id = 0L;
      String barcodeData = "";

      Map<Integer, StockReference> locations = new ConcurrentSkipListMap<>();

      try {
        id = Long.valueOf(args.getString(0));
        barcodeData = args.getString(1);

        JSONArray arr = args.getJSONArray(2);
        for(int i=0; i<arr.length(); i++){
          if (arr.getJSONObject(i) != null){
            String company = arr.getJSONObject(i).getString("company");
            String warehouse = arr.getJSONObject(i).getString("warehouse");
            String location = arr.getJSONObject(i).getString("location");
            String stock = arr.getJSONObject(i).getString("stock");
            StockReference stockReference = new StockReference(company, warehouse, location, stock);
            locations.put(i, stockReference);
          } else {
            Log.d("CORDOVA_MATRIX", "No hay code");
          }
        }
      } catch (JSONException e) {
        e.printStackTrace();
      }

      BaseBubble bubble = bubbles.get(barcodeData);
      if (bubble != null) {
        bubble.getBubbleData().setLocations(locations);
        bubbles.put(barcodeData, bubble);
      }

    } else if (action.equals("matrixWithData")) {
      Log.d("CORDOVA_MATRIX", "entra en matrixWithData");

      try{
        JSONArray arr = args.getJSONArray(0);
        for(int i=0; i<arr.length(); i++){
          if (arr.getJSONObject(i) != null){
            String code = arr.getJSONObject(i).getString("code");
            String price = arr.getJSONObject(i).getString("price");
            String augmentedReality = arr.getJSONObject(i).getString("augmentedReality");
            String stock = arr.getJSONObject(i).getString("stock");
            String color = arr.getJSONObject(i).getString("color");
            String url = arr.getJSONObject(i).getString("url");
            String soldUnits = arr.getJSONObject(i).getString("sold_units");
            boolean ar = (augmentedReality.equalsIgnoreCase("si"));
            Product p = new Product(code, ar, color, stock, price, url, soldUnits);
            products.put(code, p);
            Log.d("CORDOVA_MATRIX", "CODE::"+code);
          } else {
            Log.d("CORDOVA_MATRIX", "No hay code");
          }
        }
      } catch (JSONException e){
        Log.d("CORDOVA_MATRIX", "JSONException");
      }
      Intent intent = new Intent(this.cordova.getActivity(), MatrixWithDataActivity.class);
      this.cordova.startActivityForResult(this, intent, 5);
    } else if(action.equals(MATRIX_SIMPLE)) {
      mCallbackContextMatrixSimple = callbackContext;
      String title = "";
      String backgroundTitle = "";
      String colorTitle = "";
      try {
        title = args.getString(0);
        backgroundTitle = args.getString(1);
        colorTitle = args.getString(2);
      } catch (JSONException e) {
        e.printStackTrace();
      }
      Bundle b = new Bundle();
      b.putString("title", title);
      b.putString("backgroundTitle", backgroundTitle);
      b.putString("colorTitle", colorTitle);
      Intent intent = new Intent(this.cordova.getActivity(), MatrixSimpleActivity.class);
      intent.putExtras(b);
      this.cordova.startActivityForResult(this, intent, 6);
    } else if (action.equals(MATRIX_PICKING_STORES)) {
      mCallbackContextMatrixSimple = callbackContext;
      String title = "";
      String backgroundTitle = "";
      String colorTitle = "";
      String textInit = "";
      String urlBase = "";
      try {
        title = args.getString(0);
        backgroundTitle = args.getString(1);
        colorTitle = args.getString(2);
        textInit = args.getString(3);
        urlBase = args.getString(4);
      } catch (JSONException e) {
        e.printStackTrace();
      }
      Bundle b = new Bundle();
      b.putString("title", title);
      b.putString("backgroundTitle", backgroundTitle);
      b.putString("colorTitle", colorTitle);
      b.putString("textInit", textInit);
      b.putString("urlBase", urlBase);
      Intent intent = new Intent(this.cordova.getActivity(), MatrixPickingStores.class);
      intent.putExtras(b);
      this.cordova.startActivityForResult(this, intent, 6);
    } else if (action.equals(MATRIX_PRINT_TAGS)) {
      mCallbackContextMatrixSimple = callbackContext;
      String title = "";
      String backgroundTitle = "";
      String colorTitle = "";
      int typeTag = 1;
      try {
        title = args.getString(0);
        backgroundTitle = args.getString(1);
        colorTitle = args.getString(2);
        typeTag = args.getInt(3);
      } catch (JSONException e) {
        e.printStackTrace();
      }
      Bundle b = new Bundle();
      b.putString("title", title);
      b.putString("backgroundTitle", backgroundTitle);
      b.putString("colorTitle", colorTitle);
      b.putInt("typeTag", typeTag);
      Intent intent = new Intent(this.cordova.getActivity(), MatrixPrintTags.class);
      intent.putExtras(b);
      this.cordova.startActivityForResult(this, intent, 6);
    } else if(action.equals(SET_MATRIX_SIMPLE_TEXT)){

      String text = "";
      String background = "#2F9E5A";
      String color = "#FFFFFF";
      double size = 20;
      try {
        text = args.getString(0);
        background = args.getString(1);
        color = args.getString(2);
        size = args.getDouble(3);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      this.lastColorTextMatrixSimple = color;
      this.lastBackgroundMatrixSimple = background;
      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;
      final String fText = text;
      final String fBackground = background;
      final String fColor = color;
      final float fSize = (float) size;
      cordova.getActivity().runOnUiThread(new Runnable() {
        public void run() {
          LinearLayout llScanInfo;
          TextView tvScanInfo;
          RelativeLayout rlLoader;
          if (viewDataMatrixSimpleFinal != null) {
            llScanInfo = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("llScanInfo", "id", packageName));
            tvScanInfo = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("tvScanInfo", "id", packageName));
            rlLoader = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("rlLoader", "id", packageName));
            if (llScanInfo != null) {
              llScanInfo.setBackgroundColor(Color.parseColor(fBackground));
              llScanInfo.setVisibility(View.VISIBLE);
            }
            if (tvScanInfo != null) {
              tvScanInfo.setTextColor(Color.parseColor(fColor));
              tvScanInfo.setTextSize(TypedValue.COMPLEX_UNIT_SP, fSize);
              tvScanInfo.setText(fText);
              tvScanInfo.setVisibility(View.VISIBLE);
            }
            if (rlLoader != null) {
              rlLoader.setVisibility(View.GONE);
            }
          }
        }
      });
    } else if(action.equals(MATRIX_SIMPLE_FINISH)){
      if(activityStarted != null){
        activityStarted.finish();
      }
    } else if(action.equals(SHOW_MATRIX_SIMPLE_TEXT)){
      boolean show = false;
      try {
        show = args.getBoolean(0);
      } catch (JSONException e) {
        e.printStackTrace();
      }
      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;
      final boolean fShow = show;
      final String color = this.lastColorTextMatrixSimple;
      final String background = this.lastBackgroundMatrixSimple;
      cordova.getActivity().runOnUiThread(new Runnable() {
        public void run() {
          LinearLayout llScanInfo;
          TextView tvScanInfo;
          RelativeLayout rlLoader;
          if (viewDataMatrixSimpleFinal != null) {
            llScanInfo = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("llScanInfo", "id", packageName));
            tvScanInfo = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("tvScanInfo", "id", packageName));
            rlLoader = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("rlLoader", "id", packageName));
            if (llScanInfo != null) {
              llScanInfo.setVisibility(View.VISIBLE);
              if(fShow){
                if(background != null && !background.isEmpty()){
                  llScanInfo.setBackgroundColor(Color.parseColor(background));
                }
              } else {
                llScanInfo.setBackgroundColor(COLOR_TRANSPARENT);
              }
            }
            if (tvScanInfo != null) {
              if(fShow){
                tvScanInfo.setVisibility(View.VISIBLE);
                if(color != null && !color.isEmpty()){
                  tvScanInfo.setTextColor(Color.parseColor(color));
                }
              } else {
                tvScanInfo.setVisibility(View.GONE);
              }
            }
            if (rlLoader != null) {
              if(fShow) {
                rlLoader.setVisibility(View.GONE);
              }
            }
          }
        }
      });
    } else if(action.equals(SHOW_MATRIX_SIMPLE_TEXT_LOADER)){
      boolean show = false;
      try {
        show = args.getBoolean(0);
      } catch (JSONException e) {
        e.printStackTrace();
      }
      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;
      final boolean fShow = show;
      final String color = this.lastColorTextMatrixSimple;
      final String background = this.lastBackgroundMatrixSimple;
      cordova.getActivity().runOnUiThread(new Runnable() {
        public void run() {
          LinearLayout llScanInfo;
          TextView tvScanInfo;
          RelativeLayout rlLoader;
          if (viewDataMatrixSimpleFinal != null) {
            llScanInfo = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("llScanInfo", "id", packageName));
            tvScanInfo = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("tvScanInfo", "id", packageName));
            rlLoader = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("rlScanInfoLoader", "id", packageName));
            if (llScanInfo != null) {
              if (fShow && background != null) {
                llScanInfo.setBackgroundColor(COLOR_TRANSPARENT);
              } else {
                if(background != null && !background.isEmpty()){
                  llScanInfo.setBackgroundColor(Color.parseColor(background));
                } else {
                  llScanInfo.setBackgroundColor(COLOR_TRANSPARENT);
                }
              }
              llScanInfo.setVisibility(View.VISIBLE);
            }
            if (tvScanInfo != null) {
              if (fShow) {
                tvScanInfo.setVisibility(View.GONE);
              }
            }
            if (rlLoader != null) {
              if (fShow) {
                rlLoader.setVisibility(View.VISIBLE);
              } else {
                rlLoader.setVisibility(View.GONE);
              }
            }
          }
        }
      });
    } else if (action.equals(SHOW_MATRIX_SIMPLE_WARNING_TO_FORCE)) {
      boolean show = false;
      JSONObject barcode = null;

      try {
        show = args.getBoolean(0);
        barcode = args.getJSONObject(1);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      if (show) {
        JSONObject fBarcode = barcode;

        AlertDialog.Builder builderWarningProductUnexpected = new AlertDialog.Builder(MatrixSimpleActivity.matrixSimple);
        builderWarningProductUnexpected
          .setTitle("Atención")
          .setMessage("No se esperaba la entrada del producto que acaba de escanear. ¿Desea forzar la entrada del producto igualmente?")
          .setCancelable(false)
          .setPositiveButton("Forzar", (dialog, id) -> {
            JSONObject jsonObject = new JSONObject();
            try {
              jsonObject.put("result", true);
              jsonObject.put("barcode", fBarcode);
              jsonObject.put("force", true);
              jsonObject.put("action", "force_scanning");
            } catch (JSONException e) {

            }
            PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
            pResult.setKeepCallback(true);
            mCallbackContextMatrixSimple.sendPluginResult(pResult);
          })
          .setNegativeButton("Cancelar", (dialog, id) -> {
            JSONObject jsonObject = new JSONObject();
            try {
              jsonObject.put("result", true);
              jsonObject.put("barcode", fBarcode);
              jsonObject.put("avoid", true);
              jsonObject.put("action", "force_scanning");
            } catch (JSONException e) {

            }
            PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
            pResult.setKeepCallback(true);
            mCallbackContextMatrixSimple.sendPluginResult(pResult);
          });
        builderWarningProductUnexpected.create();
        builderWarningProductUnexpected.show();
      }
    } else if (action.equals(SET_MATRIX_SIMPLE_NET_PRODUCT_TO_SCAN)) {

      JSONObject product = null;
      String background = "#2F9E5A";
      String color = "#FFFFFF";
      try {
        product = args.getJSONObject(0);
        background = args.getString(1);
        color = args.getString(2);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;
      final JSONObject fProduct = product;
      final String fBackground = background;
      final String fColor = color;

      cordova.getActivity().runOnUiThread(() -> {
        if (viewDataMatrixSimpleFinal != null) {
          LinearLayout rlInfoProduct = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("rlInfoProduct", "id", packageName));
          TextView tvLocationText = rlInfoProduct.findViewById(resources.getIdentifier("tvLocationText", "id", packageName));
          TextView tvLocation = rlInfoProduct.findViewById(resources.getIdentifier("tvLocation", "id", packageName));
          TextView tvManufacturerText = rlInfoProduct.findViewById(resources.getIdentifier("tvManufacturerText", "id", packageName));
          TextView tvManufacturer = rlInfoProduct.findViewById(resources.getIdentifier("tvManufacturer", "id", packageName));
          TextView tvModelText = rlInfoProduct.findViewById(resources.getIdentifier("tvModelText", "id", packageName));
          TextView tvModel = rlInfoProduct.findViewById(resources.getIdentifier("tvModel", "id", packageName));
          TextView tvSizeText = rlInfoProduct.findViewById(resources.getIdentifier("tvSizeText", "id", packageName));
          TextView tvSize = rlInfoProduct.findViewById(resources.getIdentifier("tvSize", "id", packageName));
          Button btnNotFound = rlInfoProduct.findViewById(resources.getIdentifier("btnNotFound", "id", packageName));

          if (actionBarMatrixSimple != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            actionBarMatrixSimple.setElevation(0);
          }
          rlInfoProduct.setVisibility(View.VISIBLE);
          rlInfoProduct.setBackgroundDrawable(new ColorDrawable(Color.parseColor(fBackground)));
          tvLocationText.setTextColor(Color.parseColor(fColor));
          tvLocation.setTextColor(Color.parseColor(fColor));
          tvManufacturerText.setTextColor(Color.parseColor(fColor));
          tvManufacturer.setTextColor(Color.parseColor(fColor));
          tvModelText.setTextColor(Color.parseColor(fColor));
          tvModel.setTextColor(Color.parseColor(fColor));
          tvSizeText.setTextColor(Color.parseColor(fColor));
          tvSize.setTextColor(Color.parseColor(fColor));
          btnNotFound.setTextColor(Color.parseColor(fColor));

          try {
            String location = "";
            String reference = fProduct.getJSONObject("product").getString("reference");
            String modelProduct = fProduct.getJSONObject("product").getJSONObject("model").getString("reference");
            String brandProduct = fProduct.getJSONObject("product").getJSONObject("model").getJSONObject("brand").getString("name");
            String sizeProduct = fProduct.getJSONObject("product").getJSONObject("size").getString("name");
            if (fProduct.getJSONObject("inventory").has("rack") && !fProduct.getJSONObject("inventory").isNull("rack") && fProduct.getJSONObject("inventory").has("container") && !fProduct.getJSONObject("inventory").isNull("container")) {
              location = fProduct.getJSONObject("inventory").getJSONObject("container").getString("reference");

              String rack = String.format("%02d", fProduct.getJSONObject("inventory").getJSONObject("rack").getInt("hall"));
              String row = "A";
              String column = String.format("%02d", fProduct.getJSONObject("inventory").getJSONObject("container").getInt("column"));

              String alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
              row = String.valueOf(alphabet.charAt((fProduct.getJSONObject("inventory").getJSONObject("container").getInt("row")-1)));

              location = location.concat(" (P"+rack+row+column+")");
            }
            tvLocation.setText(location);
            tvManufacturer.setText(brandProduct);
            tvModel.setText(modelProduct);
            tvSize.setText(sizeProduct);

            final String fLocation = location;
            btnNotFound.setOnClickListener(view -> {
              AlertDialog.Builder builderWarningProduct404 = new AlertDialog.Builder(MatrixSimpleActivity.matrixSimple);
              builderWarningProduct404
                .setTitle("Atención")
                .setMessage("¿Está seguro de querer reportar como no encontrado el producto " + modelProduct + " en la ubicación " + fLocation + "? (tendrá que escanear la ubicación para confirmar el reporte).")
                .setCancelable(false)
                .setPositiveButton("Reportar", (dialog, id) -> {
                  JSONObject jsonObject = new JSONObject();
                  try {
                    jsonObject.put("result", true);
                    jsonObject.put("product_id", fProduct.getJSONObject("product").getInt("id"));
                    jsonObject.put("action", "product_not_found");
                    jsonObject.put("found", true);
                  } catch (JSONException e) {

                  }
                  PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
                  pResult.setKeepCallback(true);
                  mCallbackContextMatrixSimple.sendPluginResult(pResult);
                })
                .setNegativeButton("Cancelar", (dialog, id) -> {
                  JSONObject jsonObject = new JSONObject();
                  try {
                    jsonObject.put("result", true);
                    jsonObject.put("product_id", fProduct.getJSONObject("product").getInt("id"));
                    jsonObject.put("action", "product_not_found");
                    jsonObject.put("found", false);
                  } catch (JSONException e) {

                  }
                  PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
                  pResult.setKeepCallback(true);
                  mCallbackContextMatrixSimple.sendPluginResult(pResult);
                });
              builderWarningProduct404.create();
              builderWarningProduct404.show();

              JSONObject jsonObject = new JSONObject();
              try {
                jsonObject.put("result", true);
                jsonObject.put("action", "warning_product_not_found");
              } catch (JSONException e) {

              }
              PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
              pResult.setKeepCallback(true);
              mCallbackContextMatrixSimple.sendPluginResult(pResult);
            });
          } catch (JSONException e) {
            e.printStackTrace();
          }
        }
      });
    } else if (action.equals(SHOW_MATRIX_SIMPLE_NEXT_PRODUCT_TO_SCAN)) {

      boolean show = false;
      try {
        show = args.getBoolean(0);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;
      final boolean fShow = show;

      cordova.getActivity().runOnUiThread(() -> {
        if (viewDataMatrixSimpleFinal != null) {
          LinearLayout rlInfoProduct = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("rlInfoProduct", "id", packageName));
          if (fShow) {
            rlInfoProduct.setVisibility(View.VISIBLE);
          } else {
            rlInfoProduct.setVisibility(View.GONE);
          }
        }
      });
    } else if (action.equals(MATRIX_SIMPLE_SHOW_TEXT_START_SCAN_PACKING)) {

      boolean show = false;
      int packingType = 0;
      String packingReference = "";
      try {
        show = args.getBoolean(0);
        packingType = args.getInt(1);
        packingReference = args.getString(2);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;

      final boolean fShow = show;
      final int fPackingType = packingType;
      final String fPackingReference = packingReference;
      cordova.getActivity().runOnUiThread(() -> {
        if (viewDataMatrixSimpleFinal != null) {
          TextView tvPackingStart = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("tvPackingStart", "id", packageName));

          if (fShow) {
            String startScan;
            LinearLayout rlInfoProduct = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("rlInfoProduct", "id", packageName));

            rlInfoProduct.setVisibility(View.GONE);
            tvPackingStart.setVisibility(View.VISIBLE);

            if (fPackingType == 1) {
              if (fPackingReference.isEmpty() || fPackingReference.equals("")) {
                startScan = "Escanea una Jaula para dar comienzo al proceso de picking.";
              } else {
                startScan = "Escanea la Jaula " + fPackingReference + " para continuar con el proceso de picking ya iniciado.";
              }
            } else {
              if (fPackingReference.isEmpty() || fPackingReference.equals("")) {
                startScan = "Escanea un Pallet para dar comienzo al proceso de picking.";
              } else {
                startScan = "Escanea el Pallet " + fPackingReference + " para continuar con el proceso de picking ya iniciado.";
              }
            }
            tvPackingStart.setText(startScan);
          } else {
            tvPackingStart.setText("");
            tvPackingStart.setVisibility(View.GONE);
          }
        }
      });
    } else if (action.equals(MATRIX_SIMPLE_SHOW_TEXT_END_SCAN_PACKING)) {

      boolean show = false;
      int packingType = 0;
      String packingReference = "";
      try {
        show = args.getBoolean(0);
        packingType = args.getInt(1);
        packingReference = args.getString(2);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;

      final boolean fShow = show;
      final int fPackingType = packingType;
      final String fPackingReference = packingReference;
      cordova.getActivity().runOnUiThread(() -> {
        if (viewDataMatrixSimpleFinal != null) {
          TextView tvPackingEnd = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("tvPackingEnd", "id", packageName));

          if (fShow) {
            String endScan;
            LinearLayout rlInfoProduct = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("rlInfoProduct", "id", packageName));

            rlInfoProduct.setVisibility(View.GONE);
            tvPackingEnd.setVisibility(View.VISIBLE);

            if (fPackingType == 1) {
              endScan = "Escanea la Jaula " + fPackingReference + " para finalizar el proceso de picking.";
            } else {
              endScan = "Escanea el Pallet " + fPackingReference + " para finalizar el proceso de picking.";
            }
            tvPackingEnd.setText(endScan);
          } else {
            tvPackingEnd.setText("");
            tvPackingEnd.setVisibility(View.GONE);
          }
        }
      });
    } else if (action.equals(MATRIX_SIMPLE_SHOW_FIXED_TEXT_BOTTOM)) {

      boolean show = false;
      String text = "";
      try {
        show = args.getBoolean(0);
        text = args.getString(1);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;

      final boolean fShow = show;
      final String fText = text;
      cordova.getActivity().runOnUiThread(() -> {
        if (viewDataMatrixSimpleFinal != null) {
          TextView tvBottomText = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("tvBottomText", "id", packageName));

          if (fShow) {
            tvBottomText.setText(fText);
            tvBottomText.setVisibility(View.VISIBLE);
          } else {
            tvBottomText.setText("");
            tvBottomText.setVisibility(View.GONE);
          }
        }
      });
    } else if (action.equals(MATRIX_PICKING_STORES_LOAD_PRODUCTS)) {

      JSONArray products = null;
      JSONArray productsProcessed = null;
      JSONObject filters = null;
      FiltersPickingStores filtersPickingStores = null;
      try {
        products = args.getJSONArray(0);
        productsProcessed = args.getJSONArray(1);
        filters = args.getJSONObject(2);
        if (filters != null) {
          filtersPickingStores = new FiltersPickingStores();
          filtersPickingStores.fromJsonObject(filters);
          MatrixPickingStores.loadFiltersPicking(filtersPickingStores);
        }
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;

      ArrayList<JSONObject> listProductsPending = new ArrayList<>();
      ArrayList<JSONObject> listProductsProcessed = new ArrayList<>();

      try {
        for (int i = 0; i < products.length(); i++) {
          listProductsPending.add(products.getJSONObject(i));
        }
        for (int i = 0; i < productsProcessed.length(); i++) {
          listProductsProcessed.add(productsProcessed.getJSONObject(i));
        }
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final ArrayList<JSONObject> fProductsPending = listProductsPending;
      final ArrayList<JSONObject> fProductsProcessed = listProductsProcessed;
      cordova.getActivity().runOnUiThread(() -> {
        if (viewDataMatrixSimpleFinal != null) {
          MatrixPickingStores.loadProductsPending(cordova.getActivity(), resources, packageName, fProductsPending);
          MatrixPickingStores.loadProductsProcessed(cordova.getActivity(), resources, packageName, fProductsProcessed);
        }
      });
    } else if (action.equals(MATRIX_PICKING_STORES_LOAD_REJECTION_REASONS)) {
      JSONArray rejectionReasons = new JSONArray();

      ArrayList<PickingStoreRejectionReason> listRejectionReason = new ArrayList<>();
      ArrayList<String> listNamesRejectionReason = new ArrayList<>();
      listRejectionReason.add(new PickingStoreRejectionReason(0, null, "Motivo de rechazo"));
      listNamesRejectionReason.add(listRejectionReason.get(0).getName());

      try {
        rejectionReasons = args.getJSONArray(0);

        for (int iRejection = 0; iRejection < rejectionReasons.length(); iRejection++) {
          PickingStoreRejectionReason newRejectionReason = new PickingStoreRejectionReason();
          newRejectionReason.fromJsonObject(rejectionReasons.getJSONObject(iRejection));
          listRejectionReason.add(newRejectionReason);
          listNamesRejectionReason.add(newRejectionReason.getName());
        }
      } catch (JSONException e) {
        e.printStackTrace();
      }

      if (MatrixPickingStores.matrixPickingStores != null) {
        MatrixPickingStores.loadListRejectionReasons(listRejectionReason, listNamesRejectionReason);
      }
    } else if (action.equals(MATRIX_PICKING_STORES_HIDE_INFO_PRODUCT_DIALOG)) {
      if (MatrixPickingStores.matrixPickingStores != null) {
        MatrixPickingStores.hideInfoForProduct();
      }
    } else if (action.equals(MATRIX_PICKING_STORES_SET_TEXT)) {

      Boolean show = true;
      String text = null;
      try {
        show = args.getBoolean(0);
        text = args.getString(1);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;

      final Boolean fShow = show;
      final String fText = text;

      cordova.getActivity().runOnUiThread(() -> {
        if (viewDataMatrixSimpleFinal != null) {
          TextView tvPackingStart = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("tvPackingStart", "id", packageName));
          TextView tvPackingStartFull = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("tvPackingStartFull", "id", packageName));
          if (fShow) {
            tvPackingStart.setText(fText);
            tvPackingStartFull.setText(fText);
            tvPackingStart.setVisibility(View.VISIBLE);
            tvPackingStartFull.setVisibility(View.VISIBLE);
          } else {
            tvPackingStart.setText(null);
            tvPackingStartFull.setText(null);
            tvPackingStart.setVisibility(View.GONE);
            tvPackingStartFull.setVisibility(View.GONE);
          }
        }
      });
    } else if(action.equals(MATRIX_PICKING_STORES_FINISH)) {
      if(MatrixPickingStores.matrixPickingStores != null) {
        MatrixPickingStores.matrixPickingStores.finish();
      }
    } else if (action.equals(MATRIX_PICKING_STORES_SHOW_BUTTON_FINISH)) {

      boolean show = false;
      try {
        show = args.getBoolean(0);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;
      final boolean fShow = show;
      cordova.getActivity().runOnUiThread(() -> {
        if (viewDataMatrixSimpleFinal != null) {
          Button btnFinishPickingStore = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("btnFinishPickingStore", "id", packageName));
          if(btnFinishPickingStore != null){
            btnFinishPickingStore.setVisibility(fShow ? View.VISIBLE : View.GONE);
          }
        }
      });
    } else if (action.equals(MATRIX_PICKING_STORES_SHOW_BUTTON_PACKING)) {

      boolean show = false;
      try {
        show = args.getBoolean(0);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;
      final boolean fShow = show;
      cordova.getActivity().runOnUiThread(() -> {
        if (viewDataMatrixSimpleFinal != null) {
          Button btnPackingPickingStore = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("btnPackingPickingStore", "id", packageName));
          if(btnPackingPickingStore != null){
            btnPackingPickingStore.setVisibility(fShow ? View.VISIBLE : View.GONE);
          }
        }
      });
    } else if (action.equals(MATRIX_SIMPLE_SHOW_BUTTON_FINISH_RECEPTION)) {

      Boolean show = true;
      try {
        show = args.getBoolean(0);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;

      final Boolean fShow = show;

      cordova.getActivity().runOnUiThread(() -> {
        if (viewDataMatrixSimpleFinal != null) {
          Button btnFinishReception = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("btnFinishReception", "id", packageName));
          if (fShow) {
            btnFinishReception.setVisibility(View.VISIBLE);

            btnFinishReception.setOnClickListener(view -> {
              JSONObject jsonObject = new JSONObject();
              try {
                jsonObject.put("result", true);
                jsonObject.put("action", "finish_reception");
              } catch (JSONException e) {

              }
              PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
              pResult.setKeepCallback(true);
              mCallbackContextMatrixSimple.sendPluginResult(pResult);
            });
          } else {
            btnFinishReception.setVisibility(View.GONE);
          }
        }
      });
    } else if (action.equals(MATRIX_SIMPLE_SHOW_WARNING)) {

      Boolean show = true;
      String text = "Ha ocurrido un problema que requiere de su intervención.";
      String actionWarning = "not_defined";
      String textPositiveButton = "Aceptar";
      String textNegativeButton = null;
      try {
        show = args.getBoolean(0);
        text = args.getString(1);
        actionWarning = args.getString(2);
        textPositiveButton = args.getString(3);
        textNegativeButton = args.getString(4);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      if (show) {
        String fActionWarning = actionWarning;

        AlertDialog.Builder builder = new AlertDialog.Builder(activityStarted);
        builder
          .setTitle("Atención")
          .setMessage(text)
          .setCancelable(false)
          .setPositiveButton(textPositiveButton, (dialog, id) -> {
            JSONObject jsonObject = new JSONObject();
            try {
              jsonObject.put("result", true);
              jsonObject.put("response", true);
              jsonObject.put("action", fActionWarning);
            } catch (JSONException e) {

            }
            PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
            pResult.setKeepCallback(true);
            mCallbackContextMatrixSimple.sendPluginResult(pResult);
          });

        if (textNegativeButton != null) {
          builder.setNegativeButton(textNegativeButton, (dialog, id) -> {
            JSONObject jsonObject = new JSONObject();
            try {
              jsonObject.put("result", true);
              jsonObject.put("response", false);
              jsonObject.put("action", fActionWarning);
            } catch (JSONException e) {

            }
            PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
            pResult.setKeepCallback(true);
            mCallbackContextMatrixSimple.sendPluginResult(pResult);
          });
        }

        builder.create();
        builder.show();
      }
    } else if (action.equals(MATRIX_SIMPLE_ALERT_SELECT_SIZE_TO_PRINT)) {

      String title = "Selecciona talla a usar";
      JSONArray listItems = null;
      String[] listSizesToPrint = null;
      try {
        title = args.getString(0);
        listItems = args.getJSONArray(1);

        if (listItems != null && listItems.length() > 0) {
          listSizesToPrint = new String[listItems.length()];

          for (int iPriceProduct = 0; iPriceProduct < listItems.length(); iPriceProduct++) {
            JSONObject product = listItems.getJSONObject(iPriceProduct);
            JSONObject rangesNumbers = product.getJSONObject("rangesNumbers");
            if (rangesNumbers != null) {
              String sizeRangeNumberMax = rangesNumbers.getString("sizeRangeNumberMax");
              String sizeRangeNumberMin = rangesNumbers.getString("sizeRangeNumberMin");

              String rangeSizes = sizeRangeNumberMin;
              if (!sizeRangeNumberMin.equals(sizeRangeNumberMax)) {
                rangeSizes = rangeSizes.concat(" - " + sizeRangeNumberMax);
              }
              listSizesToPrint[iPriceProduct] = rangeSizes;
            }
          }
        }
      } catch (JSONException e) {
        e.printStackTrace();
      }

      if (listSizesToPrint != null && listSizesToPrint.length > 0) {
        AlertDialog.Builder builder = new AlertDialog.Builder(MatrixPrintTags.matrixPrintTags);
        builder.setTitle(title);
        builder.setItems(listSizesToPrint, (dialogInterface, i) -> {
          JSONObject jsonObject = new JSONObject();
          try {
            jsonObject.put("result", true);
            jsonObject.put("size_selected", i);
            jsonObject.put("action", "select_size");
          } catch (JSONException e) {

          }
          PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
          pResult.setKeepCallback(true);
          mCallbackContextMatrixSimple.sendPluginResult(pResult);
        });
        builder.create().show();
      }
    } else if (action.equals(MATRIX_PRODUCT_INFO)) {
      mCallbackContextMatrixSimple = callbackContext;
      String title = "";
      String backgroundTitle = "";
      String colorTitle = "";
      String urlBase = "";
      try {
        title = args.getString(0);
        backgroundTitle = args.getString(1);
        colorTitle = args.getString(2);
        urlBase = args.getString(3);
      } catch (JSONException e) {
        e.printStackTrace();
      }
      Bundle b = new Bundle();
      b.putString("title", title);
      b.putString("backgroundTitle", backgroundTitle);
      b.putString("colorTitle", colorTitle);
      b.putString("urlBase", urlBase);
      Intent intent = new Intent(this.cordova.getActivity(), MatrixProductInfo.class);
      intent.putExtras(b);
      this.cordova.startActivityForResult(this, intent, 6);
    } else if (action.equals(MATRIX_PRODUCT_INFO_SHOW_EXTENDED)) {
      Context appContext = cordova.getActivity().getApplicationContext();

      Boolean show = true;
      JSONObject productAndSizes = null;
      ProductModel productModel = null;
      try {
        show = args.getBoolean(0);
        productAndSizes = args.getJSONObject(1);

        if (show && productAndSizes != null && !productAndSizes.isNull("productModel")) {
          productModel = new ProductModel();
          productModel.fromJsonObject(productAndSizes);
        }
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;

      final Boolean fShow = show;
      final ProductModel fProductModel = productModel;

      cordova.getActivity().runOnUiThread(() -> {
        if (viewDataMatrixSimpleFinal != null) {
          LinearLayout llExtendedProductInfo = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("llExtendedProductInfo", "id", packageName));
          LinearLayout llPBExtendedProductInfo = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("llPBExtendedProductInfo", "id", packageName));
          if (fShow && fProductModel != null) {
            if (llPBExtendedProductInfo.getVisibility() == View.VISIBLE) {
              llPBExtendedProductInfo.setVisibility(View.GONE);
            }
            llExtendedProductInfo.setVisibility(View.VISIBLE);
            MatrixProductInfo.loadProductExtendedInfo(llExtendedProductInfo, fProductModel, resources, packageName, appContext);
          } else {
            llExtendedProductInfo.setVisibility(View.GONE);
          }
        }
      });
    } else if (action.equals(MATRIX_SHOW_PROGRESS_BAR_PRODUCT_EXTENDED_INFO)) {

      Boolean show = true;
      try {
        show = args.getBoolean(0);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;

      final Boolean fShow = show;

      cordova.getActivity().runOnUiThread(() -> {
        if (viewDataMatrixSimpleFinal != null) {
          LinearLayout llPBExtendedProductInfo = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("llPBExtendedProductInfo", "id", packageName));
          if (fShow) {
            llPBExtendedProductInfo.setVisibility(View.VISIBLE);
          } else {
            llPBExtendedProductInfo.setVisibility(View.GONE);
          }
        }
      });
    } else if (action.equals(SWITCH_TO_IONIC)) {
      mCallbackContextMatrixSimple = callbackContext;

      String title = "";
      String backgroundTitle = "";
      String colorTitle = "";

      try {
        title = args.getString(0);
        backgroundTitle = args.getString(1);
        colorTitle = args.getString(2);
      } catch (JSONException e) {
        e.printStackTrace();
      }
      Bundle b = new Bundle();
      b.putString("title", title);
      b.putString("backgroundTitle", backgroundTitle);
      b.putString("colorTitle", colorTitle);
      Intent intent = new Intent(this.cordova.getActivity(), SwitchToIonicActivity.class);
      intent.putExtras(b);
      this.cordova.startActivityForResult(this, intent, 6);
    } else if (action.equals(SWITCH_TO_IONIC_SET_MAIN_TEXT)) {
      boolean show = false;
      String text = "";

      try {
        show = args.getBoolean(0);
        text = args.getString(1);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;

      final boolean fShow = show;
      final String fText = text;

      cordova.getActivity().runOnUiThread(() -> {
        TextView tvMainText;
        if (viewDataMatrixSimpleFinal != null) {
          tvMainText = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("tvMainText", "id", packageName));

          if (fShow) {
            tvMainText.setVisibility(View.VISIBLE);
            tvMainText.setText(fText);
          } else {
            tvMainText.setVisibility(View.GONE);
          }
        }
      });
    } else if (action.equals(SWITCH_TO_IONIC_SET_ORIGIN_TEXT)) {
      boolean show = false;
      String origin = "";

      try {
        show = args.getBoolean(0);
        origin = args.getString(1);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      final View viewDataMatrixSimpleFinal = this.viewDataMatrixSimple;

      final boolean fShow = show;
      final String fOrigin = origin;

      cordova.getActivity().runOnUiThread(() -> {
        LinearLayout llOriginText;
        TextView tvOriginText;
        if (viewDataMatrixSimpleFinal != null) {
          llOriginText = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("llOriginText", "id", packageName));
          tvOriginText = viewDataMatrixSimpleFinal.findViewById(resources.getIdentifier("tvOriginText", "id", packageName));

          if (fShow) {
            llOriginText.setVisibility(View.VISIBLE);
            tvOriginText.setText(fOrigin);
          } else {
            llOriginText.setVisibility(View.GONE);
          }
        }
      });
    } else if (action.equals(SHOW_LOADING_DIALOG)) {
      String message = "";

      try {
        message = args.getString(0);
      } catch (JSONException e) {
        e.printStackTrace();
      }

      loadingDialog = ProgressDialog.show(activityStarted, "", message, true);
    } else if (action.equals(HIDE_LOADING_DIALOG)) {
      loadingDialog.dismiss();
    } else {
      callbackContext.error("Invalid Action: " + action);
      return false;
    }
    return true;
  }

  private void initLicense(JSONArray data) {
    if (data.length() < 1) {
      Log.e("ScanditSDK", "The initLicense call received too few arguments and has to return without starting.");
      return;
    }

    try {
      String appKey = data.getString(0);
      ScanditSDKGlobals.usedFramework = "phonegap";
      ScanditLicense.setAppKey(appKey);
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  public void onRequestPermissionResult(int requestCode, String[] permissions,
                                        int[] grantResults) throws JSONException {
    if (requestCode != REQUEST_CAMERA_PERMISSION) {
      return;
    }
    mRequestingCameraPermission = false;
    // execute all the queued commands and clear.
    for (Command queuedCommand : mQueuedCommands) {
      this.executeCommand(queuedCommand.action, queuedCommand.args,
        queuedCommand.callbackContext, true);
    }
    mQueuedCommands.clear();
  }

  private void show(JSONArray data) {
    if (data.length() > 2) {
      // We extract all options and add them to the intent extra bundle.
      try {
        final JSONObject settings = unifyRecognitionMode(data.getJSONObject(0));
        final Bundle options = new Bundle();
        setOptionsOnBundle(data.getJSONObject(1), options);
        final Bundle overlayOptions = new Bundle();
        setOptionsOnBundle(data.getJSONObject(2), overlayOptions);
        showPicker(settings, options, overlayOptions, false);

      } catch (JSONException e) {
        Log.e("ScanditSDK", "The show call received too few arguments and has to return without starting.");
        e.printStackTrace();
      }
    }
  }

  private void showPicker(final JSONObject settings, final Bundle options,
                          final Bundle overlayOptions, final boolean legacyMode) {
    mWorker.getHandler().post(new Runnable() {
      @Override
      public void run() {
        boolean showPickerAsSubView =
          options.containsKey(PhonegapParamParser.paramPortraitMargins) ||
            options.containsKey(PhonegapParamParser.paramLandscapeMargins) ||
            options.containsKey(PhonegapParamParser.paramPortraitConstraints) ||
            options.containsKey(PhonegapParamParser.paramLandscapeConstraints);
        if (showPickerAsSubView) {
          if (mPickerController == null || !(mPickerController instanceof SubViewPickerController)) {
            mPickerController = new SubViewPickerController(ScanditSDK.this, mCallbackContext);
          }
        } else {
          mPickerController = new FullscreenPickerController(ScanditSDK.this, mCallbackContext);
        }

        mPickerController.show(settings, options, overlayOptions, legacyMode);
      }
    });
  }

  private void applySettings(JSONArray data) {
    if (data.length() < 1) {
      Log.e("ScanditSDK", "The applySettings call received too few arguments and has to return without starting.");
      return;
    }
    try {
      final JSONObject settings = unifyRecognitionMode(data.getJSONObject(0));

      mWorker.getHandler().post(new Runnable() {
        @Override
        public void run() {
          cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
              if (mPickerController == null)
                return;
              try {
                ScanSettings scanSettings = ScanSettings.createWithJson(settings);
                mPickerController.applyScanSettings(scanSettings);
              } catch (JSONParseException e) {
                Log.e("ScanditSDK", "Exception when creating settings");
                e.printStackTrace();
              }
            }
          });
        }
      });
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  private JSONObject unifyRecognitionMode(JSONObject settings) throws JSONException {
    if (settings.has("recognitionMode")) {
      int mode = settings.optInt("recognitionMode", -1);
      if (mode == 1) {
        settings.put("recognitionMode", "text");
      } else if (mode == 2) {
        settings.put("recognitionMode", "code");
      }
    }

    return settings;
  }

  private void updateOverlay(final JSONArray data) {
    if (data.length() < 1) {
      Log.e("ScanditSDK", "The updateOverlay call received too few arguments and has to return without starting.");
      return;
    }

    mWorker.getHandler().post(new Runnable() {
      @Override
      public void run() {
        if (mPickerController != null) {
          final Bundle bundle = new Bundle();
          try {
            setOptionsOnBundle(data.getJSONObject(0), bundle);
            mPickerController.updateUI(bundle);
          } catch (JSONException e) {
            e.printStackTrace();
          }
        }
      }
    });
  }

  private void cancel(JSONArray data) {
    mWorker.getHandler().post(new Runnable() {
      @Override
      public void run() {
        if (mPickerController == null) return;
        mPickerController.close();
      }
    });
  }

  private void startScanning() {
    mWorker.getHandler().post(new Runnable() {
      @Override
      public void run() {
        if (mPickerController == null) return;
        mPickerController.startScanning();
      }
    });
  }

  private void setPickerState(final int state) {
    mWorker.getHandler().post(new Runnable() {
      @Override
      public void run() {
        if (mPickerController == null) return;
        mPickerController.setState(state);
      }
    });
  }

  private void resize(final JSONArray data) {
    if (data.length() < 1) {
      Log.e("ScanditSDK", "The resize call received too few arguments and has to return without starting.");
      return;
    }
    mWorker.getHandler().post(new Runnable() {
      @Override
      public void run() {
        if (mPickerController != null) {
          final Bundle bundle = new Bundle();
          try {
            setOptionsOnBundle(data.getJSONObject(0), bundle);
            mPickerController.updateLayout(bundle);
          } catch (JSONException e) {
            e.printStackTrace();
          }
        }
      }
    });
  }

  private void torch(final JSONArray data) {
    if (data.length() < 1) {
      Log.e("ScanditSDK", "The torch call received too few arguments and has to return without starting.");
      return;
    }
    mWorker.getHandler().post(new Runnable() {
      @Override
      public void run() {
        try {
          boolean enabled = data.getBoolean(0);
          mPickerController.setTorchEnabled(enabled);
        } catch (JSONException e) {
          // FIXME: error handling?
          e.printStackTrace();
        }
      }
    });
  }

  private void finishDidScanCallback(final JSONArray data) {
    mPickerController.finishDidScanCallback(data);
  }

  private void finishDidRecognizeNewCodesCallback(final JSONArray data) {
    mPickerController.finishDidRecognizeNewCodesCallback(data);
  }

  private void setOptionsOnBundle(JSONObject options, Bundle bundle) {
    @SuppressWarnings("unchecked")
    Iterator<String> iter = options.keys();
    while (iter.hasNext()) {
      String key = iter.next();
      Object obj = options.opt(key);
      if (obj != null) {
        if (obj instanceof Float) {
          bundle.putFloat(key.toLowerCase(), (Float) obj);
        } else if (obj instanceof Double) {
          bundle.putFloat(key.toLowerCase(), new Float((Double) obj));
        } else if (obj instanceof Integer) {
          bundle.putInt(key.toLowerCase(), (Integer) obj);
        } else if (obj instanceof Boolean) {
          bundle.putBoolean(key.toLowerCase(), (Boolean) obj);
        } else if (obj instanceof String) {
          bundle.putString(key.toLowerCase(), (String) obj);
        } else if (obj instanceof JSONArray) {
          ArrayList<Object> list = new ArrayList<Object>();
          JSONArray array = (JSONArray) obj;
          for (int i = 0; i < array.length(); i++) {
            try {
              Object item = array.get(i);
              if (item instanceof Double) {
                list.add(new Float((Double) item));
              } else {
                list.add(array.get(i));
              }
            } catch (JSONException e) {
              e.printStackTrace();
            }
          }
          bundle.putSerializable(key.toLowerCase(), list);
        } else if (obj instanceof JSONObject) {
          Bundle dictionary = new Bundle();
          setOptionsOnBundle((JSONObject) obj, dictionary);
          bundle.putBundle(key.toLowerCase(), dictionary);
        }
      }
    }
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (mPickerController == null) return;
    mPickerController.onActivityResult(requestCode, resultCode, data);
  }

  @Override
  public void onPause(boolean multitasking) {
    super.onPause(multitasking);
    if (mPickerController == null) return;
    mPickerController.onActivityPause();
  }

  @Override
  public void onResume(boolean multitasking) {
    super.onResume(multitasking);
    if (mPickerController == null) return;
    mPickerController.onActivityResume();
  }

  public static void setViewProductData(View newViewProductData) {
    viewProductData = newViewProductData;
  }

  public static void setViewDataMatrixSimple(View view) {
    viewDataMatrixSimple = view;

    JSONObject jsonObject = new JSONObject();
    try {
      jsonObject.put("result", true);
      jsonObject.put("action", "matrix_simple");
    } catch (JSONException e) {

    }
    PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
    pResult.setKeepCallback(true);
    mCallbackContextMatrixSimple.sendPluginResult(pResult);
  }

  public static void setActivityStarted(Activity activity) {
    activityStarted = activity;
  }

  public static void setActionBar(ActionBar actionBar) {
    actionBarMatrixSimple = actionBar;
  }

}
