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
  name;
  direction;
  postalcode;
  phone;
  email;
  selectedProvince;
  selectedCountry;
  market;
  country;
  province;
  regexPhone = /^([0-9\s])*$/;
  regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  regexNums = /^([0-9])*$/;
  form: FormGroup;
  operators;
  warehouses;
  warehouseSelected = '';
  operatorSelected = '';
  logisticsOperators = [];
  data;
  markets = [];
  countries = [];
  provinces = [];
  rules = [];

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
    this.getMarkets();
    this.getCountries();
    this.getProvinces();
    this.getRules();
    this.form = this.formBuilder.group({
      marketId: new FormControl('', Validators.required ),
      warehouseOrigin: new FormControl('', Validators.required ),
      warehouseDestiny: new FormControl(''),
      operator: new FormControl(''),
      name: new FormControl('', [ Validators.required, Validators.maxLength(25) ]),
      phone: new FormControl('', [ Validators.required, Validators.maxLength(12), Validators.pattern(this.regexPhone) ]),
      email: new FormControl('', [ Validators.required, Validators.pattern(this.regexEmail) ]),
      direction: new FormControl('', [ Validators.required, Validators.maxLength(30) ]),
      province: new FormControl('', Validators.required ),
      country: new FormControl('', Validators.required ),
      postalcode: new FormControl('', [ Validators.required, Validators.maxLength(5), Validators.pattern(this.regexNums) ]),
      referenceExpedition: new FormControl('', Validators.required ),
      packages: new FormControl('', [ Validators.required, Validators.pattern(this.regexNums) ]),
      packagesReference: new FormControl('', Validators.required ),
      packagesWeight: new FormControl('', [ Validators.required, Validators.pattern(this.regexNums) ]),
      incidence: false
    });
  }

  getTransports(){
    this.expeManSrv.getLogisticsOperators().subscribe(data => {
      this.logisticsOperators = data;
    });
  }

  getMarkets(){
    this.expeManSrv.getMarkets().subscribe(data => {
      this.markets = data;
    });
  }

  getCountries(){
    this.expeManSrv.getCountries().subscribe(data => {
      this.countries = data;
    });
  }

  getProvinces(){
    this.expeManSrv.getProvinces().subscribe(data => {
      this.provinces = data;
    });
  }

  getRules(){
    this.expeManSrv.getRules().subscribe(data => {
      this.rules = data;
    });
  }

  save(){
    const marketId = this.form.value.marketId.id;
    const warehouseReference = this.form.value.warehouseOrigin;
    const warehouseDestinySelect = this.form.value.warehouseDestiny;
    let operator = this.form.value.operator;

    let recipient;
    if(this.form.value.warehouseDestiny != ''){
      recipient = {
        warehouseDestinityId: warehouseDestinySelect.id,
        name: this.name,
        address: this.direction,
        country: this.form.value.warehouseDestiny.country.toUpperCase(),
        city: this.form.value.warehouseDestiny.city,
        zipCode: this.postalcode,
        phone: this.phone,
        email: this.email,
        contactName: this.name
      }
    }else{
      recipient = {
        name: this.form.value.name,
        address: this.form.value.direction,
        country: this.form.value.country.isoCode.toUpperCase(),
        city: this.form.value.province.name,
        zipCode: this.form.value.postalcode,
        phone: this.form.value.phone,
        email: this.form.value.email,
        contactName: this.form.value.name
      }
    }

    const body = {
      marketId: marketId,
      operator: operator.toUpperCase(),
      warehouseReference: this.form.value.warehouseOrigin.warehouseReference,
      referenceExpedition: this.form.value.referenceExpedition,
      sender: {
        warehouseOriginId: warehouseReference.id,
        name: this.form.value.warehouseOrigin.name,
        address: this.form.value.warehouseOrigin.address1 + ' ' + this.form.value.warehouseOrigin.address2,
        country: this.form.value.warehouseOrigin.country.toUpperCase(),
        city: this.form.value.warehouseOrigin.city,
        zipCode: this.form.value.warehouseOrigin.postcode,
        phone: this.form.value.warehouseOrigin.phone.replace(/\(([^)]*)\)/g,'')
      },
      recipient,
      packages: {
        packagesNum: this.form.value.packages,
        packageReference: this.form.value.packagesReference,
        kilos: this.form.value.packagesWeight
      }
    };
    console.log('BODY -> ', body);

    this.expeManSrv.createExpedition(body).subscribe(data => {
      for(let i = 0; i < data.length; i++){
        if(data[i].success === true){
          for(let x = 0; x < data[i]['labels'].length; x++){
            const byteCharacters = atob(data[i]['labels'][x]['label']);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const blob = new Blob([byteArray], {type: "application/pdf"});
            FileSaver.saveAs(blob, 'label-' + data[i]['tracking'] + '.pdf');
          }
          this.intermediaryServiceL.presentToastSuccess('Expedicion guardada con exito');
          this.close();
        }else{
          if(data[i].errorMessage !== undefined || data[i].errorMessage !== ''){
            this.intermediaryServiceL.presentToastError(data[i].errorMessage);
          }else{
            this.intermediaryServiceL.presentToastError('Algunos de sus datos son incorrectos');
          }
        }
        console.log('RESPONSE -> ',data[i]);
      }
    }, error => {
      this.intermediaryServiceL.presentToastError('Algunos de sus datos son incorrectos');
    });
  }

  warehousesSelected(warehouse){
    this.name = warehouse.name;
    this.direction = warehouse.address1 + ' '+ warehouse.address2;
    this.postalcode = warehouse.postcode;
    this.phone = warehouse.phone.replace(/\(([^)]*)\)/g,'');
    this.email = warehouse.email;

    for(let province of this.provinces){
      if(province.name.toUpperCase() === warehouse.city.toUpperCase().toString()){
        this.selectedProvince = province;
      }
    }

    for(let country of this.countries){
      if(country.isoCode === warehouse.country.toUpperCase()){
        this.selectedCountry = country;
      }
    }
  }

  operatorsSelected(operator){
    for(let i = 0; i < this.logisticsOperators.length; i++){
      if(operator === this.logisticsOperators[i].name){
        this.operatorSelected = this.logisticsOperators[i];
        console.log('OPERATOR -> ', this.operatorSelected);
      }
    }
  }

  countrySelected(country){

  }

  marketSelected(market){
    for(let i = 0; i < this.markets.length; i++){
      if(market.id === this.markets[i].id){
        let market = this.markets[i];
        return true;
      }else{
        return false;
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
