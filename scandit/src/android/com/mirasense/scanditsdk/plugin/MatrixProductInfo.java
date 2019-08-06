package com.mirasense.scanditsdk.plugin;

import android.annotation.SuppressLint;
import android.app.ActionBar;
import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.RectF;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import com.galvintec.krack.logistica.dev.R;
import com.mirasense.scanditsdk.plugin.models.Price;
import com.mirasense.scanditsdk.plugin.models.ProductModel;
import com.mirasense.scanditsdk.plugin.models.Size;
import com.scandit.barcodepicker.BarcodePicker;
import com.scandit.barcodepicker.ScanOverlay;
import com.scandit.barcodepicker.ScanSettings;
import com.scandit.matrixscan.MatrixScan;
import com.scandit.recognition.Barcode;
import com.scandit.recognition.SymbologySettings;

import org.apache.cordova.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.io.InputStream;

public class MatrixProductInfo extends Activity {

  public static Activity matrixProductInfo;
  private BarcodePicker mPicker;
  private MatrixSimpleOverlayListener matrixScanListener;
  private FrameLayout pickerContainer;

  private String package_name;
  private Resources resources;

  @SuppressLint("ClickableViewAccessibility")
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

    package_name = getApplication().getPackageName();
    resources = getApplication().getResources();

    ActionBar actionBar = getActionBar();
    actionBar.setDisplayShowCustomEnabled(true);
    actionBar.setBackgroundDrawable(new ColorDrawable(Color.parseColor(backgroundTitle)));
    actionBar.setCustomView(resources.getIdentifier("title_bar_matrixsimple", "layout", package_name));
    ScanditSDK.setActionBar(actionBar);

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

    setContentView(resources.getIdentifier("references_matrix_product_info", "layout", package_name));

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

    settings.setActiveScanningArea(ScanSettings.ORIENTATION_PORTRAIT, new RectF(0.1f, 0.15f, 0.9f, 0.4f));
    settings.setActiveScanningArea(ScanSettings.ORIENTATION_LANDSCAPE, new RectF(0.4f, 0.2f, 0.6f, 0.8f));

    // Instantiate the barcode picker by using the settings defined above.
    mPicker = new BarcodePicker(this, settings);

    matrixScanListener = new MatrixSimpleOverlayListener();
    matrixScanListener.setContextActivity(this);

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

    EditText etReferenceToSearch = findViewById(resources.getIdentifier("etReferenceToSearch", "id", package_name));
    ImageButton btnSearchProduct = findViewById(resources.getIdentifier("btnSearchProduct", "id", package_name));

    //    region Clear button function in editText
    Drawable cancelIcon = resources.getDrawable(android.R.drawable.ic_menu_close_clear_cancel);
    if (cancelIcon != null) {
      cancelIcon.setBounds(0, 0, cancelIcon.getIntrinsicWidth(), cancelIcon.getIntrinsicHeight());
      etReferenceToSearch.setCompoundDrawables(null, null, cancelIcon, null);
    }
    etReferenceToSearch.setOnTouchListener((view, motionEvent) -> {
      final int DRAWABLE_RIGHT = 2;

      if(motionEvent.getAction() == MotionEvent.ACTION_UP) {
        if(motionEvent.getRawX() >= (etReferenceToSearch.getRight() - etReferenceToSearch.getCompoundDrawables()[DRAWABLE_RIGHT].getBounds().width())) {
          etReferenceToSearch.setText("");
          return true;
        }
      }
      return false;
    });
    //    endregion

    // region Search function
    btnSearchProduct.setOnClickListener(view -> searchProduct(etReferenceToSearch, resources, package_name));
    // endregion

    // region Search function with enter on keyboard
    etReferenceToSearch.setOnKeyListener((view, i, keyEvent) -> {
      if (keyEvent.getAction() == KeyEvent.ACTION_DOWN && i == KeyEvent.KEYCODE_ENTER) {
        searchProduct(etReferenceToSearch, resources, package_name);
        return true;
      }
      return false;
    });
    //endregion

    matrixProductInfo = this;
  }

  public void searchProduct(EditText etReferenceToSearch, Resources resources, String package_name) {
    LinearLayout llPBExtendedProductInfo = findViewById(resources.getIdentifier("llPBExtendedProductInfo", "id", package_name));

    hideKeyboard(this);

    if (llPBExtendedProductInfo.getVisibility() == View.GONE) {
      llPBExtendedProductInfo.setVisibility(View.VISIBLE);
    }

    String referenceToSearch = etReferenceToSearch.getText().toString();
    if (!referenceToSearch.isEmpty()) {
      JSONObject jsonObject = new JSONObject();
      try {
        jsonObject.put("result", true);
        JSONObject jsonObjectBarcode = new JSONObject();
        jsonObjectBarcode.put("data", referenceToSearch);
        jsonObject.put("barcode", jsonObjectBarcode);
      } catch (JSONException e) {

      }
      PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
      pResult.setKeepCallback(true);
      ScanditSDK.mCallbackContextMatrixSimple.sendPluginResult(pResult);
    }
  }

  public static void loadProductExtendedInfo(LinearLayout llExtendedProductInfo, ProductModel productModel, Resources resources, String package_name, Context appContext) {
    ImageView ivProductImage = llExtendedProductInfo.findViewById(resources.getIdentifier("ivProductImage", "id", package_name));
    TextView tvModelName = llExtendedProductInfo.findViewById(resources.getIdentifier("tvModelName", "id", package_name));
    TextView tvSeason = llExtendedProductInfo.findViewById(resources.getIdentifier("tvSeason", "id", package_name));
    TextView tvModelReference = llExtendedProductInfo.findViewById(resources.getIdentifier("tvModelReference", "id", package_name));
    TextView tvColor = llExtendedProductInfo.findViewById(resources.getIdentifier("tvColor", "id", package_name));
    TextView tvBrandName = llExtendedProductInfo.findViewById(resources.getIdentifier("tvBrandName", "id", package_name));
    TableLayout tlTableSizesProduct = llExtendedProductInfo.findViewById(resources.getIdentifier("tlTableSizesProduct", "id", package_name));

    if (productModel.getImageUrl() == null || productModel.getImageUrl().isEmpty()) {
      ivProductImage.setVisibility(View.GONE);
    } else {
      ivProductImage.setVisibility(View.VISIBLE);
      new DownloadImageFromInternet(ivProductImage).execute(productModel.getImageUrl());
    }

    if (!productModel.getName().isEmpty()) {
      tvModelName.setText(productModel.getName());
    }
    if (!productModel.getSeason().getName().isEmpty()) {
      tvSeason.setText(productModel.getSeason().getName());
    }
    if (!productModel.getReference().isEmpty()) {
      tvModelReference.setText(productModel.getReference());
    }
    if (!productModel.getColor().getName().isEmpty()) {
      tvColor.setText(productModel.getColor().getName());
    } else {
      tvColor.setText("- sin especificar -");
    }
    if (!productModel.getBrand().getName().isEmpty()) {
      tvBrandName.setText(productModel.getBrand().getName());
    } else {
      tvBrandName.setText("- sin especificar -");
    }

    if (productModel.getSizes().size() > 0) {
      tlTableSizesProduct.removeAllViews();
      int limitForRow = 5;
      int countColumnsAdded = 0;
      int countRows = 0;
      TableRow llTableExtendedProductInfo = (TableRow) View.inflate(appContext, R.layout.table_sizes_extended_product_info, null);
      for (int iSize = 0; iSize < productModel.getSizes().size(); iSize++) {
        Size size = productModel.getSizes().get(iSize);

        if (countColumnsAdded == limitForRow) {
          tlTableSizesProduct.addView(llTableExtendedProductInfo, countRows);
          countRows++;
          countColumnsAdded = 0;
          llTableExtendedProductInfo = (TableRow) View.inflate(appContext, R.layout.table_sizes_extended_product_info, null);
        }

        LinearLayout llColumnExtendedProductInfo = (LinearLayout) View.inflate(appContext, R.layout.column_sizes_extended_product_info, null);
        String priceSize = "0";
        if (size.getPrice() != null) {
          Price price = size.getPrice();
          if (!price.getPriceDiscountOutlet().equals("0") && !price.getPriceDiscountOutlet().equals("0.00")) {
            priceSize = price.getPriceDiscountOutlet();
          } else if (!price.getPriceDiscount().equals("0") && !price.getPriceDiscount().equals("0.00")) {
            priceSize = price.getPriceDiscount();
          } else if (!price.getPriceOriginal().equals("0") && !price.getPriceOriginal().equals("0.00")) {
            priceSize = price.getPriceOriginal();
          }
        }
        ((TextView)llColumnExtendedProductInfo.findViewById(R.id.tvExtendedInfoSize)).setText(size.getName());
        ((TextView)llColumnExtendedProductInfo.findViewById(R.id.tvExtendedInfoStock)).setText(String.valueOf(size.getStock()));
        ((TextView)llColumnExtendedProductInfo.findViewById(R.id.tvExtendedInfoPrice)).setText(priceSize);

        llTableExtendedProductInfo.addView(llColumnExtendedProductInfo);

        countColumnsAdded++;
      }
      if (countColumnsAdded != 0) {
        tlTableSizesProduct.addView(llTableExtendedProductInfo, countRows);
      }
      tlTableSizesProduct.setVisibility(View.VISIBLE);
    }
  }

  public void showProgressBar(boolean show) {
    this.runOnUiThread(() -> {
      LinearLayout llPBExtendedProductInfo = findViewById(resources.getIdentifier("llPBExtendedProductInfo", "id", package_name));

      if (show) {
        llPBExtendedProductInfo.setVisibility(View.VISIBLE);
      } else {
        llPBExtendedProductInfo.setVisibility(View.GONE);
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
    super.onBackPressed();
  }

  public static void hideKeyboard(Activity activity) {
    View view = activity.findViewById(android.R.id.content);
    if (view != null) {
      InputMethodManager imm = (InputMethodManager) activity.getSystemService(Context.INPUT_METHOD_SERVICE);
      imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }
  }

  private static class DownloadImageFromInternet extends AsyncTask<String, Void, Bitmap> {
    ImageView imageView;

    public DownloadImageFromInternet(ImageView imageView) {
      this.imageView = imageView;
    }

    protected Bitmap doInBackground(String... urls) {
      String imageURL = urls[0];
      Bitmap bImage = null;

      try {
        InputStream in = new java.net.URL(imageURL).openStream();
        bImage = BitmapFactory.decodeStream(in);
      } catch (Exception e) {
        e.printStackTrace();
      }
      return bImage;
    }

    protected void onPostExecute(Bitmap result) {
      imageView.setImageBitmap(result);
    }
  }

}
