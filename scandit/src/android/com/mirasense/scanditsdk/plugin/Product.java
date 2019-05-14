package com.mirasense.scanditsdk.plugin;

public class Product {

    private String code;
    private boolean ar;
    private String color;
    private String stock;
    private String price;
    private String url;
    private String soldUnits;

    public Product() {
    }

    public Product(String code, boolean ar, String color, String stock, String price, String url) {
        this.code = code;
        this.ar = ar;
        this.color = color;
        this.stock = stock;
        this.price = price;
        this.url = url;
    }

    public Product(String code, boolean ar, String color, String stock, String price, String url, String soldUnits) {
      this.code = code;
      this.ar = ar;
      this.color = color;
      this.stock = stock;
      this.price = price;
      this.url = url;
      this.soldUnits = soldUnits;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean isAr() {
        return ar;
    }

    public void setAr(boolean ar) {
        this.ar = ar;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getStock() {
        return stock;
    }

    public void setStock(String stock) {
        this.stock = stock;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getSoldUnits() {
      return soldUnits;
    }

    public void setSoldUnits(String soldUnits) {
      this.soldUnits = soldUnits;
    }
}
