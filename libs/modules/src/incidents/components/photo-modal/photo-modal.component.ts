import { Component, OnInit } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions, FileUploadResult } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { IntermediaryService, environment } from '../../../../../services/src';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'suite-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.scss']
})
export class PhotoModalComponent implements OnInit {
  apiURL: string = environment.uploadFiles
  imgData: string;
  imgUrl: any;
  constructor(
    private camera: Camera, 
    private transfer: FileTransfer,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController
    ) { }

  ngOnInit() {
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log(imageData);
      this.imgData = imageData
  
    }, (err) => {
      // Handle error
    });
  }
  searchPhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imgData = imageData
    }, (err) => {
      // Handle error
    })
  }
  async uploadImage() {
    if (!this.imgData || this.imgData.length == 0){
      this.intermediaryService.presentToastError('Debe seleccionar una imagen o tomar una foto')
      return
    }
    this.intermediaryService.presentLoading()
    // Destination URL
    let url = this.apiURL;

    // File for Upload
    var targetPath = this.imgData;
    const imgDataSplit = this.imgData.split('/')
    let name = imgDataSplit[imgDataSplit.length -1]
      if (name.split('?').length > 1) {
        name = name.split('?')[0]
      }


    var options: FileUploadOptions = {
      fileKey: 'file',
      chunkedMode: false,
      mimeType: 'image/png',
      fileName: name
      // params: { 'desc': desc }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options)
      .then((result: FileUploadResult) => {
        this.intermediaryService.dismissLoading()
        const response:any  = JSON.parse(result.response)
        console.log('response: ', response);
        
        this.imgUrl = response.data
        console.log('subido');
        this.intermediaryService.presentToastSuccess('la imagen cargada correctamente')
        
      })
      .catch(
        e =>{
          console.log(e);
          
          this.intermediaryService.dismissLoading()
          const error = JSON.parse(e.body)
          this.intermediaryService.presentToastError(error.errors)
        }
      );
    
  }

  back() {
    this.modalController.dismiss({
      imgUrl: this.imgUrl
    })
  }

}
