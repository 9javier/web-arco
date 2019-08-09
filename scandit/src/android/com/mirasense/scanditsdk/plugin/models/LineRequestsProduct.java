package com.mirasense.scanditsdk.plugin.models;

import org.json.JSONException;
import org.json.JSONObject;

public class LineRequestsProduct {

  private int id;
  private String reference;
  private ProductModel model;
  private Size size;

  public LineRequestsProduct() {}

  public LineRequestsProduct(JSONObject lineRequest) {
    try {
      fromJsonObject(lineRequest);
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }

  public void fromJsonObject(JSONObject lineRequest) throws JSONException {
    this.id = lineRequest.getInt("id");
    this.reference = lineRequest.getString("reference");
    if (!lineRequest.isNull("model")) {
      ProductModel model = new ProductModel();
      model.fromJsonObject(lineRequest.getJSONObject("model"));
    }
    if (!lineRequest.isNull("size")) {
      Size size = new Size();
      size.fromJsonObject(lineRequest.getJSONObject("size"));
    }
  }

  public int getId() {
    return id;
  }
  public void setId(int id) {
    this.id = id;
  }

  public String getReference() {
    return reference;
  }
  public void setReference(String reference) {
    this.reference = reference;
  }

  public ProductModel getModel() {
    return model;
  }
  public void setModel(ProductModel model) {
    this.model = model;
  }

  public Size getSize() {
    return size;
  }
  public void setSize(Size size) {
    this.size = size;
  }
}
