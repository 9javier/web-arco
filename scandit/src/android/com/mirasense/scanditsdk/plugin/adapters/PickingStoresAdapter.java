package com.mirasense.scanditsdk.plugin.adapters;

import android.app.Activity;
import android.content.res.Resources;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.mirasense.scanditsdk.plugin.MatrixPickingStores;
import com.mirasense.scanditsdk.plugin.models.LineRequestsProduct;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class PickingStoresAdapter extends ArrayAdapter<JSONObject> {

  private final Activity context;
  private final ArrayList<JSONObject> products;
  private final Resources resources;
  private final String packageName;

  public PickingStoresAdapter(Activity context, ArrayList<JSONObject> products, Resources resources, String packageName) {
    super(context, resources.getIdentifier("item_picking_store", "layout", packageName), products);
    this.context=context;
    this.products = products;
    this.resources = resources;
    this.packageName = packageName;
  }

  @NonNull
  @Override
  public View getView (int position, @Nullable View view, @Nullable ViewGroup parent) {
    LayoutInflater inflater = context.getLayoutInflater();
    View itemView = inflater.inflate(resources.getIdentifier("item_picking_store", "layout", packageName), null);

    TextView tvModelValue = itemView.findViewById(resources.getIdentifier("tvModelValue", "id", packageName));
    TextView tvSizeValue = itemView.findViewById(resources.getIdentifier("tvSizeValue", "id", packageName));
    TextView tvBrandValue = itemView.findViewById(resources.getIdentifier("tvBrandValue", "id", packageName));

    LinearLayout sizeLayout = itemView.findViewById(resources.getIdentifier("sizeLayout", "id", packageName));
    LinearLayout brandLayout = itemView.findViewById(resources.getIdentifier("brandLayout", "id", packageName));

    try {
      if (products.get(position).isNull("id")) {
        sizeLayout.setVisibility(View.INVISIBLE);
        brandLayout.setVisibility(View.INVISIBLE);

        tvModelValue.setText(products.get(position).getString("reference"));
      }else{
        sizeLayout.setVisibility(View.VISIBLE);
        brandLayout.setVisibility(View.VISIBLE);

        if (!products.get(position).isNull("model")) {
          tvModelValue.setText(products.get(position).getJSONObject("model").getString("reference"));
          if (!products.get(position).getJSONObject("model").isNull("brand")) {
            tvBrandValue.setText(products.get(position).getJSONObject("model").getJSONObject("brand").getString("name"));
          }
        }
        if (!products.get(position).isNull("size")) {
          tvSizeValue.setText(products.get(position).getJSONObject("size").getString("name"));
        }

        itemView.setOnClickListener(view1 -> MatrixPickingStores.showInfoForProduct(new LineRequestsProduct(products.get(position)), resources, packageName, false));
      }
    } catch (JSONException e) {
      e.printStackTrace();
    }

    return itemView;
  }

}
