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
   * @param successCallback
   * @param title
   * @param titleBackground
   * @param titleColor
   * @param textInitInfo
   */
  initPickingStores: function (successCallback, title, titleBackground, titleColor, textInitInfo) {
    exec(successCallback, null, PLUGIN_NAME, "matrixPickingStores", [title, titleBackground, titleColor, textInitInfo]);
  },
  /**
   *
   * @param successCallback
   * @param title
   * @param titleBackground
   * @param titleColor
   * @param typeTag
   */
  initPrintTags: function (successCallback, title, titleBackground, titleColor, typeTag) {
    exec(successCallback, null, PLUGIN_NAME, "matrixPrintTags", [title, titleBackground, titleColor, typeTag]);
  },
  /**
   *
   * @param successCallback
   * @param title
   * @param titleBackground
   * @param titleColor
   */
  initProductInfo: function (successCallback, title, titleBackground, titleColor) {
    exec(successCallback, null, PLUGIN_NAME, "matrixProductInfo", [title, titleBackground, titleColor]);
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
   * @param type
   */
  showTextStartScanPacking: function (show, type, packingReference) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleShowTextStartScanPacking", [show, type, packingReference]);
  },
  /**
   *
   * @param show
   * @param packingReference
   * @param type
   */
  showTextEndScanPacking: function (show, type, packingReference) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleShowTextEndScanPacking", [show, type, packingReference]);
  },
  /**
   *
   * @param show
   * @param text
   */
  showFixedTextBottom: function (show, text) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleShowFixedTextBottom", [show, text]);
  },
  /**
   *
   * @param show
   */
  showButtonFinishReception: function (show) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleShowButtonFinishReception", [show]);
  },
  /**
   *
   * @param products
   * @param productsProcessed
   * @param filters
   */
  sendPickingStoresProducts: function (products, productsProcessed, filters) {
    exec(null, null, PLUGIN_NAME, "matrixPickingStoresLoadProducts", [products, productsProcessed, filters]);
  },
  /**
   *
   * @param show
   * @param text
   */
  setTextPickingStores: function (show, text) {
    exec(null, null, PLUGIN_NAME, "matrixPickingStoresSetText", [show, text]);
  },
  /**
   *
   * @param show
   * @param text
   * @param action
   * @param textPositiveButton
   * @param textNegativeButton
   */
  showWarning: function (show, text, action, textPositiveButton, textNegativeButton) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleShowWarning", [show, text, action, textPositiveButton, textNegativeButton]);
  },
  /**
   *
   * @param show
   * @param text
   * @param action
   * @param textPositiveButton
   * @param textNegativeButton
   */
  showAlertSelectSizeToPrint: function (title, listItems) {
    exec(null, null, PLUGIN_NAME, "matrixSimpleAlertSelectSizeToPrint", [title, listItems]);
  },
  finishPickingStores: function () {
    exec(null, null, PLUGIN_NAME, "matrixPickingStoresFinish");
  },
  /**
   *
   * @param show
   */
  showButtonPickingStoreFinish: function (show) {
    exec(null, null, PLUGIN_NAME, "matrixPickingStoresShowButtonFinish", [show]);
  },
  /**
   *
   * @param show
   */
  showButtonPickingStorePacking: function (show) {
    exec(null, null, PLUGIN_NAME, "matrixPickingStoresShowButtonPacking", [show]);
  },
  /**
   *
   * @param show
   * @param product
   */
  showProductExtendedInfo: function (show, product) {
    exec(null, null, PLUGIN_NAME, "matrixProductInfoShowExtended", [show, product]);
  },
  /**
   *
   * @param show
   */
  showProgressBarProductExtendedInfo: function (show) {
    exec(null, null, PLUGIN_NAME, "matrixShowProgressBarProductExtendedInfo", [show]);
  }
}

module.exports = ScanditMatrixSimple;
