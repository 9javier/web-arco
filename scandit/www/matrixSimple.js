var exec = require('cordova/exec');
var PLUGIN_NAME = 'ScanditSDK';

var ScanditMatrixSimple = {

  /**
   *
   * @param successCallback
   * @param title
   * @param titleBackground
   * @param titleColor
   */
  init: function (successCallback, title, titleBackground, titleColor) {
    exec(successCallback, null, PLUGIN_NAME, "matrixSimple", [title, titleBackground, titleColor]);
  },
  /**
   *
   * @param text
   * @param background
   * @param color
   * @param size
   */
  setText: function (text, background, color, size) {
    exec(null, null, PLUGIN_NAME, "setMatrixSimpleText", [text, background, color, size]);
  },
  /**
   *
   * @param show
   */
  showText: function (show) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleShowText", [show]);
  },
  /**
   *
   * @param show
   */
  showTextLoader: function (show) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleShowLoader", [show]);
  },
  /**
   *
   * @param show
   * @param barcode
   */
  showWarningToForce: function (show, barcode) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleShowWarningToForce", [show, barcode]);
  },
  finish: function () {
    exec(null, null, PLUGIN_NAME, "matrixSimpleFinish");
  },
  /**
   *
   * @param productInfo
   * @param background
   * @param text
   */
  setNexProductToScan: function (productInfo, background, text) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleSetNextProductToScan", [productInfo, background, text]);
  },
  /**
   *
   * @param show
   */
  showNexProductToScan: function (show) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleShowNextProductToScan", [show]);
  },
  /**
   *
   * @param show
   * @param packingReference
   */
  showTextScanJail: function (show, packingReference) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleShowTextScanJail", [show, packingReference]);
  },
  /**
   *
   * @param show
   * @param packingReference
   */
  showTextScanPallet: function (show, packingReference) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleShowTextScanPallet", [show, packingReference]);
  }
}

module.exports = ScanditMatrixSimple;
