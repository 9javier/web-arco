package com.mirasense.scanditsdk.plugin;

import android.app.ActionBar;
import android.app.Activity;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.RectF;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
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

public class MatrixPickingStores extends Activity {

  public static Activity matrixPickingStores;
  private BarcodePicker mPicker;
  private MatrixSimpleOverlayListener matrixScanListener;
  private FrameLayout pickerContainer;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Bundle b = getIntent().getExtras();
    String title = "AL Krack";
    String backgroundTitle = "#FFFFFF";
    String colorTitle = "#424242";
    if (b != null) {
      title = b.getString("title", "AL Krack");
      backgroundTitle = b.getString("backgroundTitle", "#FFFFFF");
      colorTitle = b.getString("colorTitle", "#424242");
    }

    String package_name = getApplication().getPackageName();
    Resources resources = getApplication().getResources();

    ActionBar actionBar = getActionBar();
    actionBar.setDisplayShowCustomEnabled(true);
    actionBar.setBackgroundDrawable(new ColorDrawable(Color.parseColor(backgroundTitle)));
    actionBar.setCustomView(resources.getIdentifier("title_bar_matrixsimple", "layout", package_name));
    ScanditSDK.setActionBar(actionBar);

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
      WindowManager.LayoutParams.FLAG_FULLSCREEN);

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
      WindowManager.LayoutParams.FLAG_FULLSCREEN);

    setContentView(resources.getIdentifier("references_matrix_picking_stores", "layout", package_name));

    ((TextView) findViewById(resources.getIdentifier("action_bar_title", "id", package_name))).setText(title);
    ((TextView) findViewById(resources.getIdentifier("action_bar_title", "id", package_name))).setTextColor(Color.parseColor(colorTitle));


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

    settings.setActiveScanningArea(ScanSettings.ORIENTATION_PORTRAIT, new RectF(0, 0, 1, 0.3f));
    settings.setActiveScanningArea(ScanSettings.ORIENTATION_LANDSCAPE, new RectF(0, 0, 1, 0.3f));

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

    ImageButton arrowBack = (ImageButton) findViewById(resources.getIdentifier("arrow_back_button", "id", package_name));
    arrowBack.setOnClickListener( new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        finish();
      }
    });

    RelativeLayout rlTitleSmallProductsList = findViewById(resources.getIdentifier("rlTitleSmallProductsList", "id", package_name));
    rlTitleSmallProductsList.setOnClickListener(v -> {
      LinearLayout llListProductsSmall = findViewById(resources.getIdentifier("llListProductsSmall", "id", package_name));
      llListProductsSmall.setVisibility(View.GONE);
      LinearLayout llListProductsFull = findViewById(resources.getIdentifier("llListProductsFull", "id", package_name));
      llListProductsFull.setVisibility(View.VISIBLE);
    });

    RelativeLayout rlTitleFullProductsList = findViewById(resources.getIdentifier("rlTitleFullProductsList", "id", package_name));
    rlTitleFullProductsList.setOnClickListener(v -> {
      LinearLayout llListProductsSmall = findViewById(resources.getIdentifier("llListProductsSmall", "id", package_name));
      llListProductsSmall.setVisibility(View.VISIBLE);
      LinearLayout llListProductsFull = findViewById(resources.getIdentifier("llListProductsFull", "id", package_name));
      llListProductsFull.setVisibility(View.GONE);
    });

   Button btnFinishPickingStore = findViewById(resources.getIdentifier("btnFinishPickingStore", "id", package_name));
    btnFinishPickingStore.setOnClickListener(v -> {
      JSONObject jsonObject = new JSONObject();
      try {
        jsonObject.put("result", true);
        jsonObject.put("action", "matrix_simple_finish_picking");
      } catch (JSONException e) {

      }
      PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
      pResult.setKeepCallback(true);
      ScanditSDK.mCallbackContextMatrixSimple.sendPluginResult(pResult);
    });

    matrixPickingStores = this;
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
    super.onBackPressed();
  }

}
