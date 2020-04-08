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
const FileSaver = require('file-saver');


@Component({
  selector: 'suite-new-incidence',
  templateUrl: './new-incidence.component.html',
  styleUrls: ['./new-incidence.component.scss']
})

export class NewIncidenceComponent implements OnInit {
  form: FormGroup;
  operators;
  warehouses;
  warehouseSelected = '';
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private expeManSrv: ExpeditionManualService,
    private intermediaryServiceL: IntermediaryService,
    private navParams :NavParams
    ) {
  }
  ngOnInit(){

    this.expeManSrv.getWarehouse().subscribe(data => {
      this.warehouses = data;
    });

    this.getTransports();
    this.form = this.formBuilder.group({
      operator: 'SEUR', //new FormControl(''),
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
    this.operators = [{id: 1, name: 'SEUR'}];
    /*this.expeManSrv.getTrasnport().subscribe(data => {
      console.log(data);
      this.operators = data;
    });*/
  }

  save(){
      /*this.expeManSrv.store(this.form.value).subscribe(data => {
        console.log(data);
        this.intermediaryServiceL.presentToastSuccess('Expedicion guardada con exito');
        this.close();
      },error=>{
        console.log(error);
        this.intermediaryServiceL.presentToastError('Algunos de sus datos son incorrectos por favor de revisar');
      });*/

    console.log('DATA DATA ---> ', this.form.value);
    const body = {
      warehouseReference: this.warehouseSelected['warehouseReference'],
      referenceExpedition: this.form.value.referenceExpedition,
      sender: {
        name: this.warehouseSelected['name'],
        address: this.warehouseSelected['address1'] + ' ' + this.warehouseSelected['address2'],
        country: this.warehouseSelected['country'].toUpperCase(),
        city: this.warehouseSelected['city'],
        zipCode: this.warehouseSelected['postcode'],
        phone: this.warehouseSelected['phone'].replace(/\(([^)]*)\)/g,'')
      },
      recipient: {
        name: this.form.value.name + ' '+ this.form.value.lastname,
        address: this.form.value.direction,
        country: this.form.value.country.toUpperCase(),
        city: this.form.value.province,
        zipCode: this.form.value.postalcode,
        phone: this.form.value.phone,
        contactName: this.form.value.name + ' '+ this.form.value.lastname,
      },
      packages: {
        packagesNum: this.form.value.packages,
        packageReference: this.form.value.packagesReference
      }
    };

    this.expeManSrv.createExpeditionSeur(body).subscribe(data => {

      if(body['recipient']['country'] !== 'ES'){
        for(let i = 0; i < parseInt(body['packages']['packagesNum']); i++) {
          const byteCharacters = atob(data[i]['tracking'][0]['label']);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {type: "text/zpl"});
          FileSaver.saveAs(blob, data[i]['tracking'][0]['uniqueCode']+'-label.zpl');
        }
      }else{
        const byteCharacters = atob(data['label']);
        const byteNumbers = new Array(byteCharacters.length);
        for(let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: "application/pdf"});
        FileSaver.saveAs(blob, 'label-'+data['expeditionReference']+'.pdf');
      }

      this.intermediaryServiceL.presentToastSuccess('Expedicion guardada con exito');
      this.close();
    }, error => {
      console.log('CONSOLE ERROR ---> ', error);
      this.intermediaryServiceL.presentToastError('Algunos de sus datos son incorrectos por favor de revisar');
    });
  }

  warehousesSelected(warehouse){
    for(let i = 0; i < this.warehouses.length; i++){
      if(warehouse === this.warehouses[i].name){
        this.warehouseSelected = this.warehouses[i];
        console.log('WAREHOUSE SELECTED ---> ',this.warehouses[i]);
      }
    }
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
