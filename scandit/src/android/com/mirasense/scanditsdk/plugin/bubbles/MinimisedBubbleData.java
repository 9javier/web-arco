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
import android.os.Build;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.content.res.Resources;
import com.mirasense.scanditsdk.plugin.utility.UiUtils;


public class MinimisedBubbleData extends BaseBubble {

    private static final int WIDTH = 52;
    private static final int HEIGHT = 45;

    private BubbleData bubbleData;
    private String package_name;
    private Resources resources;

    public MinimisedBubbleData(Context context, BubbleData bubbleData, String package_name, Resources resources) {
        super(context, bubbleData);
        this.bubbleData = bubbleData;
        this.package_name = package_name;
        this.resources = resources;
    }

    @Override
    public int getWidth() {
        return WIDTH;
    }

    @Override
    public int getHeight() {
        return HEIGHT;
    }

    @Override
    public View getView(Context context, LayoutInflater inflater) {

        View view = inflater.inflate(this.resources.getIdentifier("bubble_minimised_data", "layout", package_name), null);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            view.findViewById(this.resources.getIdentifier("header", "id", package_name)).setBackgroundTintList(ColorStateList.valueOf(highlightColor));
        }
        ((TextView) view.findViewById(this.resources.getIdentifier("stock", "id", package_name))).setTextColor(stockColor);
        ((TextView) view.findViewById(this.resources.getIdentifier("stock", "id", package_name))).setText(String.valueOf(bubbleData.getStock()));
        view.setLayoutParams(new FrameLayout.LayoutParams(
                UiUtils.pxFromDp(context, WIDTH), UiUtils.pxFromDp(context, HEIGHT)));
        return view;
    }

  @Override
  public BubbleData getBubbleData() {
    return this.bubbleData;
  }

  @Override
  public View getViewUse() {
    return null;
  }
}
