package com.mirasense.scanditsdk.plugin.models;

import org.json.JSONException;
import org.json.JSONObject;

public class PickingStoreRejectionReason {

  private int id;
  private String reference;
  private String name;

  public PickingStoreRejectionReason() {}

  public PickingStoreRejectionReason(int id, String reference, String name) {
    this.id = id;
    this.reference = reference;
    this.name = name;
  }

  public void fromJsonObject(JSONObject rejectionReason) throws JSONException {
    this.id = rejectionReason.getInt("id");
    this.reference = rejectionReason.getString("reference");
    this.name = rejectionReason.getString("name");
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

  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }

  @Override
  public String toString() {
    return "Id: " + this.id + " // Reference: " + this.reference + " // Name: " + this.name;
  }
}
