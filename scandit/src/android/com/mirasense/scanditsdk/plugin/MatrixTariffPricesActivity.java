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
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import com.scandit.barcodepicker.BarcodePicker;
import com.scandit.barcodepicker.ScanOverlay;
import com.scandit.barcodepicker.ScanSettings;
import com.scandit.matrixscan.MatrixScan;
import com.scandit.recognition.Barcode;

public class MatrixTariffPricesActivity extends Activity {

  public static Activity matrixProductInfo;
  private BarcodePicker mPicker;
  private static String package_name;
  private static Resources resources;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Bundle b = getIntent().getExtras();
    String title = "Imprimir tarifas";
    String backgroundTitle = "#000000";
    String colorTitle = "#FFFFFF";
    if (b != null) {
      title = b.getString("title", "Imprimir tarifas");
      backgroundTitle = b.getString("backgroundTitle", "#000000");
      colorTitle = b.getString("colorTitle", "#FFFFFF");
    }

    package_name = getApplication().getPackageName();
    resources = getApplication().getResources();

    ActionBar actionBar = getActionBar();
    if(actionBar != null) {
      actionBar.setDisplayShowCustomEnabled(true);
      actionBar.setBackgroundDrawable(new ColorDrawable(Color.parseColor(backgroundTitle)));
      actionBar.setCustomView(resources.getIdentifier("title_bar_matrixsimple", "layout", package_name));
      ScanditSDK.setActionBar(actionBar);
    }

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

    setContentView(resources.getIdentifier("tariff_prices", "layout", package_name));

    ((TextView) findViewById(resources.getIdentifier("action_bar_title", "id", package_name))).setText(title);
    ((TextView) findViewById(resources.getIdentifier("action_bar_title", "id", package_name))).setTextColor(Color.parseColor(colorTitle));

    ScanditSDK.setViewDataMatrixSimple(this.findViewById(android.R.id.content).getRootView());

    ScanSettings settings = ScanSettings.create();
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE128, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE39, true);
    settings.getSymbologySettings(Barcode.SYMBOLOGY_CODE128).setActiveSymbolCounts(new short[]{ 7, 8, 9, 12, 14, 15, 16, 17, 18 });
    settings.getSymbologySettings(Barcode.SYMBOLOGY_CODE39).setActiveSymbolCounts(new short[]{ 8 });
    settings.setMatrixScanEnabled(true);
    settings.setMaxNumberOfCodesPerFrame(1);
    settings.setCodeRejectionEnabled(true);
    settings.setActiveScanningArea(ScanSettings.ORIENTATION_PORTRAIT, new RectF(0.1f, 0.15f, 0.9f, 0.4f));
    settings.setActiveScanningArea(ScanSettings.ORIENTATION_LANDSCAPE, new RectF(0.4f, 0.2f, 0.6f, 0.8f));

    mPicker = new BarcodePicker(this, settings);

    MatrixSimpleOverlayListener matrixScanListener = new MatrixSimpleOverlayListener();
    matrixScanListener.setContextActivity(this);

    MatrixScan matrixScan = new MatrixScan(mPicker, matrixScanListener);

    matrixScan.setBeepOnNewCode(true);

    mPicker.getOverlayView().setTorchEnabled(false);
    mPicker.getOverlayView().setBeepEnabled(true);
    mPicker.getOverlayView().setViewfinderDimension(0.9f, 0.75f, 0.95f, 0.9f);
    mPicker.getOverlayView().setGuiStyle(ScanOverlay.GUI_STYLE_MATRIX_SCAN);

    FrameLayout pickerContainer = findViewById(resources.getIdentifier("picker", "id", package_name));
    pickerContainer.addView(mPicker);
    mPicker.startScanning();

    ImageButton arrowBack = findViewById(resources.getIdentifier("arrow_back_button", "id", package_name));
    arrowBack.setOnClickListener(v -> finish());

    findViewById(resources.getIdentifier("button", "id", package_name)).setVisibility(View.INVISIBLE);
    findViewById(resources.getIdentifier("TopInfo", "id", package_name)).setVisibility(View.INVISIBLE);
    findViewById(resources.getIdentifier("BottomInfo", "id", package_name)).setVisibility(View.INVISIBLE);

    matrixProductInfo = this;
    ScanditSDK.setActivityStarted(matrixProductInfo);
  }

  public static void loadPriceInfo(LinearLayout layout, String[] priceData){
    TextView message = layout.findViewById(resources.getIdentifier("message", "id", package_name));
    message.setText(priceData[0]);

    if(priceData[1] != null) {
      TextView reference = layout.findViewById(resources.getIdentifier("refEdit", "id", package_name));
      TextView brand = layout.findViewById(resources.getIdentifier("braEdit", "id", package_name));
      TextView style = layout.findViewById(resources.getIdentifier("styEdit", "id", package_name));
      TextView status = layout.findViewById(resources.getIdentifier("staEdit", "id", package_name));
      TextView price = layout.findViewById(resources.getIdentifier("priEdit", "id", package_name));

      reference.setText(priceData[1]);
      brand.setText(priceData[2]);
      style.setText(priceData[3]);
      status.setText(priceData[4]);
      price.setText(priceData[5]);

      if(!priceData[4].equalsIgnoreCase("Nuevo") && !priceData[4].equalsIgnoreCase("Actualizado")){
        layout.findViewById(resources.getIdentifier("button", "id", package_name)).setVisibility(View.VISIBLE);
      }else{
        layout.findViewById(resources.getIdentifier("button", "id", package_name)).setVisibility(View.INVISIBLE);
      }
      layout.findViewById(resources.getIdentifier("TopInfo", "id", package_name)).setVisibility(View.VISIBLE);
      layout.findViewById(resources.getIdentifier("BottomInfo", "id", package_name)).setVisibility(View.VISIBLE);
    }else{
      layout.findViewById(resources.getIdentifier("TopInfo", "id", package_name)).setVisibility(View.VISIBLE);
      layout.findViewById(resources.getIdentifier("button", "id", package_name)).setVisibility(View.INVISIBLE);
      layout.findViewById(resources.getIdentifier("BottomInfo", "id", package_name)).setVisibility(View.INVISIBLE);
    }
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
