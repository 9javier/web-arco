import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions, FileUploadResult } from '@ionic-native/file-transfer/ngx';
import { environment } from '../../environments/environment';
import { IntermediaryService } from '../../lib/endpoint/intermediary/intermediary.service';


@Injectable({
  providedIn: 'root'
})
export class FileUploadProvider {
  apiURL: string = environment.uploadFiles

  constructor(
    private transfer: FileTransfer,
    private intermediaryService: IntermediaryService,
  ) { }

  async uploadImage(imgData: string) {
    if (!imgData || imgData.length == 0) {
      this.intermediaryService.presentToastError('Debe seleccionar una imagen o tomar una foto')
      return
    }
    this.intermediaryService.presentLoading()
    // Destination URL
    let url = this.apiURL;

    // File for Upload
    var targetPath = imgData;
    const imgDataSplit = imgData.split('/')
    let name = imgDataSplit[imgDataSplit.length - 1]
    if (name.split('?').length > 1) {
      name = name.split('?')[0]
    }


    const options: FileUploadOptions = {
      fileKey: 'file',
      chunkedMode: false,
      mimeType: 'image/png',
      fileName: name
      // params: { 'desc': desc }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    return fileTransfer.upload(targetPath, url, options)
      // .then((result: FileUploadResult) => {
      //   this.intermediaryService.dismissLoading()
      //   const response: any = JSON.parse(result.response)
      //   console.log('response: ', response);

      //   imgUrl = response.data
      //   this.intermediaryService.presentToastSuccess('la imagen cargada correctamente')

      // })
      // .catch(
      //   e => {
      //     console.log(e);

      //     this.intermediaryService.dismissLoading()
      //     const error = JSON.parse(e.body)
      //     this.intermediaryService.presentToastError(error.errors)
      //   }
      // );

  }

}
