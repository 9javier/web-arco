package com.mirasense.scanditsdk.plugin;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.res.Resources;
import android.graphics.Color;
import android.graphics.RectF;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
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
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

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

  private final int FILTER_SORT_TYPE = 1;
  private final int FILTER_MODEL = 2;
  private final int FILTER_BRAND = 3;
  private final int FILTER_SIZE = 4;
  private final int FILTER_COLOR = 5;

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
    }

    String package_name = getApplication().getPackageName();
    Resources resources = getApplication().getResources();

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
      WindowManager.LayoutParams.FLAG_FULLSCREEN);

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
      WindowManager.LayoutParams.FLAG_FULLSCREEN);

    setContentView(resources.getIdentifier("references_matrix_picking_stores", "layout", package_name));

    Toolbar toolbarPickingStores = findViewById(resources.getIdentifier("toolbarPickingStores", "id", package_name));
    setSupportActionBar(toolbarPickingStores);

    ActionBar actionBar = getSupportActionBar();
    actionBar.setDisplayShowCustomEnabled(true);
    actionBar.setBackgroundDrawable(new ColorDrawable(Color.parseColor(backgroundTitle)));

    ((TextView) findViewById(resources.getIdentifier("action_bar_title", "id", package_name))).setText(title);
    ((TextView) findViewById(resources.getIdentifier("action_bar_title", "id", package_name))).setTextColor(Color.parseColor(colorTitle));

    TextView tvPackingStart = this.findViewById(android.R.id.content).getRootView().findViewById(resources.getIdentifier("tvPackingStart", "id", package_name));
    tvPackingStart.setText(textInit);
    tvPackingStart.setVisibility(View.VISIBLE);

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

    ImageButton arrowBack = findViewById(resources.getIdentifier("arrow_back_button", "id", package_name));
    arrowBack.setOnClickListener(v -> finish());

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

    Button btnFinishPickingStore = findViewById(resources.getIdentifier("btnFinishPickingStore", "id", package_name));
    Button btnPackingPickingStore = findViewById(resources.getIdentifier("btnPackingPickingStore", "id", package_name));
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

    btnPackingPickingStore.setOnClickListener(v -> {
      JSONObject jsonObject = new JSONObject();
      try {
        jsonObject.put("result", true);
        jsonObject.put("action", "matrix_simple_scan_packings");
      } catch (JSONException e) {

      }
      PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
      pResult.setKeepCallback(true);
      ScanditSDK.mCallbackContextMatrixSimple.sendPluginResult(pResult);
    });

    initializeFilters(resources, package_name);

    matrixPickingStores = this;
  }

  public static void loadFiltersPicking(FiltersPickingStores newFilters) {
    filtersPickingStores = newFilters;

    if (filtersPickingStores != null) {
      filtersSortTypes = new ArrayList<>();
      filtersModels = new ArrayList<>();
      filtersBrands = new ArrayList<>();
      filtersSizes = new ArrayList<>();
      filtersColors = new ArrayList<>();

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

  private void initializeFilters(Resources resources, String package_name) {
    TextView tvSortBy = findViewById(resources.getIdentifier("tvSortBy", "id", package_name));
    TextView tvFilterModel = findViewById(resources.getIdentifier("tvFilterModel", "id", package_name));
    TextView tvFilterBrand = findViewById(resources.getIdentifier("tvFilterBrand", "id", package_name));
    TextView tvFilterSize = findViewById(resources.getIdentifier("tvFilterSize", "id", package_name));
    TextView tvFilterColor = findViewById(resources.getIdentifier("tvFilterColor", "id", package_name));

    tvSortBy.setOnClickListener(view -> {
      this.openSortItemsSpinner(resources, package_name, tvSortBy, filtersSortTypes, FILTER_SORT_TYPE, "Ordenar por");
    });
    tvFilterModel.setOnClickListener(view -> {
      this.openSearchItemsSpinner(resources, package_name, tvFilterModel, filtersModels, FILTER_MODEL, "Modelos");
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
              defaultMessageFilter = "Filtro modelo";
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

  private  void openSortItemsSpinner(Resources resources, String package_name, TextView tvSelected, final ArrayList<KeyPairBoolData> listItems, int filterType, String titleAlert) {
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
      jsonObject.put("filters", filtersToIonic);
    } catch (JSONException e) {

    }
    PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
    pResult.setKeepCallback(true);
    ScanditSDK.mCallbackContextMatrixSimple.sendPluginResult(pResult);
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
