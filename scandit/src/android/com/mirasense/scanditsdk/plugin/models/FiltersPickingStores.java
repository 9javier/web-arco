package com.mirasense.scanditsdk.plugin.models;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class FiltersPickingStores {

  private ArrayList<SingleFilterPickingStores> brands;
  private ArrayList<SingleFilterPickingStores> colors;
  private ArrayList<SingleFilterPickingStores> models;
  private ArrayList<SingleFilterPickingStores> orderTypes;
  private ArrayList<SingleFilterPickingStores> sizes;
  private ArrayList<SingleFilterPickingStores> types;

  public FiltersPickingStores() {
    this.brands = new ArrayList<>();
    this.colors = new ArrayList<>();
    this.models = new ArrayList<>();
    this.orderTypes = new ArrayList<>();
    this.sizes = new ArrayList<>();
    this.types = new ArrayList<>();
  }

  public void fromJsonObject(JSONObject filters) throws JSONException {
    if (!filters.isNull("brands")) {
      JSONArray brands = filters.getJSONArray("brands");
      for (int iBrand = 0; iBrand < brands.length(); iBrand++) {
        SingleFilterPickingStores brand = new SingleFilterPickingStores();
        brand.fromJsonObject(brands.getJSONObject(iBrand));
        this.brands.add(brand);
      }
    }
    if (!filters.isNull("colors")) {
      JSONArray colors = filters.getJSONArray("colors");
      for (int iColor = 0; iColor < colors.length(); iColor++) {
        SingleFilterPickingStores color = new SingleFilterPickingStores();
        color.fromJsonObject(colors.getJSONObject(iColor));
        this.colors.add(color);
      }
    }
    if (!filters.isNull("models")) {
      JSONArray models = filters.getJSONArray("models");
      for (int iModel = 0; iModel < models.length(); iModel++) {
        SingleFilterPickingStores model = new SingleFilterPickingStores();
        model.fromJsonObject(models.getJSONObject(iModel));
        this.models.add(model);
      }
    }
    if (!filters.isNull("ordertypes")) {
      JSONArray orderTypes = filters.getJSONArray("ordertypes");
      for (int iOrderType = 0; iOrderType < orderTypes.length(); iOrderType++) {
        SingleFilterPickingStores orderType = new SingleFilterPickingStores();
        orderType.fromJsonObject(orderTypes.getJSONObject(iOrderType));
        this.orderTypes.add(orderType);
      }
    }
    if (!filters.isNull("sizes")) {
      JSONArray sizes = filters.getJSONArray("sizes");
      for (int iSize = 0; iSize < sizes.length(); iSize++) {
        SingleFilterPickingStores size = new SingleFilterPickingStores();
        size.fromJsonObject(sizes.getJSONObject(iSize));
        this.sizes.add(size);
      }
    }
    if (!filters.isNull("types")) {
      JSONArray types = filters.getJSONArray("types");
      for (int iType = 0; iType < types.length(); iType++) {
        SingleFilterPickingStores type = new SingleFilterPickingStores();
        type.fromJsonObject(types.getJSONObject(iType));
        this.types.add(type);
      }
    }
  }

  public ArrayList<SingleFilterPickingStores> getBrands() {
    return brands;
  }
  public void setBrands(ArrayList<SingleFilterPickingStores> brands) {
    this.brands = brands;
  }

  public ArrayList<SingleFilterPickingStores> getColors() {
    return colors;
  }
  public void setColors(ArrayList<SingleFilterPickingStores> colors) {
    this.colors = colors;
  }

  public ArrayList<SingleFilterPickingStores> getModels() {
    return models;
  }
  public void setModels(ArrayList<SingleFilterPickingStores> models) {
    this.models = models;
  }

  public ArrayList<SingleFilterPickingStores> getOrderTypes() {
    return orderTypes;
  }
  public void setOrderTypes(ArrayList<SingleFilterPickingStores> orderTypes) {
    this.orderTypes = orderTypes;
  }

  public ArrayList<SingleFilterPickingStores> getSizes() {
    return sizes;
  }
  public void setSizes(ArrayList<SingleFilterPickingStores> sizes) {
    this.sizes = sizes;
  }

  public ArrayList<SingleFilterPickingStores> getTypes() {
    return types;
  }
  public void setTypes(ArrayList<SingleFilterPickingStores> types) {
    this.types = types;
  }
}
