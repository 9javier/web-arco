export const environment = {
  production: true,
  printerRequired: true,
  apiBasePhoto: 'http://conexion1.globalretail.es:57355',
  apiBase: 'http://conexion1.globalretail.es:57355/api',
  apiSorter: 'http://conexion1.globalretail.es:57355/api',
  apiLogisticOperator: 'http://conexion1.globalretail.es:57355/api',
  apiRule: 'http://conexion1.globalretail.es:57355',
  apiMiddleware: 'http://conexion1.globalretail.es:57355/api',
  urlBase: 'http://conexion1.globalretail.es:57355',
  uploadFiles: 'http://conexion1.globalretail.es:57355/api/upload-files',
  downloadFiles: 'http://conexion1.globalretail.es:57355',
  downloadPdf: 'http://conexion1.globalretail.es:57355',
  urlDownloadApp: 'https://drive.google.com/open?id=1P3iyZ4P6hvmU84kSw7oALEokJ8rSStl2',
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
