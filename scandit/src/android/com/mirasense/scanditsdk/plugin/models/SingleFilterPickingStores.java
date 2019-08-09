package com.mirasense.scanditsdk.plugin.models;

import org.json.JSONException;
import org.json.JSONObject;

public class SingleFilterPickingStores {

  private int id;
  private String name;
  private String reference;

  SingleFilterPickingStores() {}

  SingleFilterPickingStores(int id, String name, String reference) {
    this.id = id;
    this.name = name;
    this.reference = reference;
  }

  public void fromJsonObject(JSONObject singleFilter) throws JSONException {
    this.id = singleFilter.getInt("id");
    this.name = singleFilter.getString("name");

    if (!singleFilter.isNull("reference")) {
      this.reference = singleFilter.getString("reference");
    }
  }

  public int getId() {
    return id;
  }
  public void setId(int id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }

  public String getReference() {
    return reference;
  }
  public void setReference(String reference) {
    this.reference = reference;
  }
}
