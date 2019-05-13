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

import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.content.res.Resources;
import android.util.Log;

import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import com.mirasense.scanditsdk.plugin.utility.UiUtils;

public class MaximisedBubbleReferenceSerauto extends BaseBubble {

  private static final int WIDTH = 200;
  private static final int FULL_INDICATOR_HEIGHT = 137;
  private static final int INDICATOR_WITHOUT_DELIVERY_HEIGHT = 82;

  private int deliveryVisibility;
  private Drawable backgroundDrawable;

  private BubbleData bubbleData;
  private String package_name;
  private Resources resources;
  private View view;

  public MaximisedBubbleReferenceSerauto(Context context, BubbleData bubbleData, String package_name, Resources resources) {
    super(context, bubbleData);
    this.bubbleData = bubbleData;
    this.package_name = package_name;
    this.resources = resources;

    if (!this.bubbleData.getCode().isEmpty()) {
      deliveryVisibility = View.VISIBLE;
      backgroundDrawable = resources.getDrawable(resources.getIdentifier("bg_transparent_black", "drawable", package_name));
    } else {
      deliveryVisibility = View.GONE;
      backgroundDrawable = resources.getDrawable(resources.getIdentifier("bg_rounded_bottom_black", "drawable", package_name));
    }
    Log.d("CORDOVA_MATRIX", "MaximisedBubbleReferenceSerauto code: "+ bubbleData.getCode() + " Stock: "+ bubbleData.getStock());
  }

  @Override
  public int getWidth() {
    return WIDTH;
  }

  @Override
  public int getHeight() {
    if (!bubbleData.getCode().isEmpty()) {
      return FULL_INDICATOR_HEIGHT;
    } else {
      return INDICATOR_WITHOUT_DELIVERY_HEIGHT;
    }
  }

  @Override
  public View getView(Context context, LayoutInflater inflater) {
    int targetHeight = getHeight();

    View view = inflater.inflate(this.resources.getIdentifier("bubble_maximised_reference", "layout", package_name), null);
    view.findViewById(this.resources.getIdentifier("top", "id", package_name)).setBackground(backgroundDrawable);


    int color = getHighlightColor(bubbleData.getStock());
    ((TextView) view.findViewById(this.resources.getIdentifier("stock_header", "id", package_name))).setTextColor(color);
    ((TextView) view.findViewById(this.resources.getIdentifier("stock_value", "id", package_name))).setTextColor(color);

    ((TextView) view.findViewById(this.resources.getIdentifier("stock_value", "id", package_name))).setText(bubbleData.getReference());
    if (bubbleData.getReference() != null) {
      Log.i("Test::ReferenceBubble", bubbleData.getReference());
    }

    ((TextView) view.findViewById(this.resources.getIdentifier("reference_value", "id", package_name))).setText("Fake reference");
    view.findViewById(this.resources.getIdentifier("bottom", "id", package_name)).setVisibility(deliveryVisibility);

//        ((TextView) view.findViewById(this.resources.getIdentifier("name_value", "id", package_name))).setText("Fake name");

    if(bubbleData.getPvpSizeScanned() != 0){
      ((TextView) view.findViewById(this.resources.getIdentifier("price_value", "id", package_name))).setText(String.valueOf(bubbleData.getPvpSizeScanned()));
      Log.i("Test::PriceBubble", String.valueOf(bubbleData.getPvpSizeScanned()));
    }

    if (!bubbleData.getStocksResume().isEmpty()) {
      TableLayout tableStocks = ((TableLayout) view.findViewById(this.resources.getIdentifier("table_stocks", "id", package_name)));
      tableStocks.setVisibility(View.VISIBLE);

      for (int i = 0; i <2; i++) {
        TableRow row = new TableRow(context);
        TableRow.LayoutParams lp = new TableRow.LayoutParams(TableRow.LayoutParams.WRAP_CONTENT);
        row.setLayoutParams(lp);
        TextView tv = new TextView(context);
        tv.setText("39.5");
        TextView qty = new TextView(context);
        qty.setText("10");
        row.addView(tv);
        row.addView(qty);
        tableStocks.addView(row,i);
      }
    }

//        if(bubbleData.getLocation() != null){
//          ((TextView) view.findViewById(this.resources.getIdentifier("location_value", "id", package_name))).setText(bubbleData.getLocation());
//        }


    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      view.findViewById(this.resources.getIdentifier("header", "id", package_name)).setBackgroundTintList(ColorStateList.valueOf(highlightColor));
//            view.findViewById(this.resources.getIdentifier("bottom", "id", package_name)).setBackgroundTintList(ColorStateList.valueOf(highlightColor));
      view.findViewById(this.resources.getIdentifier("triangle", "id", package_name)).setBackgroundTintList(ColorStateList.valueOf(highlightColor));
    }

    view.setLayoutParams(new FrameLayout.LayoutParams(
      UiUtils.pxFromDp(context, WIDTH), UiUtils.pxFromDp(context, targetHeight)));

    Log.d("CORDOVA_MATRIX", "BUBBLES getView code: "+ bubbleData.getCode() + " Stock: "+ bubbleData.getStock());

    if(!bubbleData.isExist()){
      view.findViewById(this.resources.getIdentifier("stock_header", "id", package_name)).setVisibility(View.GONE);
      view.findViewById(this.resources.getIdentifier("stock_value", "id", package_name)).setVisibility(View.GONE);
      view.findViewById(this.resources.getIdentifier("stock_value", "id", package_name)).setVisibility(View.GONE);
//          ((TextView) view.findViewById(this.resources.getIdentifier("reference_value", "id", package_name))).setText("Fake reference");
//          view.findViewById(this.resources.getIdentifier("reference_value", "id", package_name)).setVisibility(View.VISIBLE);
//          view.findViewById(this.resources.getIdentifier("bottom", "id", package_name)).setVisibility(View.VISIBLE);
//          view.findViewById(this.resources.getIdentifier("name_value", "id", package_name)).setVisibility(View.VISIBLE);
//          ((TextView) view.findViewById(this.resources.getIdentifier("name_value", "id", package_name))).setText("La referencia no existe en Serauto");
      view.findViewById(this.resources.getIdentifier("price_value", "id", package_name)).setVisibility(View.GONE);
      view.findViewById(this.resources.getIdentifier("tv_no_stocks", "id", package_name)).setVisibility(View.GONE);
//          view.findViewById(this.resources.getIdentifier("price_header", "id", package_name)).setVisibility(View.GONE);
    } else {
      view.findViewById(this.resources.getIdentifier("stock_header", "id", package_name)).setVisibility(View.VISIBLE);
      view.findViewById(this.resources.getIdentifier("stock_value", "id", package_name)).setVisibility(View.VISIBLE);
      view.findViewById(this.resources.getIdentifier("stock_value", "id", package_name)).setVisibility(View.VISIBLE);
//          view.findViewById(this.resources.getIdentifier("reference_value", "id", package_name)).setVisibility(View.VISIBLE);
//          view.findViewById(this.resources.getIdentifier("bottom", "id", package_name)).setVisibility(View.VISIBLE);
//          view.findViewById(this.resources.getIdentifier("name_value", "id", package_name)).setVisibility(View.VISIBLE);
      view.findViewById(this.resources.getIdentifier("price_value", "id", package_name)).setVisibility(View.VISIBLE);
      view.findViewById(this.resources.getIdentifier("tv_no_stocks", "id", package_name)).setVisibility(View.GONE);
//          view.findViewById(this.resources.getIdentifier("price_header", "id", package_name)).setVisibility(View.VISIBLE);
    }
    view.findViewById(this.resources.getIdentifier("bottom", "id", package_name)).setVisibility(View.GONE);

    if(bubbleData.getIdReference().isEmpty()){
      if(bubbleData.isExist()){
        view.setVisibility(View.GONE);
      } else {
        view.setVisibility(View.VISIBLE);
      }
    } else {
      view.setVisibility(View.VISIBLE);
    }

    this.view = view;
    return view;
  }

  @Override
  public BubbleData getBubbleData() {
    return this.bubbleData;
  }

  @Override
  public View getViewUse() {
    return this.view;
  }

}
