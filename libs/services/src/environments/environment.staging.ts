export const environment = {
  production: false,
  apiBasePhoto: 'http://localhost:8081',
  apiBase: 'http://192.168.254.109:8080/api',
  apiSorter: 'http://192.168.254.109:8080/api',
  urlBase: 'http://192.168.254.109:8080',
  uploadFiles: 'http://192.168.254.109:8081/api/upload-files',
  downloadPdf: 'http://192.168.254.109:8081',
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
