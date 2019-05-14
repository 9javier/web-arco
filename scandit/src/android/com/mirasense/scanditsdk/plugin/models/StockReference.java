package com.mirasense.scanditsdk.plugin.models;

public class StockReference {

  private String company;
  private String warehouse;
  private String location;
  private String stock;

  public StockReference() {
  }

  public StockReference(String company, String warehouse, String location, String stock) {
    this.company = company;
    this.warehouse = warehouse;
    this.location = location;
    this.stock = stock;
  }

  public String getCompany() {
    return company;
  }

  public void setCompany(String company) {
    this.company = company;
  }

  public String getWarehouse() {
    return warehouse;
  }

  public void setWarehouse(String warehouse) {
    this.warehouse = warehouse;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public String getStock() {
    return stock;
  }

  public void setStock(String stock) {
    this.stock = stock;
  }
}
