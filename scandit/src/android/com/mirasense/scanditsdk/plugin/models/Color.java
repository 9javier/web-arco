package com.mirasense.scanditsdk.plugin.models;

import org.json.JSONException;
import org.json.JSONObject;

public class Color {

  private String name;
  private String codeHex;
  private String avelonId;
  private String description;

  public Color() {}

  public void fromJsonObject(JSONObject color) throws JSONException {
    this.name = color.getString("name");
    this.codeHex = color.getString("colorHex");
    this.avelonId = color.getString("avelonId");
    this.description = color.getString("description");
  }

  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }

  public String getCodeHex() {
    return codeHex;
  }
  public void setCodeHex(String codeHex) {
    this.codeHex = codeHex;
  }

  public String getAvelonId() {
    return avelonId;
  }
  public void setAvelonId(String avelonId) {
    this.avelonId = avelonId;
  }

  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }
}
