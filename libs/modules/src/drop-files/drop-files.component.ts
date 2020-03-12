import { BehaviorSubject, of, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, Sort } from '@angular/material';
import * as Filesave from 'file-saver';
import * as _ from 'lodash';
import { parse } from 'querystring';
import { NgxFileDropModule } from  'ngx-file-drop' ;
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { DropFilesService } from '../../../services/src/lib/endpoint/drop-files/drop-files.service';
import { Platform, ModalController } from '@ionic/angular';
import { IntermediaryService } from '../../../services/src/';

@Component({
  selector: 'suite-drop-files',
  templateUrl: './drop-files.component.html',
  styleUrls: ['./drop-files.component.scss']
})

export class DropFilesComponent {

  public files: NgxFileDropEntry[] = [];
  constructor(
    private dropFileSrv: DropFilesService,
    private modalController: ModalController,
    private intermediary: IntermediaryService,
    ) {
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          
          // You could upload it like this:
          const formData = new FormData()
          formData.append('file', file, droppedFile.relativePath)

          this.dropFileSrv.uploadFile(formData).subscribe( 
          resp => {
            this.dropFileSrv.setImage(resp.data)
            this.modalController.dismiss()
          },
          err => {
            this.intermediary.presentToastError('ocurrio un erro al subir la imagen')
            this.intermediary.dismissLoading()
          },
          () => {
            this.intermediary.presentToastSuccess('Imagen guardada exitosamente')
            this.intermediary.dismissLoading()
          });
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
  
}
