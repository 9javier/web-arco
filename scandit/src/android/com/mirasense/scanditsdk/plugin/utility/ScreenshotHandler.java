package com.mirasense.scanditsdk.plugin.utility;

/*
 * Copyright 2016-2017 Louis Chen [firemaples@gmail.com].
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.PixelFormat;
import android.graphics.Point;
import android.hardware.display.DisplayManager;
import android.media.Image;
import android.media.ImageReader;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.Base64;
import android.view.Display;
import android.view.WindowManager;
import com.mirasense.scanditsdk.plugin.MatrixBubblesActivity;

import android.view.View;
import android.widget.LinearLayout;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.apache.cordova.CallbackContext;


/**
 * Created by firemaples on 2016/3/4.
 */
public class ScreenshotHandler {

  private static ScreenshotHandler _instance;
  private final static int TIMEOUT = 5000;

  public final static int ERROR_CODE_KNOWN_ERROR = 0;
  public final static int ERROR_CODE_TIMEOUT = 1;
  public final static int ERROR_CODE_IMAGE_FORMAT_ERROR = 2;

  private Context context;
  private boolean isGetUserPermission;
  private Intent mediaProjectionIntent;
  private OnScreenshotHandlerCallback callback;
  private Runnable timeoutRunnable;

  private ScreenshotHandler(Context context) {
    this.context = context;
  }

  private ScreenshotHandler() {
  }

  public static ScreenshotHandler init(Context context) {
    _instance = new ScreenshotHandler(context);
    return _instance;
  }

  public static boolean isInitialized() {
    return _instance != null && _instance.isGetUserPermission();
  }

  public static ScreenshotHandler getInstance() {
    if (_instance == null) {
      _instance = new ScreenshotHandler();
    }
    return _instance;
  }

  public void setCallback(OnScreenshotHandlerCallback callback) {
    this.callback = callback;
  }

  public void release() {
    _instance = null;
  }

  public boolean isGetUserPermission() {
    return isGetUserPermission && mediaProjectionIntent != null;
  }

  public void getUserPermission() {
    if (isGetUserPermission) {
      return;
    }
    context.startActivity(new Intent(context, MatrixBubblesActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
  }

  private MediaProjection getMediaProjection() {
    if (!isGetUserPermission) {
      getUserPermission();
      return null;
    } else {
      MediaProjectionManager projectionManager = (MediaProjectionManager) context.getSystemService(Context.MEDIA_PROJECTION_SERVICE);
      return projectionManager.getMediaProjection(Activity.RESULT_OK, (Intent) mediaProjectionIntent.clone());
    }
  }

  public void setMediaProjectionIntent(Intent mediaProjectionIntent) {
    this.mediaProjectionIntent = (Intent) mediaProjectionIntent.clone();
    isGetUserPermission = true;
  }

  public void takeScreenshot(CallbackContext callbackContext, LinearLayout llProductData, long delay) {
    if (callback != null) {
      callback.onScreenshotStart();
    }

    new Handler().postDelayed(new Runnable() {
      @Override
      public void run() {
        _takeScreenshot(callbackContext, llProductData);
      }
    }, delay);
  }

  public void takeScreenshot(CallbackContext callbackContext, LinearLayout llProductData) {
    if (callback != null) {
      callback.onScreenshotStart();
    }

    _takeScreenshot(callbackContext, llProductData);
  }

  private void _takeScreenshot(CallbackContext callbackContext, LinearLayout llProductData) {
    Log.d("SCREENSHOT", "Start screenshot");
    final long screenshotStartTime = System.currentTimeMillis();

    final MediaProjection mProjection = getMediaProjection();
    if (mProjection == null) {
      Log.d("SCREENSHOT", "MediaProjection is null");
      return;
    }
    // http://binwaheed.blogspot.tw/2015/03/how-to-correctly-take-screenshot-using.html
    // Get size of screen
    WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
    Display display = wm.getDefaultDisplay();
    final DisplayMetrics metrics = new DisplayMetrics();
    display.getMetrics(metrics);
    Point size = new Point();
    display.getRealSize(size);
    final int mWidth = size.x;
    final int mHeight = size.y;
    int mDensity = metrics.densityDpi;

    Activity activity = (Activity) this.context;

    //Create a imageReader for catch result
    if(llProductData != null){
      activity.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          // Stuff that updates the UI
          llProductData.setVisibility(View.GONE);
        }
      });
    }
    final ImageReader mImageReader = ImageReader.newInstance(mWidth, mHeight, PixelFormat.RGBA_8888, 2);

    final Handler handler = new Handler(Looper.getMainLooper());

    //Take a screenshot
    int flags = DisplayManager.VIRTUAL_DISPLAY_FLAG_OWN_CONTENT_ONLY | DisplayManager.VIRTUAL_DISPLAY_FLAG_PUBLIC;
    mProjection.createVirtualDisplay("screen-mirror", mWidth, mHeight, mDensity, flags, mImageReader.getSurface(), null, handler);

    //convert result into image
    Log.d("SCREENSHOT", "add setOnImageAvailableListener");
    timeoutRunnable = new Runnable() {
      @Override
      public void run() {
        mImageReader.setOnImageAvailableListener(null, handler);
        mImageReader.close();
        mProjection.stop();

        Log.d("SCREENSHOT", "Screenshot timeout");
        if (callback != null) {
          callback.onScreenshotFailed(ERROR_CODE_TIMEOUT, null);
        }
      }
    };
    handler.postDelayed(timeoutRunnable, TIMEOUT);
    mImageReader.setOnImageAvailableListener(new ImageReader.OnImageAvailableListener() {
      @Override
      public void onImageAvailable(ImageReader reader) {
        reader.setOnImageAvailableListener(null, handler);
        Log.d("SCREENSHOT", "onImageAvailable");
        Image image = null;
        Bitmap tempBmp = null;
        Bitmap realSizeBitmap = null;

        if(llProductData != null){
          activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
              // Stuff that updates the UI
              llProductData.setVisibility(View.VISIBLE);
            }
          });

        }

        try {
          image = reader.acquireLatestImage();
//                    throw new UnsupportedOperationException("The producer output buffer format 0x5 doesn't match the ImageReader's configured buffer format 0x1.");
          Log.d("SCREENSHOT", "screenshot image info: width:" + image.getWidth() + " height:" + image.getHeight());

          final Image.Plane[] planes = image.getPlanes();
          final ByteBuffer buffer = planes[0].getBuffer();
          int pixelStride = planes[0].getPixelStride();
          int rowStride = planes[0].getRowStride();
          int rowPadding = rowStride - pixelStride * metrics.widthPixels;
          // create bitmap
          tempBmp = Bitmap.createBitmap(metrics.widthPixels + (int) ((float) rowPadding / (float) pixelStride), metrics.heightPixels, Bitmap.Config.ARGB_8888);
          tempBmp.copyPixelsFromBuffer(buffer);
          realSizeBitmap = Bitmap.createBitmap(tempBmp, 0, 0, metrics.widthPixels, tempBmp.getHeight());

        } catch (Throwable e) {
          Log.d("SCREENSHOT", "Screenshot failed");
          e.printStackTrace();
          if (callback != null) {
            if (e instanceof UnsupportedOperationException) {
              callback.onScreenshotFailed(ERROR_CODE_IMAGE_FORMAT_ERROR, e);
            } else {
              callback.onScreenshotFailed(ERROR_CODE_KNOWN_ERROR, e);
            }
          }

        } finally {
          if (image != null) {
            image.close();
          }
          reader.close();
          mProjection.stop();
          if (tempBmp != null) {
            tempBmp.recycle();
          }
        }

        if (timeoutRunnable != null) {
          handler.removeCallbacks(timeoutRunnable);
          timeoutRunnable = null;
        }
        if (realSizeBitmap != null) {
          long spentTime = System.currentTimeMillis() - screenshotStartTime;
          Log.d("SCREENSHOT", "Screenshot finished, spent: " + spentTime + " ms");

          if(callbackContext != null){

            final Bitmap fRealSizeBitmap = realSizeBitmap;

            new Thread(new Runnable() {

              @Override
              public void run() {
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                fRealSizeBitmap.compress(Bitmap.CompressFormat.PNG, 50, byteArrayOutputStream);
                byte[] byteArray = byteArrayOutputStream.toByteArray();
                String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);

                JSONObject jsonObject = new JSONObject();
                try {
                  jsonObject.put("result", true);
                  jsonObject.put("action", "screenshot");
                  jsonObject.put("image", encoded);
                } catch (JSONException e) {

                }

                PluginResult pResult = new PluginResult(PluginResult.Status.OK, jsonObject);
                pResult.setKeepCallback(true);
                callbackContext.sendPluginResult(pResult);
                Log.d("SCREENSHOT", "sendPluginResult");

              }
            }).start();

          }

          if (callback != null) {
            callback.onScreenshotFinished(realSizeBitmap);
          }
        }
      }
    }, handler);
  }

  private void saveBmpToFile(Bitmap bitmap) {
    String fileName = String.format(Locale.getDefault(), "debug_screenshot_%s.jpg",
      new SimpleDateFormat("yyyyMMdd_HHmmssSSS", Locale.getDefault())
        .format(new Date(System.currentTimeMillis())));
    File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), fileName);
    Log.d("SCREENSHOT", "Saving debug screenshot to " + file.getAbsolutePath());
    FileOutputStream out = null;
    try {
      out = new FileOutputStream(file.getAbsolutePath());
      bitmap.compress(Bitmap.CompressFormat.PNG, 100, out); // bmp is your Bitmap instance
      // PNG is a lossless format, the compression factor (100) is ignored
    } catch (Exception e) {
      Log.d("SCREENSHOT", "Save debug screenshot failed");
      e.printStackTrace();
    } finally {
      try {
        if (out != null) {
          out.close();
        }
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  public interface OnScreenshotHandlerCallback {
    void onScreenshotStart();

    void onScreenshotFinished(Bitmap bitmap);

    void onScreenshotFailed(int errorCode, Throwable e);
  }
}
