import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IntermediaryService } from '../../../../../services/src/';
import {environment, UploadFilesService} from "@suite/services";
import {ModalReviewComponent} from "../../../components/modal-defective/ModalReview/modal-review.component";

@Component({
  selector: 'suite-view-files',
  templateUrl: './view-files.component.html',
  styleUrls: ['./view-files.component.scss']
})

export class ViewFilesComponent implements OnInit{
  private baseUrlPhoto = environment.apiBasePhoto;
  type: string;
  images: any[];
  files;
  constructor(
    private modalController: ModalController,
    private intermediary: IntermediaryService,
    private uploadService: UploadFilesService,
  ) {
  }

  ngOnInit() {
    setTimeout(() => this.files = this.images, 500);
  }

  deleteImage(item, index, arr) {
    this.intermediary.presentLoading()
    this.uploadService.deleteFile(item.id).subscribe(
      resp => {
        this.intermediary.presentToastSuccess('Archivo borrado exitosamente')
        arr.splice(index, 1);
        //this.signature = false;
      },
      err => {
        this.intermediary.presentToastError('Ocurrio un error al borrar el archivo')
        this.intermediary.dismissLoading()
      },
      () => {
        this.intermediary.dismissLoading()
      }
    )
  }

  async openReviewImage(item) {
    const modal = await this.modalController.create({
      component: ModalReviewComponent,
      componentProps: {
        data: item
      }
    });
    await modal.present();
  }

  public close(){
    this.modalController.dismiss();
  }
}
