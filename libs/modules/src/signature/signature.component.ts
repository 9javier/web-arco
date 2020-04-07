import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Platform, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UploadFilesService, IntermediaryService } from '../../../services/src';

@Component({
  selector: 'suite-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit,OnChanges {

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  // signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
  //   'minWidth': 5,
  //   'canvasWidth': this.plt.width,
  //   'canvasHeight': 300
  // };
  dataUrl: string;
  constructor(
    private plt: Platform, 
    private router: Router,
    private uploadFile: UploadFilesService,
    private intermediary: IntermediaryService,
    private modalController: ModalController
  ) {
   
   }

  ngOnInit() {
    console.log(this.plt.width());
    
    
  }

  ngOnChanges(){
    
  }
  
  ngAfterViewInit() {
    console.log(this.signaturePad);
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.set('canvasWidth', this.plt.width())
    this.signaturePad.set('canvasHeight', this.plt.height())
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    this.dataUrl = this.signaturePad.toDataURL('png')
    console.log(this.dataUrl);
    this.uploadSignature()
    
  }
  dismiss() {
    // this.modalController.dismiss()
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
   
  }

  clear() {
    this.signaturePad.clear()
  }


  uploadSignature() {
    this.intermediary.presentLoading()
    this.uploadFile.uploadFileBase(this.dataUrl).subscribe(
      resp => {
        this.uploadFile.setSignature(resp)
        this.modalController.dismiss()
      },
      err => {
        this.intermediary.presentToastError('ocurrio un erro al subir firma')
        this.intermediary.dismissLoading()
      },
      () => {
        this.intermediary.presentToastSuccess('Firma guardada exitosamente')
        this.intermediary.dismissLoading()
      }
    )

  }

  async closeScreen(){
    const modal = await this.modalController.getTop();
    modal.dismiss();
  }

}
