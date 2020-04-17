export const environment = {
  production: false,
  apiBasePhoto: 'http://localhost:8081',
  apiBase: 'http://localhost:8080/api',
  apiSorter: 'http://localhost:8080/api',
  urlBase: 'http://localhost:8080',
  uploadFiles: 'http://localhost:8081/api/upload-files',
  downloadFiles: 'http://localhost:8088',
  downloadPdf: 'http://localhost:3011',
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
