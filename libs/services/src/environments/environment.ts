export const environment = {
  production: false,
  /*apiBase: 'http://localhost:8081/api',
  apiLogisticOperator: 'http://localhost:3052/api',
  apiSorter: 'http://localhost:8081/api',
  urlBase: 'http://localhost:8081',
  apiRule: "https://localhost:5001",
  apiMiddleware: "http://localhost:3002",
  apiBasePhoto: 'http://localhost:8081',
  uploadFiles: 'http://localhost:8081/api/upload-files',
  urlDownloadApp: 'https://drive.google.com/open?id=16DZzQ1hIArX5GF5oZtTpx3ltiPfCvw2K',*/
  apiBase: 'http://192.168.254.111:8080/api',
  apiLogisticOperator: 'http://192.168.254.111:3051/api',
  apiSorter: 'http://192.168.254.111:8080/api',
  urlBase: 'http://192.168.254.111:8080',
  apiRule: "http://192.168.254.111:5000",
  apiMiddleware: "http://192.168.254.111:3002",
  apiBasePhoto: 'http://192.168.254.111:8080',
  uploadFiles: 'http://192.168.254.111:8080/api/upload-files',
  urlDownloadApp: 'https://drive.google.com/open?id=16DZzQ1hIArX5GF5oZtTpx3ltiPfCvw2K',
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
