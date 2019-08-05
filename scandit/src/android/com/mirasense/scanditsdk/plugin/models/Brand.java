package com.mirasense.scanditsdk.plugin.models;

import org.json.JSONException;
import org.json.JSONObject;

public class Brand {

  private String name;
  private String supplierName;

  public Brand() {}

  public void fromJsonObject(JSONObject brand) throws JSONException {
    this.name = brand.getString("name");
    this.supplierName = brand.getString("supplierName");
  }

  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }

  public String getSupplierName() {
    return supplierName;
  }
  public void setSupplierName(String supplierName) {
    this.supplierName = supplierName;
  }
}
