package com.mirasense.scanditsdk.plugin.models;

import org.json.JSONException;
import org.json.JSONObject;

public class Size {

  private String reference;
  private String number;
  private String name;
  private String description;
  private int stock = 100;
  private Price price;

  public Size() {}

  public void fromJsonObject(JSONObject size) throws JSONException {
    this.reference = size.getString("reference");
    this.number = size.getString("number");
    this.name = size.getString("name");
    this.description = size.getString("description");
    if (!size.isNull("price")) {
      this.price = new Price();
      this.price.fromJsonObject(size.getJSONObject("price"));
    } else {
      this.price = null;
    }
  }

  public String getReference() {
    return reference;
  }
  public void setReference(String reference) {
    this.reference = reference;
  }

  public String getNumber() {
    return number;
  }
  public void setNumber(String number) {
    this.number = number;
  }

  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }

  public int getStock() {
    return stock;
  }
  public void setStock(int stock) {
    this.stock = stock;
  }

  public Price getPrice() {
    return price;
  }
  public void setPrice(Price price) {
    this.price = price;
  }
}
