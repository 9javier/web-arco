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
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;

public abstract class BaseBubble {

  private Context context;
  private int greenThreshold;
  private int yellowThreshold;

  public int highlightColor;
  public int stockColor;

  public BaseBubble(Context context, BubbleData bubbleData) {
    this(context, bubbleData, 15, 2);
  }

  public BaseBubble(Context context, BubbleData bubbleData, int greenThreshold, int yellowThreshold) {
    this.context = context;
    this.greenThreshold = greenThreshold;
    this.yellowThreshold = yellowThreshold;

    if (bubbleData.getColor() != null && !(bubbleData.getColor().isEmpty())) {
      //Colores permitidos
      switch (bubbleData.getColor().toUpperCase()) {
        case "VERDE":
        case "GREEN":
          highlightColor = Color.parseColor("#9939CC61");
          break;
        case "AMARILLO":
        case "YELLOW":
          highlightColor = Color.parseColor("#99FAD05C");
          break;
        case "NARANJA":
        case "ORANGE":
          highlightColor = Color.parseColor("#99E4814C");
          break;
        case "ROJO":
        case "RED":
          highlightColor = Color.parseColor("#99E44C4C");
          break;
        case "VIOLETA":
        case "VIOLET":
          highlightColor = Color.parseColor("#99AA49E2");
          break;
        case "AZUL":
        case "BLUE":
          highlightColor = Color.parseColor("#734a7a9e");
          break;
        case "ROSA":
        case "PINK":
          highlightColor = Color.parseColor("#99E9117D");
          break;
        case "BLANCO":
        case "WHITE":
          highlightColor = Color.parseColor("#BFFFFFFF");
          break;
        default:
          highlightColor = Color.parseColor("#BFFFFFFF");
          break;
      }
    } else {
      highlightColor = Color.parseColor("#BFFFFFFF");
    }
    stockColor = getHighlightColor(bubbleData.getStock());

  }

  public int getHighlightColor(int inStock) {
    //Transparentes
//        if (inStock > greenThreshold) {
//            return Color.parseColor("#9939CC61");
//        } else if (inStock > yellowThreshold) {
//            return Color.parseColor("#99FAD05C");
//        } else {
//            return Color.parseColor("#99E44C4C");
//        }
//        if (inStock > greenThreshold) {
//            return Color.parseColor("#FF39CC61");
//        } else if (inStock > yellowThreshold) {
//            return Color.parseColor("#FFCAC638");
//        } else {
//            return Color.parseColor("#FFD72F2F");
//        }
    return Color.parseColor("#BFFFFFFF");
  }

  public abstract int getWidth();

  public abstract int getHeight();

  public abstract View getView(Context context, LayoutInflater inflater);

  public abstract BubbleData getBubbleData();

  public abstract View getViewUse();
}
