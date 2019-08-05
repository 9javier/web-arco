package com.mirasense.scanditsdk.plugin.models;

import org.json.JSONException;
import org.json.JSONObject;

public class Price {

  private boolean haveDiscount = false;
  private String tariffName;
  private String priceOriginal;
  private String priceDiscount;
  private String priceDiscountOutlet;
  private double percentDiscount;
  private double percentDiscountOutlet;
  private String rangerNumberMin;
  private String rangerNumberMax;

  public Price() {}

  public void fromJsonObject(JSONObject price) throws JSONException {
    this.tariffName = price.getString("tariffName");
    this.priceOriginal = price.getString("priceOriginal");
    this.priceDiscount = price.getString("priceDiscount");
    this.priceDiscountOutlet = price.getString("priceDiscountOutlet");
    this.percentDiscount = price.getDouble("percent");
    this.percentDiscountOutlet = price.getDouble("percentOutlet");
    if (!price.isNull("rangesNumbers")) {
      this.rangerNumberMin = price.getJSONObject("rangesNumbers").getString("sizeRangeNumberMin");
      this.rangerNumberMax = price.getJSONObject("rangesNumbers").getString("sizeRangeNumberMax");
    }
  }

  public boolean isHaveDiscount() {
    return haveDiscount;
  }
  public void setHaveDiscount(boolean haveDiscount) {
    this.haveDiscount = haveDiscount;
  }

  public String getTariffName() {
    return tariffName;
  }
  public void setTariffName(String tariffName) {
    this.tariffName = tariffName;
  }

  public String getPriceOriginal() {
    return priceOriginal;
  }
  public void setPriceOriginal(String priceOriginal) {
    this.priceOriginal = priceOriginal;
  }

  public String getPriceDiscount() {
    return priceDiscount;
  }
  public void setPriceDiscount(String priceDiscount) {
    this.priceDiscount = priceDiscount;
  }

  public String getPriceDiscountOutlet() {
    return priceDiscountOutlet;
  }
  public void setPriceDiscountOutlet(String priceDiscountOutlet) {
    this.priceDiscountOutlet = priceDiscountOutlet;
  }

  public double getPercentDiscount() {
    return percentDiscount;
  }
  public void setPercentDiscount(double percentDiscount) {
    this.percentDiscount = percentDiscount;
  }

  public double getPercentDiscountOutlet() {
    return percentDiscountOutlet;
  }
  public void setPercentDiscountOutlet(double percentDiscountOutlet) {
    this.percentDiscountOutlet = percentDiscountOutlet;
  }

  public String getRangerNumberMin() {
    return rangerNumberMin;
  }
  public void setRangerNumberMin(String rangerNumberMin) {
    this.rangerNumberMin = rangerNumberMin;
  }

  public String getRangerNumberMax() {
    return rangerNumberMax;
  }
  public void setRangerNumberMax(String rangerNumberMax) {
    this.rangerNumberMax = rangerNumberMax;
  }
}
