export const environment = {
  production: true,
  printerRequired: true,
  apiBasePhoto: 'http://198.168.254.112:8080',
  apiBase: 'http://192.168.254.111:8080/api',
  apiSorter: 'http://192.168.254.111:8080/api',
  apiLogisticOperator: 'http://198.199.69.32:8080/api',
  apiRule: 'http://192.168.254.112:8080',
  apiMiddleware: 'http://192.168.254.111:8080/api',
  urlBase: 'http://192.168.254.112:8080',
  uploadFiles: 'http://198.199.69.32:8080/api/upload-files',
  downloadFiles: 'http://198.199.69.32:8080',
  downloadPdf: 'http://198.199.69.32:8080',
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
