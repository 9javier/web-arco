package com.mirasense.scanditsdk.plugin;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.RectF;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.support.v7.widget.helper.ItemTouchHelper;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.mirasense.scanditsdk.plugin.adapters.PageAdapterFull;
import com.mirasense.scanditsdk.plugin.adapters.PageAdapterSmall;
import com.mirasense.scanditsdk.plugin.adapters.SearchItemsAdapter;
import com.mirasense.scanditsdk.plugin.adapters.SortItemsAdapter;
import com.mirasense.scanditsdk.plugin.fragments.PendingProductsPickingStores;
import com.mirasense.scanditsdk.plugin.fragments.PendingProductsPickingStoresFull;
import com.mirasense.scanditsdk.plugin.fragments.ProcessedProductsPickingStores;
import com.mirasense.scanditsdk.plugin.fragments.ProcessedProductsPickingStoresFull;
import com.mirasense.scanditsdk.plugin.models.FiltersPickingStores;
import com.mirasense.scanditsdk.plugin.models.KeyPairBoolData;
import com.mirasense.scanditsdk.plugin.models.LineRequestsProduct;
import com.mirasense.scanditsdk.plugin.models.PickingStoreRejectionReason;
import com.mirasense.scanditsdk.plugin.models.SingleFilterPickingStores;
import com.mirasense.scanditsdk.plugin.utility.DragItemTouchHelper;
import com.scandit.barcodepicker.BarcodePicker;
import com.scandit.barcodepicker.ScanOverlay;
import com.scandit.barcodepicker.ScanSettings;
import com.scandit.matrixscan.MatrixScan;
import com.scandit.recognition.Barcode;
import com.scandit.recognition.SymbologySettings;

import org.apache.cordova.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class MatrixPickingStores extends AppCompatActivity implements ProcessedProductsPickingStores.OnFragmentInteractionListener, PendingProductsPickingStores.OnFragmentInteractionListener, PendingProductsPickingStoresFull.OnFragmentInteractionListener, ProcessedProductsPickingStoresFull.OnFragmentInteractionListener {

  public static Activity matrixPickingStores;
  private BarcodePicker mPicker;
  private MatrixSimpleOverlayListener matrixScanListener;
  private FrameLayout pickerContainer;

  private SearchItemsAdapter searchItemsAdapter;
  private SortItemsAdapter sortItemsAdapter;
  private ItemTouchHelper mItemTouchHelper;
  private static FiltersPickingStores filtersPickingStores;

  private static ArrayList<KeyPairBoolData> filtersSortTypes;
  private static ArrayList<KeyPairBoolData> filtersModels;
  private static ArrayList<KeyPairBoolData> filtersBrands;
  private static ArrayList<KeyPairBoolData> filtersSizes;
  private static ArrayList<KeyPairBoolData> filtersColors;
  private static ArrayList<KeyPairBoolData> filtersTypes;

  private final int FILTER_SORT_TYPE = 1;
  private final int FILTER_MODEL = 2;
  private final int FILTER_BRAND = 3;
  private final int FILTER_SIZE = 4;
  private final int FILTER_COLOR = 5;
  private final int FILTER_TYPE = 6;

  private static final int SORT_TYPE_NONE = 1;
  private static final int SORT_TYPE_ASC = 2;
  private static final int SORT_TYPE_DESC = 3;

  private static PageAdapterSmall pageAdapterSmall;
  private static PageAdapterFull pageAdapterFull;

  private boolean hasLoadedFullList = false;
  private static Activity activityForLoadFull = null;
  private static Resources resourcesForLoadFull = null;
  private static String packageNameForLoadFull = null;
  private static ArrayList<JSONObject> productsPendingForLoadFull = null;
  private static ArrayList<JSONObject> productsProcessedForLoadFull = null;
  private static ArrayList<PickingStoreRejectionReason> listRejectionReasons = null;
  private static ArrayList<String> listNamesRejectionReasons = null;

  private static ViewGroup viewGroup;

  private boolean packing = false;
  private static String urlBase = "";
  private static Dialog dialogInfoForProduct = null;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Bundle b = getIntent().getExtras();
    String title = "AL Krack";
    String backgroundTitle = "#FFFFFF";
    String colorTitle = "#424242";
    String textInit = "";
    if (b != null) {
      title = b.getString("title", "AL Krack");
      backgroundTitle = b.getString("backgroundTitle", "#FFFFFF");
      colorTitle = b.getString("colorTitle", "#424242");
      textInit = b.getString("textInit", "");
      urlBase = b.getString("urlBase", "");
    }

    if(textInit.equals("Escanee los embalajes a usar")){
      packing = true;
    }

    String package_name = getApplication().getPackageName();
    Resources resources = getApplication().getResources();

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
      WindowManager.LayoutParams.FLAG_FULLSCREEN);

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
      WindowManager.LayoutParams.FLAG_FULLSCREEN);

    setContentView(resources.getIdentifier("references_matrix_picking_stores", "layout", package_name));

    viewGroup = findViewById(android.R.id.content);

    initializeToolbar(resources, package_name, title, colorTitle, backgroundTitle);

    TextView tvPackingStart = this.findViewById(android.R.id.content).getRootView().findViewById(resources.getIdentifier("tvPackingStart", "id", package_name));
    tvPackingStart.setText(textInit);
    tvPackingStart.setVisibility(View.VISIBLE);

    ScanditSDK.setViewDataMatrixSimple(this.findViewById(android.R.id.content).getRootView());

    if(this.packing){
      TabLayout tabLayout = findViewById(resources.getIdentifier("tlProductsLists", "id", package_name));
      TabLayout.Tab tab = tabLayout.getTabAt(0);
      if(tab != null) tab.setText("Embalajes");
    }

    initializeScanditPicker(resources, package_name);
    initializeListManagement(resources, package_name);
    initializeTabLayouts(resources, package_name);
    initializeBottomButtons(resources, package_name);
    initializeFilters(resources, package_name);

    matrixPickingStores = this;
    ScanditSDK.setActivityStarted(matrixPickingStores);
  }

  /*
   * Get Toolbar created in view files and set as ActionBar for this Activity
   * Add to Toolbar title sent from Ionic app
   * Initialize finish action to click back button
  */
  private void initializeToolbar(Resources resources, String package_name, String title, String titleColor, String backgroundColor) {
    Toolbar toolbarPickingStores = findViewById(resources.getIdentifier("toolbarPickingStores", "id", package_name));
    setSupportActionBar(toolbarPickingStores);

    ActionBar actionBar = getSupportActionBar();
    actionBar.setDisplayShowCustomEnabled(true);
    actionBar.setBackgroundDrawable(new ColorDrawable(Color.parseColor(backgroundColor)));

    ((TextView) findViewById(resources.getIdentifier("action_bar_title", "id", package_name))).setText(title);
    ((TextView) findViewById(resources.getIdentifier("action_bar_title", "id", package_name))).setTextColor(Color.parseColor(titleColor));

    ImageButton arrowBack = findViewById(resources.getIdentifier("arrow_back_button", "id", package_name));
    arrowBack.setOnClickListener(v -> finish());
  }

  /*
   * Initialize Scandit Picker element enabling specific symbology and more options
   */
  private void initializeScanditPicker(Resources resources, String package_name) {
    ScanSettings settings = ScanSettings.create();

    // Enable 128 Code type with specific count of digits
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE128, true);
    SymbologySettings symSettings128 = settings.getSymbologySettings(Barcode.SYMBOLOGY_CODE128);
    short[] activeSymbolCounts128 = new short[]{ 7, 8, 9, 12, 14, 15, 16, 17, 18 };
    symSettings128.setActiveSymbolCounts(activeSymbolCounts128);

    // Enable 39 Code type with specific count of digits
    settings.setSymbologyEnabled(Barcode.SYMBOLOGY_CODE39, true);
    SymbologySettings symSettings39 = settings.getSymbologySettings(Barcode.SYMBOLOGY_CODE39);
    short[] activeSymbolCounts39 = new short[]{ 8 };
    symSettings39.setActiveSymbolCounts(activeSymbolCounts39);

    settings.setMatrixScanEnabled(true);
    settings.setMaxNumberOfCodesPerFrame(1);
    settings.setCodeRejectionEnabled(true);

    // Limit area to make work the scanner
    settings.setActiveScanningArea(ScanSettings.ORIENTATION_PORTRAIT, new RectF(0, 0, 1, 0.3f));
    settings.setActiveScanningArea(ScanSettings.ORIENTATION_LANDSCAPE, new RectF(0, 0, 1, 0.3f));

    // Instantiate the barcode picker by using the settings defined above.
    mPicker = new BarcodePicker(this, settings);

    matrixScanListener = new MatrixSimpleOverlayListener();

    // Enable beep to sound with each new code scanned
    MatrixScan matrixScan = new MatrixScan(mPicker, matrixScanListener);
    matrixScan.setBeepOnNewCode(true);

    mPicker.getOverlayView().setTorchEnabled(false);
    mPicker.getOverlayView().setBeepEnabled(true);
    mPicker.getOverlayView().setViewfinderDimension(0.9f, 0.75f, 0.95f, 0.9f);
    mPicker.getOverlayView().setGuiStyle(ScanOverlay.GUI_STYLE_MATRIX_SCAN);

    // Initialize picker in FrameLayout created for it
    pickerContainer = findViewById(resources.getIdentifier("picker", "id", package_name));
    pickerContainer.addView(mPicker);

    mPicker.startScanning();
  }

  /*
   * Create actions to open and close a full-screen view with list of products pending and processed
   * doing a simple click over the title of the view
   */
  private void initializeListManagement(Resources resources, String package_name) {
    RelativeLayout rlTitleSmallProductsList = findViewById(resources.getIdentifier("rlTitleSmallProductsList", "id", package_name));
    rlTitleSmallProductsList.setOnClickListener(v -> {
      LinearLayout llListProductsSmall = findViewById(resources.getIdentifier("llListProductsSmall", "id", package_name));
      llListProductsSmall.setVisibility(View.GONE);
      LinearLayout llListProductsFull = findViewById(resources.getIdentifier("llListProductsFull", "id", package_name));
      llListProductsFull.setVisibility(View.VISIBLE);

      if (!hasLoadedFullList) {
        new android.os.Handler().postDelayed(() -> {
          loadProductsPendingFull(activityForLoadFull, resourcesForLoadFull, packageNameForLoadFull, productsPendingForLoadFull);
          loadProductsProcessedFull(activityForLoadFull, resourcesForLoadFull, packageNameForLoadFull, productsProcessedForLoadFull);
          hasLoadedFullList = true;
        }, 1 * 1000);
      }
    });

    RelativeLayout rlTitleFullProductsList = findViewById(resources.getIdentifier("rlTitleFullProductsList", "id", package_name));
    rlTitleFullProductsList.setOnClickListener(v -> {
      LinearLayout llListProductsSmall = findViewById(resources.getIdentifier("llListProductsSmall", "id", package_name));
      llListProductsSmall.setVisibility(View.VISIBLE);
      LinearLayout llListProductsFull = findViewById(resources.getIdentifier("llListProductsFull", "id", package_name));
      llListProductsFull.setVisibility(View.GONE);
    });
  }

  private void initializeTabLayouts(Resources resources, String package_name) {
    pageAdapterSmall = new PageAdapterSmall(getSupportFragmentManager(), 2);
    pageAdapterFull = new PageAdapterFull(getSupportFragmentManager(), 2);

    // region Small list of products
    LinearLayout llTabsSmall = findViewById(resources.getIdentifier("tabsSmall", "id", package_name));
    ViewPager vpTabsSmall = llTabsSmall.findViewById(resources.getIdentifier("vpTabsProductsLists", "id", package_name));
    vpTabsSmall.setAdapter(pageAdapterSmall);
    TabLayout tlProductsListsSmall = llTabsSmall.findViewById(resources.getIdentifier("tlProductsLists", "id", package_name));
    tlProductsListsSmall.setOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
      @Override
      public void onTabSelected(TabLayout.Tab tab) {
        vpTabsSmall.setCurrentItem(tab.getPosition());
      }
      @Override
      public void onTabUnselected(TabLayout.Tab tab) {

      }
      @Override
      public void onTabReselected(TabLayout.Tab tab) {

      }
    });
    vpTabsSmall.addOnPageChangeListener(new TabLayout.TabLayoutOnPageChangeListener(tlProductsListsSmall));
    // endregion

    // region Large list of products
    LinearLayout llTabsFull = findViewById(resources.getIdentifier("tabsFull", "id", package_name));
    ViewPager vpTabsFull = llTabsFull.findViewById(resources.getIdentifier("vpTabsProductsListsFull", "id", package_name));
    vpTabsFull.setAdapter(pageAdapterFull);
    TabLayout tlProductsListsFull = llTabsFull.findViewById(resources.getIdentifier("tlProductsListsFull", "id", package_name));
    tlProductsListsFull.setOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
      @Override
      public void onTabSelected(TabLayout.Tab tab) {
        vpTabsFull.setCurrentItem(tab.getPosition());
      }
      @Override
      public void onTabUnselected(TabLayout.Tab tab) {

      }
      @Override
      public void onTabReselected(TabLayout.Tab tab) {

      }
    });
    vpTabsFull.addOnPageChangeListener(new TabLayout.TabLayoutOnPageChangeListener(tlProductsListsFull));
    // endregion
  }

  private void initializeBottomButtons(Resources resources, String package_name) {
    Button btnFinish = findViewById(resources.getIdentifier("btnFinish", "id", package_name));

    if(packing) {
      btnFinish.setText("Precintar");
    }

    btnFinish.setOnClickListener(v -> {
      JSONObject jsonObject = new JSONObject();
      try {
        jsonObject.put("result", true);
        jsonObject.put("action", "matrix_simple_finish");
      } catch (JSONException ignored) {}
      PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
      pResult.setKeepCallback(true);
      ScanditSDK.mCallbackContextMatrixSimple.sendPluginResult(pResult);
    });

  }

  private void initializeFilters(Resources resources, String package_name) {
    TextView tvSortBy = findViewById(resources.getIdentifier("tvSortBy", "id", package_name));
    TextView tvFilterModel = findViewById(resources.getIdentifier("tvFilterModel", "id", package_name));
    TextView tvFilterBrand = findViewById(resources.getIdentifier("tvFilterBrand", "id", package_name));
    TextView tvFilterSize = findViewById(resources.getIdentifier("tvFilterSize", "id", package_name));
    TextView tvFilterColor = findViewById(resources.getIdentifier("tvFilterColor", "id", package_name));

    if(true){
      LinearLayout filterTypeLayout = findViewById(resources.getIdentifier("filterTypeLayout", "id", package_name));
      filterTypeLayout.setVisibility(View.VISIBLE);
      TextView tvFilterType = findViewById(resources.getIdentifier("tvFilterType", "id", package_name));
      tvFilterType.setOnClickListener(view -> this.openSearchItemsSpinner(resources, package_name, tvFilterType, filtersTypes, FILTER_TYPE, "Tipos"));
    }

    tvSortBy.setOnClickListener(view -> {
      this.openSortItemsSpinner(resources, package_name, tvSortBy, filtersSortTypes, FILTER_SORT_TYPE, "Ordenar por");
    });
    tvFilterModel.setOnClickListener(view -> {
      this.openSearchItemsSpinner(resources, package_name, tvFilterModel, filtersModels, FILTER_MODEL, "Referencias");
    });
    tvFilterBrand.setOnClickListener(view -> {
      this.openSearchItemsSpinner(resources, package_name, tvFilterBrand, filtersBrands, FILTER_BRAND, "Marcas");
    });
    tvFilterSize.setOnClickListener(view -> {
      this.openSearchItemsSpinner(resources, package_name, tvFilterSize, filtersSizes, FILTER_SIZE, "Tallas");
    });
    tvFilterColor.setOnClickListener(view -> {
      this.openSearchItemsSpinner(resources, package_name, tvFilterColor, filtersColors, FILTER_COLOR, "Colores");
    });
  }

  private void openSearchItemsSpinner(Resources resources, String package_name, TextView tvSelected, final ArrayList<KeyPairBoolData> listItems, int filterType, String titleAlert) {
    if (filtersPickingStores != null) {
      ViewGroup viewGroup = findViewById(android.R.id.content);
      View customView = LayoutInflater.from(this).inflate(resources.getIdentifier("spinner_search", "layout", package_name), viewGroup, false);

      final ArrayList<KeyPairBoolData> originListItemsForCancel = new ArrayList<>();
      for (KeyPairBoolData keyPair : listItems) {
        originListItemsForCancel.add(new KeyPairBoolData(keyPair));
      }

      AlertDialog.Builder builder = new AlertDialog.Builder(this, resources.getIdentifier("DarkAlert", "style", package_name));
      builder.setTitle(titleAlert);
      builder.setPositiveButton("Aceptar", (dialogInterface, i) -> {
        if (searchItemsAdapter.getSelectedItems().size() > 0) {
          ArrayList<String> listValuesToShow = new ArrayList<>();
          for (KeyPairBoolData value: searchItemsAdapter.getSelectedItems()) {
            String fieldToJoin = ((SingleFilterPickingStores)value.getObject()).getName();
            if (filterType == FILTER_MODEL) {
              fieldToJoin = ((SingleFilterPickingStores)value.getObject()).getReference();
            }
            listValuesToShow.add(fieldToJoin);
          }
          String valuesSelected = "";
          if (searchItemsAdapter.getSelectedItems().size() > 1) {
            valuesSelected = "("+searchItemsAdapter.getSelectedItems().size()+") ";
          }
          valuesSelected = valuesSelected.concat(TextUtils.join(", ", listValuesToShow));
          tvSelected.setText(valuesSelected);
        } else {
          String defaultMessageFilter = "";
          switch (filterType) {
            case FILTER_MODEL:
              defaultMessageFilter = "Filtro referencia";
              break;
            case FILTER_BRAND:
              defaultMessageFilter = "Filtro marca";
              break;
            case FILTER_SIZE:
              defaultMessageFilter = "Filtro talla";
              break;
            case FILTER_COLOR:
              defaultMessageFilter = "Filtro color";
              break;
            case FILTER_TYPE:
              defaultMessageFilter = "Filtro tipo";
              break;
          }
          tvSelected.setText(defaultMessageFilter);
        }

        switch (filterType) {
          case FILTER_MODEL:
            filtersModels = searchItemsAdapter.getAllItems();
            break;
          case FILTER_BRAND:
            filtersBrands = searchItemsAdapter.getAllItems();
            break;
          case FILTER_SIZE:
            filtersSizes = searchItemsAdapter.getAllItems();
            break;
          case FILTER_COLOR:
            filtersColors = searchItemsAdapter.getAllItems();
            break;
          case FILTER_TYPE:
            filtersTypes = searchItemsAdapter.getAllItems();
            break;
        }
        responseFiltersToIonic();
      });
      builder.setNegativeButton("Cancelar", (dialogInterface, i) -> {
        switch (filterType) {
          case FILTER_MODEL:
            filtersModels = originListItemsForCancel;
            break;
          case FILTER_BRAND:
            filtersBrands = originListItemsForCancel;
            break;
          case FILTER_SIZE:
            filtersSizes = originListItemsForCancel;
            break;
          case FILTER_COLOR:
            filtersColors = originListItemsForCancel;
            break;
          case FILTER_TYPE:
            filtersTypes = originListItemsForCancel;
            break;
        }
      });
      builder.setView(customView).create().show();

      if (listItems.size() > 0) {
        searchItemsAdapter = new SearchItemsAdapter(this, listItems, resources, package_name, resources.getIdentifier("item_spinner_search", "layout", package_name));

        RecyclerView rvItemsToFilter = customView.findViewById(resources.getIdentifier("rvItemsToFilter", "id", package_name));
        LinearLayoutManager llm = new LinearLayoutManager(this);
        rvItemsToFilter.setLayoutManager(llm);
        rvItemsToFilter.setAdapter(searchItemsAdapter);

        EditText etFilterSearch = customView.findViewById(resources.getIdentifier("etFilterSearch", "id", package_name));
        etFilterSearch.addTextChangedListener(new TextWatcher() {
          @Override
          public void onTextChanged(CharSequence s, int start, int before, int count) {
            searchItemsAdapter.getFilter().filter(s.toString());
          }

          @Override
          public void beforeTextChanged(CharSequence s, int start, int count, int after) {
          }

          @Override
          public void afterTextChanged(Editable s) {
          }
        });
      } else {
        Log.i("Test::", "No filters for brand");
      }
    }
  }

  private void openSortItemsSpinner(Resources resources, String package_name, TextView tvSelected, final ArrayList<KeyPairBoolData> listItems, int filterType, String titleAlert) {
    if (filtersPickingStores != null) {
      ViewGroup viewGroup = findViewById(android.R.id.content);
      View customView = LayoutInflater.from(this).inflate(resources.getIdentifier("spinner_sort", "layout", package_name), viewGroup, false);

      final ArrayList<KeyPairBoolData> originListItemsForCancel = new ArrayList<>();
      for (KeyPairBoolData keyPair : listItems) {
        originListItemsForCancel.add(new KeyPairBoolData(keyPair));
      }

      AlertDialog.Builder builder = new AlertDialog.Builder(this, resources.getIdentifier("DarkAlert", "style", package_name));
      builder.setTitle(titleAlert);
      builder.setPositiveButton("Aceptar", (dialogInterface, i) -> {
        if (sortItemsAdapter.getSelectedItems().size() > 0) {
          ArrayList<String> listValuesToShow = new ArrayList<>();
          for (KeyPairBoolData value: sortItemsAdapter.getSelectedItems()) {
            SingleFilterPickingStores singleFilterPickingStores = ((SingleFilterPickingStores)value.getObject());
            String typeSortText = "ASC";
            if (value.getTypeSort() == SORT_TYPE_DESC) {
              typeSortText = "DESC";
            }
            listValuesToShow.add(singleFilterPickingStores.getName() + " " + typeSortText);
          }
          String valuesSelected = "";
          if (sortItemsAdapter.getSelectedItems().size() > 1) {
            valuesSelected = "("+sortItemsAdapter.getSelectedItems().size()+") ";
          }
          valuesSelected = valuesSelected.concat(TextUtils.join(", ", listValuesToShow));
          tvSelected.setText(valuesSelected);
        } else {
          tvSelected.setText("Ordenar por");
        }

        if (filterType == FILTER_SORT_TYPE) {
          filtersSortTypes = sortItemsAdapter.getAllItems();
        }

        responseFiltersToIonic();
      });
      builder.setNegativeButton("Cancelar", (dialogInterface, i) -> {
        if (filterType == FILTER_SORT_TYPE) {
          filtersSortTypes = originListItemsForCancel;
        }
      });
      builder.setView(customView).create().show();

      if (listItems.size() > 0) {
        sortItemsAdapter = new SortItemsAdapter(this, listItems, resources, package_name);

        RecyclerView rvItemsToFilter = customView.findViewById(resources.getIdentifier("rvItemsToSort", "id", package_name));
        LinearLayoutManager llm = new LinearLayoutManager(this);
        rvItemsToFilter.setLayoutManager(llm);
        rvItemsToFilter.setAdapter(sortItemsAdapter);

        sortItemsAdapter.setDragListener(viewHolder -> mItemTouchHelper.startDrag(viewHolder));
        ItemTouchHelper.Callback callback = new DragItemTouchHelper(sortItemsAdapter);
        mItemTouchHelper = new ItemTouchHelper(callback);
        mItemTouchHelper.attachToRecyclerView(rvItemsToFilter);
      }
    }
  }

  private void responseFiltersToIonic() {
    JSONObject jsonObject = new JSONObject();
    try {
      jsonObject.put("result", true);
      jsonObject.put("action", "filters");
      JSONObject filtersToIonic = new JSONObject();
      filtersToIonic.put("sort", KeyPairBoolData.arrayToJsonArray(filtersSortTypes));
      filtersToIonic.put("model", KeyPairBoolData.arrayToJsonArray(filtersModels));
      filtersToIonic.put("brand", KeyPairBoolData.arrayToJsonArray(filtersBrands));
      filtersToIonic.put("size", KeyPairBoolData.arrayToJsonArray(filtersSizes));
      filtersToIonic.put("color", KeyPairBoolData.arrayToJsonArray(filtersColors));
      filtersToIonic.put("type", KeyPairBoolData.arrayToJsonArray(filtersTypes));
      jsonObject.put("filters", filtersToIonic);
    } catch (JSONException e) {

    }
    PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
    pResult.setKeepCallback(true);
    ScanditSDK.mCallbackContextMatrixSimple.sendPluginResult(pResult);
  }

  public static void loadFiltersPicking(FiltersPickingStores newFilters) {
    filtersPickingStores = newFilters;

    if (filtersPickingStores != null) {
      filtersSortTypes = new ArrayList<>();
      filtersModels = new ArrayList<>();
      filtersBrands = new ArrayList<>();
      filtersSizes = new ArrayList<>();
      filtersColors = new ArrayList<>();
      filtersTypes = new ArrayList<>();

      if (filtersPickingStores.getOrderTypes().size() > 0) {
        for (SingleFilterPickingStores orderType : filtersPickingStores.getOrderTypes()) {
          KeyPairBoolData keyPairBoolData = new KeyPairBoolData();
          keyPairBoolData.setId(orderType.getId());
          keyPairBoolData.setName(orderType.getName());
          keyPairBoolData.setObject(orderType);
          filtersSortTypes.add(keyPairBoolData);
        }
      }

      if (filtersPickingStores.getModels().size() > 0) {
        for (SingleFilterPickingStores model : filtersPickingStores.getModels()) {
          KeyPairBoolData keyPairBoolData = new KeyPairBoolData();
          keyPairBoolData.setId(model.getId());
          keyPairBoolData.setName(model.getReference() + " - " + model.getName());
          keyPairBoolData.setObject(model);
          filtersModels.add(keyPairBoolData);
        }
      }

      if (filtersPickingStores.getBrands().size() > 0) {
        for (SingleFilterPickingStores brand : filtersPickingStores.getBrands()) {
          KeyPairBoolData keyPairBoolData = new KeyPairBoolData();
          keyPairBoolData.setId(brand.getId());
          keyPairBoolData.setName(brand.getName());
          keyPairBoolData.setObject(brand);
          filtersBrands.add(keyPairBoolData);
        }
      }

      if (filtersPickingStores.getSizes().size() > 0) {
        for (SingleFilterPickingStores size : filtersPickingStores.getSizes()) {
          KeyPairBoolData keyPairBoolData = new KeyPairBoolData();
          keyPairBoolData.setId(size.getId());
          keyPairBoolData.setName(size.getName());
          keyPairBoolData.setObject(size);
          filtersSizes.add(keyPairBoolData);
        }
      }

      if (filtersPickingStores.getColors().size() > 0) {
        for (SingleFilterPickingStores color : filtersPickingStores.getColors()) {
          KeyPairBoolData keyPairBoolData = new KeyPairBoolData();
          keyPairBoolData.setId(color.getId());
          keyPairBoolData.setName(color.getName());
          keyPairBoolData.setObject(color);
          filtersColors.add(keyPairBoolData);
        }
      }

      if (filtersPickingStores.getTypes().size() > 0) {
        for (SingleFilterPickingStores type : filtersPickingStores.getTypes()) {
          KeyPairBoolData keyPairBoolData = new KeyPairBoolData();
          keyPairBoolData.setId(type.getId());
          keyPairBoolData.setName(type.getName());
          keyPairBoolData.setObject(type);
          filtersTypes.add(keyPairBoolData);
        }
      }
    }
  }

  public static void loadProductsPending(Activity activity, Resources resources, String package_name, ArrayList<JSONObject> productsPending) {
    activityForLoadFull = activity;
    resourcesForLoadFull = resources;
    packageNameForLoadFull = package_name;
    productsPendingForLoadFull = productsPending;
    PendingProductsPickingStores pendingFragment = pageAdapterSmall.getPendingFragment();
    if (pendingFragment != null) {
      pendingFragment.updateListView(activity, resources, package_name, productsPending);
    }
    loadProductsPendingFull(activity, resources, package_name, productsPending);
  }

  public static void loadProductsProcessed(Activity activity, Resources resources, String package_name, ArrayList<JSONObject> productsProcessed) {
    if (activityForLoadFull == null) activityForLoadFull = activity;
    if (resourcesForLoadFull == null) resourcesForLoadFull = resources;
    if (packageNameForLoadFull == null) packageNameForLoadFull = package_name;
    productsProcessedForLoadFull = productsProcessed;
    ProcessedProductsPickingStores processedFragment = pageAdapterSmall.getProcessedFragment();
    if (processedFragment != null) {
      processedFragment.updateListView(activity, resources, package_name, productsProcessed);
    }
    loadProductsProcessedFull(activity, resources, package_name, productsProcessed);
  }

  public static void loadProductsPendingFull(Activity activity, Resources resources, String package_name, ArrayList<JSONObject> productsPending) {
    PendingProductsPickingStoresFull pendingFragmentFull = pageAdapterFull.getPendingFragment();
    if (pendingFragmentFull != null) {
      pendingFragmentFull.updateListView(activity, resources, package_name, productsPending);
    }
  }

  public static void loadProductsProcessedFull(Activity activity, Resources resources, String package_name, ArrayList<JSONObject> productsProcessed) {
    ProcessedProductsPickingStoresFull processedFragmentFull = pageAdapterFull.getProcessedFragment();
    if (processedFragmentFull != null) {
      processedFragmentFull.updateListView(activity, resources, package_name, productsProcessed);
    }
  }

  public static void loadListRejectionReasons(ArrayList<PickingStoreRejectionReason> newListRejectionReasons, ArrayList<String> newListNamesRejectionReasons) {
    listRejectionReasons = newListRejectionReasons;
    listNamesRejectionReasons = newListNamesRejectionReasons;
  }

  public static void showInfoForProduct(LineRequestsProduct lineRequestsProduct, Resources resources, String package_name, boolean isProcessed) {
    final PickingStoreRejectionReason[] pickingStoreRejectionReasonSelected = { listRejectionReasons.get(0) };

    View customView = LayoutInflater.from(matrixPickingStores).inflate(resources.getIdentifier("product_info_picking_store", "layout", package_name), viewGroup, false);
    ImageView ivProductPickingStore = customView.findViewById(resources.getIdentifier("ivProductPickingStore", "id", package_name));
    TextView tvReferencePickingStore = customView.findViewById(resources.getIdentifier("tvReferencePickingStore", "id", package_name));
    TextView tvNamePickingStore = customView.findViewById(resources.getIdentifier("tvNamePickingStore", "id", package_name));
    TextView tvSizePickingStore = customView.findViewById(resources.getIdentifier("tvSizePickingStore", "id", package_name));
    TextView tvBrandPickingStore = customView.findViewById(resources.getIdentifier("tvBrandPickingStore", "id", package_name));
    TextView tvColorPickingStore = customView.findViewById(resources.getIdentifier("tvColorPickingStore", "id", package_name));
    Spinner sRejectionReasonPickingStore = customView.findViewById(resources.getIdentifier("sRejectionReasonPickingStore", "id", package_name));
    LinearLayout llRejectionPickingStore = customView.findViewById(resources.getIdentifier("llRejectionPickingStore", "id", package_name));
    Button btnRejectionPickingStore = customView.findViewById(resources.getIdentifier("btnRejectionPickingStore", "id", package_name));
    View vRejectionReasonDividerPickingStore = customView.findViewById(resources.getIdentifier("vRejectionReasonDividerPickingStore", "id", package_name));
    View vRejectionReasonNoDividerPickingStore = customView.findViewById(resources.getIdentifier("vRejectionReasonNoDividerPickingStore", "id", package_name));

    if (!urlBase.isEmpty()) {
      String url = urlBase + lineRequestsProduct.getModel().getImageUrl();
      Glide.with(matrixPickingStores).load(url).fitCenter().into(ivProductPickingStore);
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        ivProductPickingStore.setClipToOutline(true);
      }
    }

    tvReferencePickingStore.setText(lineRequestsProduct.getModel().getReference());
    tvNamePickingStore.setText(lineRequestsProduct.getModel().getName());
    tvSizePickingStore.setText(lineRequestsProduct.getSize().getName());
    tvBrandPickingStore.setText(lineRequestsProduct.getModel().getBrand().getName());
    tvColorPickingStore.setText(lineRequestsProduct.getModel().getColor().getName());

    vRejectionReasonDividerPickingStore.setVisibility(View.GONE);
    vRejectionReasonNoDividerPickingStore.setVisibility(View.VISIBLE);
    llRejectionPickingStore.setVisibility(View.GONE);
    sRejectionReasonPickingStore.setVisibility(View.GONE);

    if (!isProcessed) {
      vRejectionReasonDividerPickingStore.setVisibility(View.VISIBLE);
      vRejectionReasonNoDividerPickingStore.setVisibility(View.GONE);
      sRejectionReasonPickingStore.setVisibility(View.VISIBLE);
      ArrayAdapter<String> adapterRejectionReasons = new ArrayAdapter<>(matrixPickingStores, android.R.layout.simple_spinner_dropdown_item, listNamesRejectionReasons);
      sRejectionReasonPickingStore.setAdapter(adapterRejectionReasons);
      sRejectionReasonPickingStore.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
        @Override
        public void onItemSelected(AdapterView<?> adapterView, View view, int position, long id) {
          if (position == 0) {
            llRejectionPickingStore.setVisibility(View.GONE);
          } else {
            llRejectionPickingStore.setVisibility(View.VISIBLE);
          }
          pickingStoreRejectionReasonSelected[0] = listRejectionReasons.get(position);
        }
        @Override
        public void onNothingSelected(AdapterView<?> adapterView) {

        }
      });

      btnRejectionPickingStore.setOnClickListener(view -> {
        JSONObject jsonObject = new JSONObject();
        try {
          jsonObject.put("result", true);
          jsonObject.put("action", "request_reject");
          jsonObject.put("reasonId", pickingStoreRejectionReasonSelected[0].getId());
          jsonObject.put("requestReference", lineRequestsProduct.getReference());
        } catch (JSONException e) {

        }
        PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
        pResult.setKeepCallback(true);
        ScanditSDK.mCallbackContextMatrixSimple.sendPluginResult(pResult);
      });
    }

    Dialog dialogProductInfoLocal = new Dialog(matrixPickingStores);
    dialogProductInfoLocal.requestWindowFeature(Window.FEATURE_NO_TITLE);
    dialogProductInfoLocal.setContentView(customView);
    dialogProductInfoLocal.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
    dialogProductInfoLocal.setCancelable(true);
    dialogProductInfoLocal.show();

    dialogInfoForProduct = dialogProductInfoLocal;
  }

  public static void hideInfoForProduct() {
    if (dialogInfoForProduct != null) {
      dialogInfoForProduct.hide();
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

  @Override
  public void onFragmentInteraction(Uri uri) {

  }
}
