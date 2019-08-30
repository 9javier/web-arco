package com.github.diegorquera.zbtprinter;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import android.os.Looper;

import com.zebra.android.discovery.*;
import com.zebra.sdk.comm.*;
import com.zebra.sdk.printer.*;

public class ZebraBluetoothPrinter extends CordovaPlugin {

  private static final String LOG_TAG = "ZebraBluetoothPrinter";
  static Connection thePrinterConnection;
  static boolean readyToPrint;
  static String macConnection;

  public ZebraBluetoothPrinter() {
  }

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

    if (action.equals("print")) {
      try {
        String mac = args.getString(0);
        String msg = args.getString(1);
        sendData(callbackContext, mac, msg);
      } catch (Exception e) {
        Log.e(LOG_TAG, e.getMessage());
        e.printStackTrace();
      }
      return true;
    } else if (action.equals("printLabel")) {
      try {
        String mac = args.getString(0);
        printLabel(callbackContext, mac);
      } catch (Exception e) {
        Log.e(LOG_TAG, e.getMessage());
        e.printStackTrace();
      }
      return true;
    } else if (action.equals("find")) {
      try {
        findPrinter(callbackContext);
      } catch (Exception e) {
        Log.e(LOG_TAG, e.getMessage());
        e.printStackTrace();
      }
      return true;
    } else if (action.equals("printWithConnection")) {
      try {
        String mac = args.getString(0);
        String msg = args.getString(1);
        printDataWithConnection(callbackContext, mac, msg);
      } catch (Exception e) {
        Log.e(LOG_TAG, e.getMessage());
        e.printStackTrace();
      }
      return true;
    } else if (action.equals("openConnection")) {
      try {
        String mac = args.getString(0);
        openConnection(callbackContext, mac);
      } catch (Exception e) {
        Log.e(LOG_TAG, e.getMessage());
        e.printStackTrace();
      }
      return true;
    } else if (action.equals("closeConnection")) {
      try {
        closeConnection(callbackContext);
      } catch (Exception e) {
        Log.e(LOG_TAG, e.getMessage());
        e.printStackTrace();
      }
      return true;
    } else if (action.equals("checkConnection")) {
      try {
        checkConnection(callbackContext);
      } catch (Exception e) {
        Log.e(LOG_TAG, e.getMessage());
        e.printStackTrace();
      }
      return true;
    }
    return false;
  }

  public void findPrinter(final CallbackContext callbackContext) {
    try {
      BluetoothDiscoverer.findPrinters(this.cordova.getActivity().getApplicationContext(), new DiscoveryHandler() {

        public void foundPrinter(DiscoveredPrinter printer) {
          if (printer instanceof DiscoveredPrinterBluetooth) {
            JSONObject printerObj = new JSONObject();
            try {
              printerObj.put("address", printer.address);
              printerObj.put("friendlyName", ((DiscoveredPrinterBluetooth) printer).friendlyName);
              callbackContext.success(printerObj);
            } catch (JSONException e) {

            }
          } else {
            String macAddress = printer.address;
            //I found a printer! I can use the properties of a Discovered printer (address) to make a Bluetooth Connection
            callbackContext.success(macAddress);
          }
        }

        public void discoveryFinished() {
          //Discovery is done
        }

        public void discoveryError(String message) {
          //Error during discovery
          callbackContext.error(message);
        }
      });
    } catch (Exception e) {
      // Handle communications error here.
      callbackContext.error(e.getMessage());
    }
  }

  void openConnection(final CallbackContext callbackContext, final String mac) {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
    new Thread(new Runnable() {
      @Override
      public void run() {
        try {
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 1");
          closeConnection(callbackContext);
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 2");
          thePrinterConnection = new BluetoothConnectionInsecure(mac);
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 3");
          thePrinterConnection.open();
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 4");
          ZebraPrinter printer = ZebraPrinterFactory.getInstance(thePrinterConnection);
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 5");
          PrinterStatus printerStatus = printer.getCurrentStatus();
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 6");
          if (printerStatus.isReadyToPrint) {
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 7");
            readyToPrint = true;
            macConnection = mac;
            callbackContext.success("connect");
          } else if (printerStatus.isPaused) {
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 8");
            callbackContext.error("printer_paused");
          } else if (printerStatus.isHeadOpen) {
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 9");
            callbackContext.error("door_is_open");
          } else if (printerStatus.isPaperOut) {
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 10");
            callbackContext.error("paper_is_out");
          } else {
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 11");
            callbackContext.error("cannot_print");
          }
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 12");

        } catch (Exception e) {
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] openConnection 13");
          // Handle communications error here.
          callbackContext.error(e.getMessage());
        }
      }
    }).start();
  }

  static void closeConnection(final CallbackContext callbackContext) {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
    Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] closeConnection 1");
    try {
      if (thePrinterConnection != null) {
        Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] closeConnection 2");
        thePrinterConnection.close();
        thePrinterConnection = null;
      }
    } catch (Exception e) {
      Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] closeConnection 3");
      // Handle communications error here.
      callbackContext.error(e.getMessage());
    }
  }

  static void checkConnection(final CallbackContext callbackContext) {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
    new Thread(new Runnable() {
      @Override
      public void run() {
        try {
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] checkConnection 1");
          if (thePrinterConnection != null) {
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] checkConnection 2");
            ZebraPrinter printer = ZebraPrinterFactory.getInstance(thePrinterConnection);
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] checkConnection 3");
            PrinterStatus printerStatus = printer.getCurrentStatus();
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] checkConnection 4");
            if (printerStatus.isReadyToPrint) {
              Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] checkConnection 5");
              readyToPrint = true;
              callbackContext.success("connect");
            } else if (printerStatus.isPaused) {
              Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] checkConnection 6");
              callbackContext.error("printer_paused");
            } else if (printerStatus.isHeadOpen) {
              Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] checkConnection 7");
              callbackContext.error("door_is_open");
            } else if (printerStatus.isPaperOut) {
              Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] checkConnection 8");
              callbackContext.error("paper_is_out");
            } else {
              Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] checkConnection 9");
              callbackContext.error("cannot_print");
            }
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] checkConnection 10");
          } else {
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] checkConnection 11");
            callbackContext.error("not_connected");
          }

        } catch (Exception e) {
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] checkConnection 12 " + e.getMessage());
          // Handle communications error here.
          callbackContext.error("not_connected");
        }
      }
    }).start();
  }

  void printDataWithConnection(final CallbackContext callbackContext, final String mac, final String msg) throws IOException {
    if (this.thePrinterConnection != null) {
      final Connection fThePrinterConnection = this.thePrinterConnection;
      new Thread(new Runnable() {
        @Override
        public void run() {
          try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] printDataWithConnection 1");
            Looper.prepare();
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] printDataWithConnection 2");
            SGD.SET("device.languages", "zpl", fThePrinterConnection);
            fThePrinterConnection.write(msg.getBytes());
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] printDataWithConnection 3");
            Looper.myLooper().quit();
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] printDataWithConnection 4");
            callbackContext.success("Done");

          } catch (Exception e) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
            Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] printDataWithConnection 5");
            try {
              sendData(callbackContext, mac, msg);
            } catch (IOException eIO) {
              Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] printDataWithConnection 6");
              callbackContext.error(eIO.getMessage());
            }
          }
        }
      }).start();
    }
  }

  /*
   * This will send data to be printed by the bluetooth printer
   */
  void sendData(final CallbackContext callbackContext, final String mac, final String msg) throws IOException {
    new Thread(new Runnable() {
      @Override
      public void run() {
        try {

          SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] sendData 1");
          // Instantiate insecure connection for given Bluetooth MAC Address.
          Connection thePrinterConn = new BluetoothConnectionInsecure(mac);
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] sendData 2");

          // Initialize
          Looper.prepare();
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] sendData 3");
          // Open the connection - physical connection is established here.
          thePrinterConn.open();
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] sendData 4");

          SGD.SET("device.languages", "zpl", thePrinterConn);
          thePrinterConn.write(msg.getBytes());
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] sendData 5");

          // Close the insecure connection to release resources.
          thePrinterConn.close();
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] sendData 6");

          Looper.myLooper().quit();
          Log.d(LOG_TAG, "[" + sdf.format(new Date()) + "] sendData 7");
          callbackContext.success("Done");

        } catch (Exception e) {
          // Handle communications error here.
          callbackContext.error(e.getMessage());
        }
      }
    }).start();
  }

  /*
   * This will send data to be printed by the bluetooth printer
   */
  void printLabel(final CallbackContext callbackContext, final String mac) throws IOException {
    new Thread(new Runnable() {
      @Override
      public void run() {
        try {

          // Instantiate insecure connection for given Bluetooth MAC Address.
          Connection thePrinterConn = new BluetoothConnectionInsecure(mac);

          // if (isPrinterReady(thePrinterConn)) {

          // Initialize
          Looper.prepare();

          // Open the connection - physical connection is established here.
          thePrinterConn.open();

          // Print label sample
          ZebraPrinter zPrinter = ZebraPrinterFactory.getInstance(thePrinterConn);
          zPrinter.printConfigurationLabel();

          // Close the insecure connection to release resources.
          thePrinterConn.close();

          Looper.myLooper().quit();
          callbackContext.success("Done");

          // } else {
          // callbackContext.error("Printer is not ready");
          // }
        } catch (Exception e) {
          // Handle communications error here.
          callbackContext.error(e.getMessage());
        }
      }
    }).start();
  }

  private Boolean isPrinterReady(Connection connection) throws ConnectionException, ZebraPrinterLanguageUnknownException {
    Boolean isOK = false;
    connection.open();
    // Creates a ZebraPrinter object to use Zebra specific functionality like getCurrentStatus()
    ZebraPrinter printer = ZebraPrinterFactory.getInstance(connection);
    PrinterStatus printerStatus = printer.getCurrentStatus();
    if (printerStatus.isReadyToPrint) {
      isOK = true;
    } else if (printerStatus.isPaused) {
      throw new ConnectionException("Cannot print because the printer is paused");
    } else if (printerStatus.isHeadOpen) {
      throw new ConnectionException("Cannot print because the printer media door is open");
    } else if (printerStatus.isPaperOut) {
      throw new ConnectionException("Cannot print because the paper is out");
    } else {
      throw new ConnectionException("Cannot print");
    }
    return isOK;
  }
}

