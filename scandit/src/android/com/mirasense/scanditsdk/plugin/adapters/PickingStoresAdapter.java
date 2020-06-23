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
import android.widget.ImageButton;
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
    TextView tvTypeValue = itemView.findViewById(resources.getIdentifier("tvTypeValue", "id", packageName));

    LinearLayout sizeLayout = itemView.findViewById(resources.getIdentifier("sizeLayout", "id", packageName));
    LinearLayout deleteLayout = itemView.findViewById(resources.getIdentifier("deleteLayout", "id", packageName));
    LinearLayout secondRowLayout = itemView.findViewById(resources.getIdentifier("secondRowLayout", "id", packageName));

    try {
      if (products.get(position).isNull("id")) {
        sizeLayout.setVisibility(View.GONE);
        secondRowLayout.setVisibility(View.GONE);
        deleteLayout.setVisibility(View.VISIBLE);

        tvModelValue.setText(products.get(position).getString("reference"));

        ImageButton deleteButton = itemView.findViewById(resources.getIdentifier("deleteButton", "id", packageName));

        deleteButton.setOnClickListener(view1 -> MatrixPickingStores.deletePacking(tvModelValue.getText().toString()));
      }else{
        sizeLayout.setVisibility(View.VISIBLE);
        secondRowLayout.setVisibility(View.VISIBLE);
        deleteLayout.setVisibility(View.GONE);

        if (!products.get(position).isNull("model")) {
          tvModelValue.setText(products.get(position).getJSONObject("model").getString("reference"));
          if (!products.get(position).getJSONObject("model").isNull("brand")) {
            tvBrandValue.setText(products.get(position).getJSONObject("model").getJSONObject("brand").getString("name"));
          }
        }

        if (!products.get(position).isNull("size")) {
          tvSizeValue.setText(products.get(position).getJSONObject("size").getString("name"));
        }

        if (!products.get(position).isNull("shippingMode")) {
          tvTypeValue.setText("PO");
        }else{
          String typeRequest = "PT";
          try {
            if(products.get(position).getInt("source") == 10){
              typeRequest = "TR";
            }
          } catch (JSONException e){
            Log.d("CORDOVA_MATRIX", "error " + e.getMessage());
          }
          tvTypeValue.setText(typeRequest);
        }

        if(tvTypeValue.getText().equals("PO")){
          itemView.setOnClickListener(view1 -> MatrixPickingStores.showInfoForDeliveryRequest(new LineRequestsProduct(products.get(position)), resources, packageName, false));
        }else{
          itemView.setOnClickListener(view1 -> MatrixPickingStores.showInfoForProduct(new LineRequestsProduct(products.get(position)), resources, packageName, false));
        }      }
    } catch (JSONException e) {
      e.printStackTrace();
    }

    return itemView;
  }

}
