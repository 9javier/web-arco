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
  selector: 'suite-logistic-operator',
  templateUrl: './logistic-operator.component.html',
  styleUrls: ['./logistic-operator.component.scss']
})

export class LogisticOperatorComponent implements OnInit {
  id;
  data = {
    operator: {
      id:"",
      name:""
    },
    name: "",
    lastname: "",
    dni: "",
    phone: "",
    direction: "",
    province: "",
    country: "",
    postalcode: "",
    packages: "",
    incidence: true
  };

  form: FormGroup;
  operators;
  selected;
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private expeManSrv: ExpeditionManualService,
    private intermediaryServiceL: IntermediaryService,
    private navParams :NavParams
    ) {
  }
  ngOnInit(){
    
    this.id = this.navParams.get('id');
    this.getIncidence(this.id);
    this.getTransports();
    this.form = this.formBuilder.group({
      id:this.id,
      operator: new FormControl(''),
      name: new FormControl(''),
      lastname: new FormControl(''),
      dni: new FormControl(''),
      phone: new FormControl(''),
      direction: new FormControl(''),
      province: new FormControl(''),
      country: new FormControl(''),
      postalcode: new FormControl(''),
      packages: new FormControl(''),
      incidence: true
    })
  }

  getIncidence(id){
    this.expeManSrv.getExpedition(id).subscribe(data => {
      this.form.get('operator').setValue(data.transport.transport.id);
      this.form.get('name').setValue(data.transport.shippingCompanyName);
      this.form.get('lastname').setValue(data.transport.shippingCompanyName)
      this.form.get('dni').setValue(data.transport.shippingCompanyName)
      this.form.get('phone').setValue(data.transport.shippingPhone)
      this.form.get('direction').setValue(data.transport.invoiceAddressee1)
      this.form.get('province').setValue(data.transport.invoiceProvince)
      this.form.get('country').setValue(data.transport.invoiceCountry)
      this.form.get('postalcode').setValue(data.transport.invoiceZipCode)
      this.form.get('packages').setValue(data.countPackage)
    });
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
        this.intermediaryServiceL.presentToastSuccess('Expedicion guardad con exito');
        this.close();
      },error=>{
        console.log(error);
        this.intermediaryServiceL.presentToastError('Algunos de sus datos son incorrectos por favor de revisar');
      });
      console.log(this.data);
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
