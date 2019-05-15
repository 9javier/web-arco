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
  finish: function () {
    exec(null, null, PLUGIN_NAME, "matrixSimpleFinish");
  },
}

module.exports = ScanditMatrixSimple;
