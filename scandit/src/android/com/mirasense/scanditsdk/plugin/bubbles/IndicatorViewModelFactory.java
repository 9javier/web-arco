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

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.Resources;

import com.scandit.recognition.TrackedBarcode;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import android.util.Log;

import com.mirasense.scanditsdk.plugin.Product;

public final class IndicatorViewModelFactory {

  @SuppressLint("SimpleDateFormat")
  private static final SimpleDateFormat printDateFormat = new SimpleDateFormat("MM-dd-yy");

  private Context context;

  public IndicatorViewModelFactory(Context context) {
    this.context = context;
  }

  public BaseBubble createBubble(IndicatorState indicatorState, TrackedBarcode barcode, String package_name, Resources resources) {
    BubbleData barcodeData = mockBubbleDataObject(barcode.getData());

    switch (indicatorState) {
      case MINIMISED:
        return new MinimisedBubble(context, barcodeData);
      case MAXIMISED:
        return new MaximisedBubble(context, barcodeData, package_name, resources);
      default:
        return new NoBubble(context, barcodeData);
    }
  }

  public BaseBubble createBubbleWithData(IndicatorState indicatorState, TrackedBarcode barcode, String package_name, Resources resources, Product product) {
    BubbleData barcodeData = new BubbleData(product);

    switch (indicatorState) {
      case MINIMISED_DATA:
        return new MinimisedBubbleData(context, barcodeData, package_name, resources);
      case MAXIMISED_DATA:
        return new MaximisedBubbleData(context, barcodeData, package_name, resources);
      default:
        return new NoBubble(context, barcodeData);
    }
  }

  public BaseBubble createBubbleReferenceSerauto(IndicatorState indicatorState, TrackedBarcode barcode, String package_name, Resources resources) {
    BubbleData barcodeData = new BubbleData(barcode.getData(), "AZUL");

    Log.d("CORDOVA_MATRIX", "barcodeData: " + barcodeData.getCode());
    Log.d("CORDOVA_MATRIX", "indicatorState: " + indicatorState);

    switch (indicatorState) {
      case MINIMISED:
        return new MinimisedBubbleReferenceSerauto(context, barcodeData, package_name, resources);
      case MAXIMISED:
        return new MaximisedBubbleReferenceSerauto(context, barcodeData, package_name, resources);
      default:
        return new NoBubble(context, barcodeData);
    }
  }

  private BubbleData mockBubbleDataObject(String data) {
    Log.d("CORDOVA_MATRIX", "mockBubbleDataObject: " + data);
    List<String> list = new ArrayList<>();
    list.add(data);
    list.add(mockBubbleDataObjectStock(data));
    list.add(mockBubbleDataObjectOnline());
    list.add(mockBubbleDataObjectDeliveryDate(data));

    return new BubbleData(list);
  }

  private String mockBubbleDataObjectStock(String data) {
//        int lastDigit = Math.max(Character.getNumericValue(data.charAt(data.length() - 1)), 0);
//        int stockValue;
//        if (lastDigit <= 2) {
//            stockValue = lastDigit % 5; // Critical: 0-5
//        } else if (lastDigit <= 5) {
//            int codeValue;
//            try {
//                codeValue = Integer.parseInt(data.substring(data.length() - 2));
//            } catch (NumberFormatException e) {
//                codeValue = 0;
//            }
//
//            stockValue = 11 + (codeValue); // Good: 11+
//        } else {
//            stockValue = 6 + lastDigit % 5; // Low: 6-10
//        }
//        return String.valueOf(stockValue);
    return "";
  }

  private String mockBubbleDataObjectOnline() {
    return "15";
  }

  private String mockBubbleDataObjectDeliveryDate(String data) {
    Date date = new Date();
    int codeValue;
    try {
      codeValue = Integer.parseInt(data);
    } catch (NumberFormatException e) {
      codeValue = 0;
    }

    return printDateFormat.format(addDays(date, codeValue % 15));
  }

  private Date addDays(Date date, int days) {
    GregorianCalendar cal = new GregorianCalendar();
    cal.setTime(date);
    cal.add(Calendar.DATE, days);
    return cal.getTime();
  }
}
