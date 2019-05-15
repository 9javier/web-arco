package com.mirasense.scanditsdk.plugin;

import android.app.ActionBar;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.drawable.ColorDrawable;
import android.media.projection.MediaProjectionManager;
import android.opengl.GLES20;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Toast;
import android.content.res.Resources;
import android.app.Activity;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.view.LayoutInflater;
import android.widget.Button;
import android.content.Context;
import android.text.Html;

import com.scandit.barcodepicker.BarcodePicker;
import com.scandit.barcodepicker.OnScanListener;
import com.scandit.barcodepicker.ProcessFrameListener;
import com.scandit.barcodepicker.ScanSession;
import com.scandit.barcodepicker.ScanSettings;
import com.scandit.barcodepicker.ScanditLicense;
import com.scandit.recognition.SymbologySettings;
import com.scandit.matrixscan.Frame;
import com.scandit.matrixscan.MatrixScan;
import com.scandit.matrixscan.MatrixScanListener;
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
import com.mirasense.scanditsdk.plugin.models.StockReference;
import com.mirasense.scanditsdk.plugin.utility.ScreenshotHandler;

import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;

import android.widget.LinearLayout;

import android.graphics.RectF;

public class MatrixBubblesActivity extends Activity {

  private BarcodePicker mPicker;
  private MatrixScanOverlayListener matrixScanListener;
  private FrameLayout pickerContainer;
  //  private TextView detail;
  private RelativeLayout detail;
  private String mPackage_name;
  private Resources mResources;
  private String lastedCode;
  ScreenshotHandler screenshotHandler;
  Timer timer;
  private boolean captureScreenshot;
  private double secondsScreenshot;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Bundle b = getIntent().getExtras();
    String company = "";
    String warehouse = "";
    int regularization = 0;
    if(b != null){
      company = b.getString("company");
      warehouse = b.getString("warehouse");
      regularization = b.getInt("regularization");
      this.captureScreenshot = b.getBoolean("captureScreenshot");
      this.secondsScreenshot = b.getDouble("secondsScreenshot");
    }

    if(this.captureScreenshot) {
      requestMediaProjection();
    }

//    this.requestWindowFeature(Window.FEATURE_NO_TITLE);
//    setTitle("My new title");

    String package_name = getApplication().getPackageName();
    Resources resources = getApplication().getResources();
    mPackage_name = package_name;
    mResources = resources;


    ActionBar actionBar = getActionBar();
    actionBar.hide();

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
      WindowManager.LayoutParams.FLAG_FULLSCREEN);

    setContentView(resources.getIdentifier("references_extended_data", "layout", package_name));

    ScanditSDK.setViewProductData(this.findViewById(android.R.id.content).getRootView());
    LinearLayout llProductData = (LinearLayout) findViewById(resources.getIdentifier("llProductData", "id", package_name));
    ImageButton btnProduct = (ImageButton) findViewById(resources.getIdentifier("btnProduct", "id", package_name));
    if (llProductData != null) {
      llProductData.setVisibility(View.GONE);

      llProductData.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View view) {
          String reference = ((TextView)view.findViewById(resources.getIdentifier("tvReference", "id", package_name))).getText().toString();

          JSONObject jsonObject = new JSONObject();
          try {
            jsonObject.put("result", true);
            jsonObject.put("action", "open_stocks_product");
            jsonObject.put("reference", reference);
          } catch (JSONException e) {

          }

          PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
          pResult.setKeepCallback(false);
          ScanditSDK.mCallbackContextMatrixBubble.sendPluginResult(pResult);
          finish();
        }
      });

      btnProduct.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View view) {
          String reference = ((TextView)llProductData.findViewById(resources.getIdentifier("tvReference", "id", package_name))).getText().toString();

          JSONObject jsonObject = new JSONObject();
          try {
            jsonObject.put("result", true);
            jsonObject.put("action", "open_product");
            jsonObject.put("reference", reference);
          } catch (JSONException e) {

          }

          PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
          pResult.setKeepCallback(false);
          ScanditSDK.mCallbackContextMatrixBubble.sendPluginResult(pResult);
          finish();
        }
      });
    }

    ScanSettings settings = ScanSettings.create();
//    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_UNKNOWN, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_EAN13, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_EAN8, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_UPCA, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_UPCE, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE128, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE11, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE25, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE32, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE39, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE93, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_INTERLEAVED_2_OF_5, true);
//    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_QR, true);
//    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_MICRO_QR, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_DATA_MATRIX, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_PDF417, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_MICRO_PDF417, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_MICRO_PDF417, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_MSI_PLESSEY, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_GS1_DATABAR, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_GS1_DATABAR_EXPANDED, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_GS1_DATABAR_LIMITED, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODABAR, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_AZTEC, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_MAXICODE, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_TWO_DIGIT_ADD_ON, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_FIVE_DIGIT_ADD_ON, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_KIX, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_RM4SCC, true);
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_DOTCODE, true);

    SymbologySettings symSettings128 = settings.getSymbologySettings(Barcode.SYMBOLOGY_CODE128);
    short[] activeSymbolCounts = new short[] {
      7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23
    };
    symSettings128.setActiveSymbolCounts(activeSymbolCounts);

    settings.setMatrixScanEnabled(true);
    settings.setMaxNumberOfCodesPerFrame(10);
    settings.setCodeRejectionEnabled(true);

    settings.setActiveScanningArea(ScanSettings.ORIENTATION_PORTRAIT, new RectF(0.0f,  0.0f, 1.0f, 0.75f));
    settings.setActiveScanningArea(ScanSettings.ORIENTATION_LANDSCAPE, new RectF(0.0f, 0.0f, 1.0f, 0.75f));

    // Instantiate the barcode picker by using the settings defined above.
    mPicker = new BarcodePicker(this, settings);

    matrixScanListener = new MatrixScanOverlayListener(this, new ClickCallback() {
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

    Button buttonRegularize = (Button) findViewById(resources.getIdentifier("regularize_button", "id", package_name));
    if(regularization == 1){
      buttonRegularize.setVisibility(View.VISIBLE);
    } else {
      buttonRegularize.setVisibility(View.GONE);
    }

    final String fPackage = package_name;
    final Resources fResources = resources;

    buttonRegularize.setOnClickListener( new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        View parent = (View)v.getParent();
        if (parent != null) {
          String code = ((TextView) parent.findViewById(fResources.getIdentifier("detail_code_value", "id", fPackage))).getText().toString();

          JSONObject jsonObject = new JSONObject();
          try {
            jsonObject.put("result", true);
            jsonObject.put("action", "regularize");
            jsonObject.put("code", code);
          } catch (JSONException e) {

          }

          PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
          pResult.setKeepCallback(false);
          ScanditSDK.mCallbackContextMatrixBubble.sendPluginResult(pResult);
          finish();
        }

      }

    });

  }


  @Override
  public void onPointerCaptureChanged(boolean hasCapture) {

  }

  @Override
  protected void onResume() {
    mPicker.startScanning();
    super.onResume();
    if(this.captureScreenshot){
      taskCaptureScreenShot();
    }

  }

  @Override
  protected void onPause() {
    mPicker.stopScanning();
    super.onPause();
    if(this.captureScreenshot) {
      if (timer != null) {
        timer.cancel();
        timer = null;
      }
    }
  }

  @Override
  protected void onStop() {
    super.onStop();
    if(this.captureScreenshot) {
      if (timer != null) {
        timer.cancel();
        timer = null;
      }
    }
  }
  @Override
  protected void onDestroy() {
    super.onDestroy();
    if(this.captureScreenshot) {
      if (timer != null) {
        timer.cancel();
        timer = null;
      }
    }
  }

  @Override
  public void onBackPressed() {
    super.onBackPressed();
  }



  private void bubbleClick(TrackedBarcode barcode) {

    String reference = ScanditSDK.bubbles.get(barcode.getData()).getBubbleData().getReference();

    JSONObject jsonObject = new JSONObject();
    try {
      jsonObject.put("result", true);
      jsonObject.put("action", "open_product");
      jsonObject.put("reference", reference);
    } catch (JSONException e) {

    }

    PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
    pResult.setKeepCallback(false);
    ScanditSDK.mCallbackContextMatrixBubble.sendPluginResult(pResult);
    finish();
  }

  private void closeDetail() {
    detail.setVisibility(View.INVISIBLE);
  }

  private void cleanTable(TableLayout table) {
    int childCount = table.getChildCount();
    // Remove all rows except the first one
    if (childCount > 2) {
      table.removeViews(2, childCount - 2);
    }
  }

  private Bitmap getRenderBufferBitmap() {
    int renderBufferWidth = 1280;
    int renderBufferHeight = 720;
    ByteBuffer buffer = ByteBuffer.allocateDirect(renderBufferWidth * renderBufferHeight * 4);
    GLES20.glReadPixels(0, 0, renderBufferWidth, renderBufferHeight, GLES20.GL_RGBA, GLES20.GL_UNSIGNED_BYTE, buffer);
    Bitmap bitmap = Bitmap.createBitmap(renderBufferWidth, renderBufferHeight, Bitmap.Config.ARGB_8888);
    bitmap.copyPixelsFromBuffer(buffer);
    return bitmap;
  }

  private void SaveImage(Bitmap finalBitmap) {

    String root = Environment.getExternalStorageDirectory().toString();
    File myDir = new File(root + "/saved_images");
    if (!myDir.exists()) {
      myDir.mkdirs();
    }
    Random generator = new Random();
    int n = 10000;
    n = generator.nextInt(n);
    String fname = "Image-"+ n +".jpg";
    File file = new File (myDir, fname);
    if (file.exists ())
      file.delete ();
    try {
      FileOutputStream out = new FileOutputStream(file);
      finalBitmap.compress(Bitmap.CompressFormat.JPEG, 90, out);
      out.flush();
      out.close();

    } catch (Exception e) {
      e.printStackTrace();
    }
  }


  private void requestMediaProjection() {
    if (ScreenshotHandler.isInitialized()) {
      Log.d("SCREENSHOT", "Has media projection");
//            startService();
    } else {
      Log.d("SCREENSHOT", "Requesting for media projection");
      try {
//            throw new RuntimeException("Unable to start activity ComponentInfo{tw.firemaples.onscreenocr/tw.firemaples.onscreenocr.MainActivity}: android.content.ActivityNotFoundException: Unable to find explicit activity class {com.android.systemui/com.android.systemui.media.MediaProjectionPermissionActivity}; have you declared this activity in your AndroidManifest.xml?");
        MediaProjectionManager projectionManager = (MediaProjectionManager) getSystemService(Context.MEDIA_PROJECTION_SERVICE);
        startActivityForResult(projectionManager.createScreenCaptureIntent(), 99);
      } catch (NoClassDefFoundError e) {
        String errorMsg = "[MediaProjection] not found";
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
          Log.d("SCREENSHOT", "error_mediaProjectionNotFound_need5UpperVersion");
        } else {
          errorMsg += " with unknown situation";
        }
//                showErrorDialog(errorMsg, null);
      } catch (Throwable t) {
        Log.d("SCREENSHOT", "error_mediaProjectionNotFound_need5UpperVersion"+ " \r\n\r\n" + t.getLocalizedMessage());
//                showErrorDialog(errorMsg, null);
      }
    }
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (requestCode == 99) {
      onRequestMediaProjectionResult(resultCode, data);
    }
  }

  private void onRequestMediaProjectionResult(int resultCode, Intent data) {
    if (resultCode == RESULT_OK) {
      Log.d("SCREENSHOT", "Got media projection");
      screenshotHandler = ScreenshotHandler.init(this);
      screenshotHandler.setMediaProjectionIntent(data);
//      screenshotHandler.takeScreenshot();

    } else {
      Log.d("SCREENSHOT", "Not get media projection");
//            showErrorDialog(getString(R.string.dialog_content_needPermission_mediaProjection), new Callback<Void>() {
//                @Override
//                public boolean onCallback(Void result) {
//                    Tool.logInfo("Retry to get media projection");
//                    requestMediaProjection();
//                    return false;
//                }
//            });
    }
  }

  private void taskCaptureScreenShot() {
    Log.d("SCREENSHOT", "taskCaptureScreenShot");
    if (ScreenshotHandler.isInitialized()) {
      timer = new Timer();
      int milliseconds = (int) (this.secondsScreenshot * 1000);

      LinearLayout llProductData = null;
      if (ScanditSDK.viewProductData != null) {
        llProductData = ScanditSDK.viewProductData.findViewById(mResources.getIdentifier("llProductData", "id", mPackage_name));
      }

      final LinearLayout fllProductData = llProductData;

      timer.scheduleAtFixedRate(new TimerTask() {

                                  @Override
                                  public void run() {
                                    Log.d("SCREENSHOT", "Task capture");
                                    screenshotHandler.takeScreenshot(ScanditSDK.mCallbackContextMatrixBubble, fllProductData);
                                  }
                                },
        0, milliseconds);
    }
  }


}
