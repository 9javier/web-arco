export const environment = {
  production: true,
  apiBase: 'http://mga.krack.es:8080/api',
  apiSorter: 'http://mga.krack.es:8080/api',
  urlBase: 'http://mga.krack.es:8080',
  uploadFiles: 'http://mga.krack.es:8081/api/upload-files',
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