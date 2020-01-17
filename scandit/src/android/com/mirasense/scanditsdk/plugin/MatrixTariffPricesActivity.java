package com.mirasense.scanditsdk.plugin;

import android.app.ActionBar;
import android.app.Activity;
import android.content.res.Resources;
import android.graphics.RectF;
import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.TextView;

import com.scandit.barcodepicker.BarcodePicker;
import com.scandit.barcodepicker.ScanOverlay;
import com.scandit.barcodepicker.ScanSettings;
import com.scandit.matrixscan.MatrixScan;
import com.scandit.recognition.Barcode;
import com.scandit.recognition.SymbologySettings;

import org.apache.cordova.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;

public class MatrixTariffPricesActivity extends Activity {

  public static Activity matrixAuditMultipleActivity;
  private BarcodePicker mPicker;
  private MatrixSimpleOverlayListener matrixScanListener;
  private FrameLayout pickerContainer;
  private TextView tvActionToUser;

  private String package_name;
  private Resources resources;

  public static final int NOTICE_BUBBLE_ACTION = 1;
  public static final int NOTICE_BUBBLE_ERROR = 2;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    package_name = getApplication().getPackageName();
    resources = getApplication().getResources();

    ActionBar actionBar = getActionBar();
    if (actionBar != null) {
      actionBar.hide();
    }

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

    setContentView(resources.getIdentifier("audit_multiple_activity", "layout", package_name));

    ScanditSDK.setViewDataMatrixSimple(this.findViewById(android.R.id.content).getRootView());

    ScanSettings settings = ScanSettings.create();
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE128, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE39, true);
    SymbologySettings symSettings128 = settings.getSymbologySettings(Barcode.SYMBOLOGY_CODE128);
    short[] activeSymbolCounts128 = new short[]{
      7, 8, 9, 12, 14, 15, 16, 17, 18
    };
    symSettings128.setActiveSymbolCounts(activeSymbolCounts128);

    SymbologySettings symSettings39 = settings.getSymbologySettings(Barcode.SYMBOLOGY_CODE39);
    short[] activeSymbolCounts39 = new short[]{
      8
    };
    symSettings39.setActiveSymbolCounts(activeSymbolCounts39);

    settings.setMatrixScanEnabled(true);
    settings.setMaxNumberOfCodesPerFrame(1);
    settings.setCodeRejectionEnabled(true);

    settings.setActiveScanningArea(ScanSettings.ORIENTATION_PORTRAIT, new RectF(0.0f, 0.0f, 1f, 1f));
    settings.setActiveScanningArea(ScanSettings.ORIENTATION_LANDSCAPE, new RectF(0.0f, 0.0f, 1f, 1f));

    // Instantiate the barcode picker by using the settings defined above.
    mPicker = new BarcodePicker(this, settings);

    matrixScanListener = new MatrixSimpleOverlayListener();

    MatrixScan matrixScan = new MatrixScan(mPicker, matrixScanListener);

    // You can enable beeping via:
    matrixScan.setBeepOnNewCode(true);

    mPicker.getOverlayView().setTorchEnabled(false);
    mPicker.getOverlayView().setBeepEnabled(true);
    mPicker.getOverlayView().setViewfinderDimension(0.9f, 0.75f, 0.95f, 0.9f);
    mPicker.getOverlayView().setGuiStyle(ScanOverlay.GUI_STYLE_MATRIX_SCAN);

    pickerContainer = findViewById(resources.getIdentifier("picker", "id", package_name));
    pickerContainer.addView(mPicker);
    mPicker.startScanning();

    ImageButton arrowBack = findViewById(resources.getIdentifier("ibBack", "id", package_name));
    arrowBack.setOnClickListener(v -> exitFromAuditMultiple(false));

    tvActionToUser = findViewById(resources.getIdentifier("tvActionToUser", "id", package_name));
    changeNoticeBubble("Escanea el artículo a imprimir", NOTICE_BUBBLE_ACTION);

    matrixAuditMultipleActivity = this;
    ScanditSDK.setActivityStarted(matrixAuditMultipleActivity);
  }

  public void exitFromAuditMultiple(boolean gotToManualScanner) {
    JSONObject jsonObject = new JSONObject();
    try {
      jsonObject.put("result", false);
      jsonObject.put("exit", true);
      jsonObject.put("manual", gotToManualScanner);
    } catch (JSONException e) {
      e.printStackTrace();
    }
    PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
    pResult.setKeepCallback(true);
    ScanditSDK.mCallbackContextMatrixSimple.sendPluginResult(pResult);
    finish();
  }

  public void changeNoticeBubble(String text, int type) {
    Log.i("Test::6", "changeNoticeBubble");
    this.runOnUiThread(() -> {
      Log.i("Test::7", "runOnUiThread");
      Log.i("Test::8", text);
      Log.i("Test::9", String.valueOf(type));
      if (tvActionToUser != null) {
        Log.i("Test::10", "Element tvActionToUser NOT null");
        int backgroundResourceId;
        if (type == NOTICE_BUBBLE_ERROR) {
          Log.i("Test::11", "NOTICE_BUBBLE_ERROR");
          backgroundResourceId = resources.getIdentifier("bg_rounded_notice_red", "drawable", package_name);
        } else {
          Log.i("Test::12", "else NOTICE_BUBBLE_ERROR");
          backgroundResourceId = resources.getIdentifier("bg_rounded_notice_black", "drawable", package_name);
        }
        Log.i("Test::13", "change style");
        tvActionToUser.setBackgroundResource(backgroundResourceId);
        Log.i("Test::14", "change text");
        tvActionToUser.setText(text);
        Log.i("Test::15", "already changed");
      } else {
        Log.i("Test::16", "Element tvActionToUser IS null");
      }
    });
  }

  @Override
  protected void onResume() {
    mPicker.startScanning();
    super.onResume();
  }

  @Override
  protected void onPause() {
    mPicker.stopScanning();
    super.onPause();
  }

  @Override
  protected void onStop() {
    super.onStop();
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
  }

  @Override
  public void onBackPressed() {
    exitFromAuditMultiple(false);
  }

}
