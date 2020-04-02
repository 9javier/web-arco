import { BehaviorSubject, of, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, Sort } from '@angular/material';
import * as Filesave from 'file-saver';
import * as _ from 'lodash';
import { parse } from 'querystring';
import { NgxFileDropModule } from  'ngx-file-drop' ;
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Platform, ModalController, NavParams  } from '@ionic/angular';
import {MatTabsModule} from '@angular/material/tabs';
import { SelectionModel } from '@angular/cdk/collections';
import { ExpeditionManualService } from '../../../../services/src/lib/endpoint/expedition-manual/expedition-manual.service';
import { FormsModule } from '@angular/forms';
import { IntermediaryService } from '../../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'suite-new-incidence',
  templateUrl: './new-incidence.component.html',
  styleUrls: ['./new-incidence.component.scss']
})

export class NewIncidenceComponent implements OnInit {
  form: FormGroup;
  operators;
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private expeManSrv: ExpeditionManualService,
    private intermediaryServiceL: IntermediaryService,
    private navParams :NavParams
    ) {
  }
  ngOnInit(){
    
    this.getTransports();
    this.form = this.formBuilder.group({
      operator: new FormControl(''),
      name: new FormControl(''),
      lastname: new FormControl(''),
      dni: new FormControl(''),
      phone: new FormControl(''),
      direction: new FormControl(''),
      province: new FormControl(''),
      country: new FormControl(''),
      postalcode: new FormControl(''),
      referenceExpedition: new FormControl(''),
      packages: new FormControl(''),
      packagesReference: new FormControl(''),
      packagesWeight: new FormControl(''),
      incidence: false
    })
  }

  getTransports(){
    this.expeManSrv.getTrasnport().subscribe(data => {
      console.log(data);
      this.operators = data;
    });
  }

  save(){
      this.expeManSrv.store(this.form.value).subscribe(data => {
        console.log(data);
        this.intermediaryServiceL.presentToastSuccess('Expedicion guardada con exito');
        this.close();
      },error=>{
        console.log(error);
        this.intermediaryServiceL.presentToastError('Algunos de sus datos son incorrectos por favor de revisar');
      });
  }

  close(){
    this.modalController.dismiss();
  }

  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.id == e2.id : e1 == e2;
  }

  selectChange(e){
    console.log(e);
  }
}
