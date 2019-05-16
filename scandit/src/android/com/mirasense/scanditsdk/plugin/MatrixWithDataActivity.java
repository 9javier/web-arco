package com.mirasense.scanditsdk.plugin;

import android.os.Bundle;
import android.util.Log;
import android.content.res.Resources;
import android.app.Activity;

import com.scandit.barcodepicker.BarcodePicker;
import com.scandit.barcodepicker.ScanSettings;
import com.scandit.matrixscan.MatrixScan;
import com.scandit.matrixscan.SimpleMatrixScanOverlay;
import com.scandit.matrixscan.ViewBasedMatrixScanOverlay;
import com.scandit.recognition.Barcode;
import com.scandit.recognition.TrackedBarcode;
import com.scandit.barcodepicker.ScanOverlay;
import android.view.Window;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.view.View;
import android.widget.RelativeLayout;

public class MatrixWithDataActivity extends Activity {

  private BarcodePicker mPicker;
  private MatrixScanWithDataOverlayListener matrixScanListener;
  private FrameLayout pickerContainer;
//  private TextView detail;
  private RelativeLayout detail;
  private String mPackage_name;
  private Resources mResources;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    this.requestWindowFeature(Window.FEATURE_NO_TITLE);
    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
      WindowManager.LayoutParams.FLAG_FULLSCREEN);

    String package_name = getApplication().getPackageName();
    Resources resources = getApplication().getResources();
    mPackage_name = package_name;
    mResources = resources;

    setContentView(resources.getIdentifier("matrix_data", "layout", package_name));

    ScanSettings settings = ScanSettings.create();
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_EAN13, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_UPCA, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_EAN8, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_UPCA, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE39, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_INTERLEAVED_2_OF_5, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE128, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_UPCE, true);

    settings.setMatrixScanEnabled(true);
    settings.setMaxNumberOfCodesPerFrame(10);
    settings.setCodeRejectionEnabled(true);

    // Instantiate the barcode picker by using the settings defined above.
    mPicker = new BarcodePicker(this, settings);

    matrixScanListener = new MatrixScanWithDataOverlayListener(this, new ClickCallback() {
      @Override
      public void run(TrackedBarcode barcode) {
        Log.d("TEST::Click", barcode.getData());
        bubbleClick(barcode);
      }
    }, mPicker, package_name, resources);

    MatrixScan matrixScan = new MatrixScan(mPicker, matrixScanListener);
    ViewBasedMatrixScanOverlay viewBasedOverlay =
      new ViewBasedMatrixScanOverlay(this, matrixScan, matrixScanListener);
    matrixScan.addOverlay(new SimpleMatrixScanOverlay(this, matrixScan, matrixScanListener));
    matrixScan.addOverlay(viewBasedOverlay);

    // You can enable beeping via:
    matrixScan.setBeepOnNewCode(true);

    matrixScanListener.setViewBasedMatrixScanOverlay(viewBasedOverlay);

    mPicker.getOverlayView().setGuiStyle(ScanOverlay.GUI_STYLE_NONE);
    mPicker.getOverlayView().setTorchEnabled(false);
    mPicker.getOverlayView().setViewfinderDimension(0.9f, 0.75f, 0.95f, 0.9f);

    pickerContainer = findViewById(resources.getIdentifier("picker", "id", package_name));
    pickerContainer.addView(mPicker);

    detail = findViewById(resources.getIdentifier("detail", "id", package_name));
    detail.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        closeDetail();
      }
    });

//    setContentView(mPicker);

  }


  @Override
  public void onPointerCaptureChanged(boolean hasCapture) {

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


  private void bubbleClick(TrackedBarcode barcode) {
//    detail.setText(barcode.getData());

    if(ScanditSDK.products.get(barcode.getData()) != null) {
      Product p = ScanditSDK.products.get(barcode.getData());
      ((TextView) findViewById(mResources.getIdentifier("detail_code_value", "id", mPackage_name))).setText(p.getCode());
      ((TextView) findViewById(mResources.getIdentifier("detail_stock_value", "id", mPackage_name))).setText("Stock: " + p.getStock());
      ((TextView) findViewById(mResources.getIdentifier("detail_price_value", "id", mPackage_name))).setText("Precio: " + p.getPrice());
      ((TextView) findViewById(mResources.getIdentifier("detail_sold_value", "id", mPackage_name))).setText("Uds. vendidas: " + p.getSoldUnits());
      detail.setVisibility(View.VISIBLE);
    }

  }

  private void closeDetail() {
    detail.setVisibility(View.INVISIBLE);
  }


}
