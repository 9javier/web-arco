package com.mirasense.scanditsdk.plugin.adapters;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.scandit.galvintec.krack.logistica.dev.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class PickingStoresAdapter extends ArrayAdapter<JSONObject> {

  private final Activity context;
  private final ArrayList<JSONObject> products;

  public PickingStoresAdapter(Activity context, ArrayList<JSONObject> products) {
    super(context, R.layout.item_picking_store, products);
    this.context=context;
    this.products = products;
  }

  @NonNull
  @Override
  public View getView (int position, @Nullable View view, @Nullable ViewGroup parent) {
    LayoutInflater inflater = context.getLayoutInflater();
    View itemView = inflater.inflate(R.layout.item_picking_store, null);

    TextView tvModelValue = itemView.findViewById(R.id.tvModelValue);
    TextView tvSizeValue = itemView.findViewById(R.id.tvSizeValue);
    TextView tvBrandValue = itemView.findViewById(R.id.tvBrandValue);

    try {
      if (!products.get(position).isNull("product")) {
        if (!products.get(position).getJSONObject("product").isNull("model")) {
          tvModelValue.setText(products.get(position).getJSONObject("product").getJSONObject("model").getString("reference"));
          if (!products.get(position).getJSONObject("product").getJSONObject("model").isNull("brand")) {
            tvBrandValue.setText(products.get(position).getJSONObject("product").getJSONObject("model").getJSONObject("brand").getString("name"));
          }
        }
        if (!products.get(position).getJSONObject("product").isNull("size")) {
          tvSizeValue.setText(products.get(position).getJSONObject("product").getJSONObject("size").getString("name"));
        }
      }
    } catch (JSONException e) {
      e.printStackTrace();
    }

    return itemView;
  }

}
