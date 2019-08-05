package com.mirasense.scanditsdk.plugin.models;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ProductModel {

  private String reference;
  private String name;
  private String imageUrl;
  private Color color;
  private Season season;
  private Brand brand;
  private ArrayList<Size> sizes;

  public ProductModel() {
    this.reference = "";
    this.name = "";
    this.imageUrl = "";
    this.color = new Color();
    this.season = new Season();
    this.brand = new Brand();
    this.sizes = new ArrayList<>();
  }

  public void fromJsonObject(JSONObject productAndSizes) throws JSONException {
    JSONObject productModel = productAndSizes.getJSONObject("productModel");
    this.name = productModel.getString("name");
    this.reference = productModel.getString("reference");
    if (!productModel.isNull("image")) {
      this.imageUrl = productModel.getString("image");
    }

    if (!productModel.isNull("color")) {
      this.color.fromJsonObject(productModel.getJSONObject("color"));
    }

    if (!productModel.isNull("season")) {
      this.season.fromJsonObject(productModel.getJSONObject("season"));
    }

    if (!productModel.isNull("brand")) {
      this.brand.fromJsonObject(productModel.getJSONObject("brand"));
    }

    if (!productAndSizes.isNull("sizes")) {
      JSONArray productSizes = productAndSizes.getJSONArray("sizes");
      for (int iSize = 0; iSize < productSizes.length(); iSize++) {
        Size size = new Size();
        size.fromJsonObject(productSizes.getJSONObject(iSize));
        this.sizes.add(size);
      }
    }
  }

  public String getReference() {
    return reference;
  }
  public void setReference(String reference) {
    this.reference = reference;
  }

  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }

  public String getImageUrl() {
    return imageUrl;
  }
  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public Color getColor() {
    return color;
  }
  public void setColor(Color color) {
    this.color = color;
  }

  public Season getSeason() {
    return season;
  }
  public void setSeason(Season season) {
    this.season = season;
  }

  public Brand getBrand() {
    return brand;
  }
  public void setBrand(Brand brand) {
    this.brand = brand;
  }

  public ArrayList<Size> getSizes() {
    return sizes;
  }
  public void setSizes(ArrayList<Size> sizes) {
    this.sizes = sizes;
  }
}
