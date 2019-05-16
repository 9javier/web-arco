package com.mirasense.scanditsdk.plugin.bubbles;
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentSkipListMap;
import java.util.HashMap;

import android.util.Log;
import com.mirasense.scanditsdk.plugin.Product;
import com.mirasense.scanditsdk.plugin.models.StockReference;

/*
 * @param String code                    Barcode scanned
 * @param String reference               Product reference
 * @param float pvpSizeScanned           Avelon PVP for scanned size
 * @param Map<String, String> stocksResume  List stocks by size
 */
public class BubbleData {

  private String code;

  //region My variables
  private String reference;
  private float pvpSizeScanned;
  private Map<String, String> stocksResume = new HashMap();
  //endregion

  private int stock;
  private int online;
  private String deliveryDate;
  private String name = "";
  private String price = "";
  private String soldUnits = "";
  private String color = "";
  private String location = "";
  private String idReference = "";
  private String supplier = "";
  private boolean exist = true;
  private Map<Integer, StockReference> locations = new ConcurrentSkipListMap<>();

  public BubbleData(String code, String color) {
    this.code = code;
    this.name = "";
    this.stock = 0;
    this.price = "";
    this.soldUnits = "";
    this.color = color;
    this.location = "";
    this.idReference = "";
  }

  public BubbleData(List<String> values) {
    Log.d("CORDOVA_MATRIX", "value code " + values.get(0));
    Log.d("CORDOVA_MATRIX", "value stock " + values.get(1));
    code = values.get(0);
    if(values.get(1) != null && !values.get(1).isEmpty()){
      stock = Integer.parseInt(values.get(1));
    }
    online = Integer.parseInt(values.get(2));
    deliveryDate = values.get(3);
    name = "";
  }

  public BubbleData(Product product) {
    this.code = product.getCode();
    this.name = "";
    this.stock = Integer.parseInt(product.getStock());
    this.price = product.getPrice();
    this.soldUnits = product.getSoldUnits();
    this.color = product.getColor();
  }

  public String getCode() {
    return code;
  }

  public int getStock() {
    return stock;
  }

  public int getOnline() {
    return online;
  }

  public String getDeliveryDate() {
    return deliveryDate;
  }

  public void setStock(int stock) {
    this.stock = stock;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPrice() {
    return price;
  }

  public void setPrice(String price) {
    this.price = price;
  }

  public String getSoldUnits() {
    return soldUnits;
  }

  public void setSoldUnits(String soldUnits) {
    this.soldUnits = soldUnits;
  }

  public String getColor() {
    return color;
  }

  public void setColor(String color) {
    this.color = color;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public Map<Integer, StockReference> getLocations() {
    return locations;
  }

  public void setLocations(Map<Integer, StockReference> locations) {
    this.locations = locations;
  }

  public String getIdReference() {
    return idReference;
  }

  public void setIdReference(String idReference) {
    this.idReference = idReference;
  }

  public String getSupplier() {
    return supplier;
  }

  public void setSupplier(String supplier) {
    this.supplier = supplier;
  }

  public boolean isExist() {
    return exist;
  }

  public void setExist(boolean exist) {
    this.exist = exist;
  }

  public String getReference() {
    return reference;
  }

  public void setReference(String reference) {
    this.reference = reference;
  }

  public float getPvpSizeScanned() {
    return pvpSizeScanned;
  }

  public void setPvpSizeScanned(float pvpSizeScanned) {
    this.pvpSizeScanned = pvpSizeScanned;
  }

  public Map<String, String> getStocksResume() {
    return stocksResume;
  }

  public void setStocksResume(Map<String, String> stocksResume) {
    this.stocksResume = stocksResume;
  }
}
