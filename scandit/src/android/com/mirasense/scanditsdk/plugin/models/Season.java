package com.mirasense.scanditsdk.plugin.models;

import org.json.JSONException;
import org.json.JSONObject;

public class Season {

  private String name;
  private String avelonId;

  public Season() {}

  public void fromJsonObject(JSONObject season) throws JSONException {
    this.name = season.getString("name");
    this.avelonId = season.getString("avelonId");
  }

  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }

  public String getAvelonId() {
    return avelonId;
  }
  public void setAvelonId(String avelonId) {
    this.avelonId = avelonId;
  }
}
