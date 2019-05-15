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

import com.mirasense.scanditsdk.plugin.utility.UiUtils;

public class MaximisedBubbleData extends BaseBubble {

    private static final int WIDTH = 200;
    private static final int FULL_INDICATOR_HEIGHT = 124;
    private static final int INDICATOR_WITHOUT_DELIVERY_HEIGHT = 82;

    private int deliveryVisibility;
    private Drawable backgroundDrawable;

    private BubbleData bubbleData;
    private String package_name;
    private Resources resources;
    private View view;

    public MaximisedBubbleData(Context context, BubbleData bubbleData, String package_name, Resources resources) {
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
//        View view = inflater.inflate(R.layout.bubble_maximised, null);
//        view.findViewById(R.id.top).setBackground(backgroundDrawable);
//
//        ((TextView) view.findViewById(R.id.stock_header)).setTextColor(highlightColor);
//        ((TextView) view.findViewById(R.id.stock_value)).setText(String.valueOf(bubbleData.getStock()));
//
//        ((TextView) view.findViewById(R.id.online_header)).setTextColor(highlightColor);
//        ((TextView) view.findViewById(R.id.online_value)).setText(String.valueOf(bubbleData.getOnline()));
//
//        view.findViewById(R.id.bottom).setVisibility(deliveryVisibility);
//
//        ((TextView) view.findViewById(R.id.delivery)).setText(bubbleData.getDeliveryDate());
//
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
//            view.findViewById(R.id.header).setBackgroundTintList(ColorStateList.valueOf(highlightColor));
//            view.findViewById(R.id.bottom).setBackgroundTintList(ColorStateList.valueOf(highlightColor));
//            view.findViewById(R.id.triangle).setBackgroundTintList(ColorStateList.valueOf(highlightColor));
//        }
//
//        view.setLayoutParams(new FrameLayout.LayoutParams(
//                UiUtils.pxFromDp(context, WIDTH), UiUtils.pxFromDp(context, targetHeight)));


        View view = inflater.inflate(this.resources.getIdentifier("bubble_maximised_data", "layout", package_name), null);
        view.findViewById(this.resources.getIdentifier("top", "id", package_name)).setBackground(backgroundDrawable);

        ((TextView) view.findViewById(this.resources.getIdentifier("stock_header", "id", package_name))).setTextColor(stockColor);
        ((TextView) view.findViewById(this.resources.getIdentifier("stock_value", "id", package_name))).setTextColor(stockColor);



        ((TextView) view.findViewById(this.resources.getIdentifier("stock_value", "id", package_name))).setText(String.valueOf(bubbleData.getStock()));

//        ((TextView) view.findViewById(this.resources.getIdentifier("online_header", "id", package_name))).setTextColor(highlightColor);
//        ((TextView) view.findViewById(this.resources.getIdentifier("online_value", "id", package_name))).setText(String.valueOf(bubbleData.getOnline()));

        ((TextView) view.findViewById(this.resources.getIdentifier("reference_value", "id", package_name))).setText(String.valueOf(bubbleData.getCode()));
        view.findViewById(this.resources.getIdentifier("bottom", "id", package_name)).setVisibility(deliveryVisibility);

//        ((TextView) view.findViewById(this.resources.getIdentifier("name_value", "id", package_name))).setTextColor(highlightColor);

        if(bubbleData.getPrice() != null){
          ((TextView) view.findViewById(this.resources.getIdentifier("price_value", "id", package_name))).setText(bubbleData.getPrice());
        }
        if(bubbleData.getSoldUnits() != null){
          ((TextView) view.findViewById(this.resources.getIdentifier("sold_value", "id", package_name))).setText(bubbleData.getSoldUnits());
        }

//        ((TextView) view.findViewById(this.resources.getIdentifier("delivery", "id", package_name))).setText(bubbleData.getDeliveryDate());

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            view.findViewById(this.resources.getIdentifier("header", "id", package_name)).setBackgroundTintList(ColorStateList.valueOf(highlightColor));
            view.findViewById(this.resources.getIdentifier("bottom", "id", package_name)).setBackgroundTintList(ColorStateList.valueOf(highlightColor));
            view.findViewById(this.resources.getIdentifier("triangle", "id", package_name)).setBackgroundTintList(ColorStateList.valueOf(highlightColor));
        }

        view.setLayoutParams(new FrameLayout.LayoutParams(
                UiUtils.pxFromDp(context, WIDTH), UiUtils.pxFromDp(context, targetHeight)));

        Log.d("CORDOVA_MATRIX", "BUBBLES getView code: "+ bubbleData.getCode() + " Stock: "+ bubbleData.getStock());
        this.view = view;
        return view;
//        return null;
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
