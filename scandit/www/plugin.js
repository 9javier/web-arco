
var exec = require('cordova/exec');

var PLUGIN_NAME = 'ScanditSDK';

var GScandit = {

  matrix_bubble: function (successCallback, company, warehouse, permissionRegularization, captureScreenshot, secondsScreenshot) {
    exec(successCallback, null, PLUGIN_NAME, "matrix_bubble", [company, warehouse, permissionRegularization, captureScreenshot, secondsScreenshot]);
  },
  setBarcode: function (id, data, stock) {
    exec(null, null, PLUGIN_NAME, "setBarcode", [id, data, stock]);
  },
  setBarcodeName: function (id, data, name) {
    exec(null, null, PLUGIN_NAME, "setBarcodeName", [id, data, name]);
  },
  setDataReference: function (id, data, name, stock, price, location, id_reference, supplier) {
    exec(null, null, PLUGIN_NAME, "setDataReference", [id, data, name, stock, price, location, id_reference, supplier]);
  },
  setLocationsReference: function (id, data, locations) {
    exec(null, null, PLUGIN_NAME, "setLocationsReference", [id, data, locations]);
  },
  matrixWithData: function (data) {
    exec(null, null, PLUGIN_NAME, "matrixWithData", [data]);
  }
};

module.exports = GScandit;
