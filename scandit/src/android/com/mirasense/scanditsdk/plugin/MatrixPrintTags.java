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
import android.widget.Switch;
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

public class MatrixPrintTags extends Activity {

  public static Activity matrixPrintTags;
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
    int typeTag = 1;
    if (b != null) {
      title = b.getString("title", "AL Krack");
      backgroundTitle = b.getString("backgroundTitle", "#FFFFFF");
      colorTitle = b.getString("colorTitle", "#424242");
      typeTag = b.getInt("typeTag", 1);
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

    setContentView(resources.getIdentifier("references_matrix_print_tags", "layout", package_name));

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

    settings.setActiveScanningArea(ScanSettings.ORIENTATION_PORTRAIT, new RectF(0.1f, 0.33f, 0.9f, 0.67f));
    settings.setActiveScanningArea(ScanSettings.ORIENTATION_LANDSCAPE, new RectF(0.4f, 0.2f, 0.6f, 0.8f));

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

    ImageButton arrowBack = findViewById(resources.getIdentifier("arrow_back_button", "id", package_name));
    arrowBack.setOnClickListener(v -> finish());

    Switch sTypeTags = findViewById(resources.getIdentifier("sTypeTags", "id", package_name));
    TextView tvTagsName = findViewById(resources.getIdentifier("tvTagsName", "id", package_name));
    TextView tvPricesName = findViewById(resources.getIdentifier("tvPricesName", "id", package_name));

    if (typeTag == 1) {
      sTypeTags.setVisibility(View.VISIBLE);
      tvTagsName.setVisibility(View.VISIBLE);
      tvPricesName.setVisibility(View.VISIBLE);
      sTypeTags.setChecked(false);
    } else if (typeTag == 2) {
      sTypeTags.setVisibility(View.VISIBLE);
      tvTagsName.setVisibility(View.VISIBLE);
      tvPricesName.setVisibility(View.VISIBLE);
      sTypeTags.setChecked(true);
    } else if (typeTag == 3) {
      sTypeTags.setVisibility(View.GONE);
      tvTagsName.setVisibility(View.GONE);
      tvPricesName.setVisibility(View.GONE);
    } else {
      sTypeTags.setVisibility(View.GONE);
      tvTagsName.setVisibility(View.GONE);
      tvPricesName.setVisibility(View.GONE);
    }

    sTypeTags.setOnClickListener(view -> {
      int typeTagSelected = 1;
      if (((Switch)view).isChecked()) {
        typeTagSelected = 2;
      }
      JSONObject jsonObject = new JSONObject();
      try {
        jsonObject.put("result", true);
        jsonObject.put("action", "change_tag_type");
        jsonObject.put("type_tags", typeTagSelected);
      } catch (JSONException e) {

      }
      PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
      pResult.setKeepCallback(true);
      ScanditSDK.mCallbackContextMatrixSimple.sendPluginResult(pResult);
    });

    matrixPrintTags = this;
    ScanditSDK.setActivityStarted(matrixPrintTags);
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
