import { Component } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { DropFilesService } from '../../../services/src/lib/endpoint/drop-files/drop-files.service';
import { ModalController } from '@ionic/angular';
import { IntermediaryService } from '../../../services/src/';
import {TimesToastType} from "../../../services/src/models/timesToastType";
import {PositionsToast} from "../../../services/src/models/positionsToast.type";

@Component({
  selector: 'suite-drop-files',
  templateUrl: './drop-files.component.html',
  styleUrls: ['./drop-files.component.scss']
})

export class DropFilesComponent {
  type: string;
  public files: NgxFileDropEntry[] = [];
  constructor(
    private dropFileSrv: DropFilesService,
    private modalController: ModalController,
    private intermediary: IntermediaryService,
    ) {
  }

  public async dropped(files: NgxFileDropEntry[]) {
    await this.intermediary.presentLoadingNew('Guardando archivo...');

    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          // You could upload it like this:
          const formData = new FormData();
          formData.append('file', file, droppedFile.relativePath);
          if (this.type == 'archive') {
            this.dropFileSrv.uploadReturnArchive(formData).subscribe(
              resp => {
                this.dropFileSrv.setImage(resp.data);
                this.intermediary.presentToastSuccess('Archivo subido y guardado correctamente en el repositorio.', TimesToastType.DURATION_SUCCESS_TOAST_3750);
                this.modalController.dismiss();
              },
              err => {
                this.intermediary.presentToastError('Ha ocurrido un error al intentar subir el archivo al repositorio.', PositionsToast.TOP, TimesToastType.DURATION_ERROR_TOAST);
              }, () => this.intermediary.dismissLoadingNew());
          } else {
            if (this.type == 'delivery_note') {
              this.dropFileSrv.uploadReturnDeliveryNote(formData).subscribe(
                resp => {
                  this.dropFileSrv.setImage(resp.data);
                  this.intermediary.presentToastSuccess('Archivo subido y guardado correctamente en el repositorio.', TimesToastType.DURATION_SUCCESS_TOAST_3750);
                  this.modalController.dismiss();
                },
                err => {
                  this.intermediary.presentToastError('Ha ocurrido un error al intentar subir el archivo al repositorio.', PositionsToast.TOP, TimesToastType.DURATION_ERROR_TOAST);
                }, () => this.intermediary.dismissLoadingNew());
            } else {
              this.dropFileSrv.uploadFile(formData).subscribe(
                resp => {
                  this.dropFileSrv.setImage(resp.data);
                  this.intermediary.presentToastSuccess('Archivo subido y guardado correctamente en el repositorio.', TimesToastType.DURATION_SUCCESS_TOAST_3750);
                  this.modalController.dismiss();
                },
                err => {
                  this.intermediary.presentToastError('Ha ocurrido un error al intentar subir el archivo al repositorio.', PositionsToast.TOP, TimesToastType.DURATION_ERROR_TOAST);
                }, () => this.intermediary.dismissLoadingNew());
            }
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }

  public close(){
    this.modalController.dismiss();
  }
}
