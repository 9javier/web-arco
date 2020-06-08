export const environment = {
  production: true,
  printerRequired: true,
  apiBasePhoto: 'http://conexion1.globalretail.es:57354',
  apiBase: 'http://conexion1.globalretail.es:57354/api',
  apiSorter: 'http://conexion1.globalretail.es:57354/api',
  apiLogisticOperator: 'http://conexion1.globalretail.es:57354/api',
  apiRule: 'http://conexion1.globalretail.es:57354',
  apiMiddleware: 'http://conexion1.globalretail.es:57354/api',
  urlBase: 'http://conexion1.globalretail.es:57354',
  uploadFiles: 'http://conexion1.globalretail.es:57354/api/upload-files',
  downloadFiles: 'http://conexion1.globalretail.es:57354',
  downloadPdf: 'http://conexion1.globalretail.es:57354',
  urlDownloadApp: 'https://drive.google.com/open?id=1p8wdD1FpXD_aiUA5U6JsOENNt0Ocp3_o',
  sga: {
    client_id: "krack-client-sga",
    client_secret: "fGx4=yU-j4^jAAjZtV+YTDsm-@R$HAK3"
  },
  al: {
    client_id: "krack-client-al",
    client_secret: "k4a4yBrqW54L@uX_^p8EMGDFb?qj*TKe"
  }
};
/**this is a dirty method need be change for replace or environments in build time */
export let app: { name: "sga" | "al" } = {
  name: 'sga'
};
