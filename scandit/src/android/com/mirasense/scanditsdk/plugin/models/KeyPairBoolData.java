package com.mirasense.scanditsdk.plugin.models;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class KeyPairBoolData {
  private long id;
  private String name;
  private boolean isSelected;
  private int typeSort;
  private Object object;

  public KeyPairBoolData() {
    this.isSelected = false;
    this.typeSort = 1;
  }

  public KeyPairBoolData(KeyPairBoolData keyPairBoolData) {
    this.id = keyPairBoolData.getId();
    this.name = keyPairBoolData.getName();
    this.isSelected = keyPairBoolData.isSelected();
    this.typeSort = keyPairBoolData.getTypeSort();
    this.object = keyPairBoolData.getObject();
  }

  public static JSONObject objectToJsonObject(KeyPairBoolData keyPairBoolData) {
    return new JSONObject();
  }

  public static JSONArray arrayToJsonArray(ArrayList<KeyPairBoolData> listKeyPairBoolData) throws JSONException {
    JSONArray jsonArray = new JSONArray();
    for (KeyPairBoolData keyPairBoolData: listKeyPairBoolData) {
      if (keyPairBoolData.getTypeSort() == 1 && !keyPairBoolData.isSelected()) {
        continue;
      }
      JSONObject jsonObject = new JSONObject();
      jsonObject.put("id", keyPairBoolData.getId());
      jsonObject.put("name", keyPairBoolData.getName());
      if (keyPairBoolData.getTypeSort() != 1) {
        if (keyPairBoolData.getTypeSort() == 2) {
          jsonObject.put("type_sort", "ASC");
        } else {
          jsonObject.put("type_sort", "DESC");
        }
      }
      jsonArray.put(jsonObject);
    }
    return jsonArray;
  }

  public Object getObject() {
    return object;
  }

  public void setObject(Object object) {
    this.object = object;
  }

  /**
   * @return the id
   */
  public long getId() {
    return id;
  }

  /**
   * @param id the id to set
   */
  public void setId(long id) {
    this.id = id;
  }

  /**
   * @return the name
   */
  public String getName() {
    return name;
  }

  /**
   * @param name the name to set
   */
  public void setName(String name) {
    this.name = name;
  }

  /**
   * @return the isSelected
   */
  public boolean isSelected() {
    return isSelected;
  }

  /**
   * @param isSelected the isSelected to set
   */
  public void setSelected(boolean isSelected) {
    this.isSelected = isSelected;
  }

  public int getTypeSort() {
    return typeSort;
  }

  public void setTypeSort(int typeSort) {
    this.typeSort = typeSort;
  }

  @Override
  public String toString() {
    return "-- Id -> " + this.id + "\nName -> " + this.name + "\nSelected -> " + this.isSelected + "\nTypeSort -> " + this.typeSort;
  }
}
