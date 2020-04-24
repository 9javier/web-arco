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
      marketId: new FormControl(''),
      warehouseOrigin: new FormControl(''),
      warehouseDestiny: new FormControl(''),
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
    const countryId = this.form.value.country.id;
    const provinceId = this.form.value.province.id;
    let operator = this.form.value.operator;

    if(operator === '') {
      let matchingrule;
      matchingrule = this.rules.find(rule => {
        let marketMatch = !rule.markets.length|| rule.markets.find(market => market.id == marketId);
        let warehouseOriginMatch = !rule.warehousesOrigins.length|| rule.warehousesOrigins.find(warehousesOrigin => warehousesOrigin.id == warehouseReference.id);
        let warehouseDestinyMatch = !rule.warehousesDestinies.length|| rule.warehousesDestinies.find(warehouseDestiny => warehouseDestiny.id == warehouseDestinySelect.id);
        let provinceMatch = !rule.provinces.length|| rule.provinces.find(province => province.id == provinceId);
        let countryMatch = !rule.countries.length|| rule.countries.find(country => country.id == countryId);
        return (marketMatch && warehouseOriginMatch && ((warehouseDestinyMatch || provinceMatch && countryMatch) || (warehouseDestinyMatch && provinceMatch && countryMatch)));
      });

      if(matchingrule === undefined){
        this.intermediaryServiceL.presentToastError('No existen reglas creadas. Selecciona un operador manualmente o crea las reglas.');
      }else{
        operator = matchingrule['logisticOperator']['name'];
      }
    }
    console.log('CALC OPERATOR --> ', operator);

    let recipient;
    if(this.form.value.warehouseDestiny != ''){
      recipient = {
        name: this.form.value.warehouseDestiny.name,
        address: this.form.value.warehouseDestiny.address1 + ' '+ this.form.value.warehouseDestiny.address2,
        country: this.form.value.warehouseDestiny.country.toUpperCase(),
        city: this.form.value.warehouseDestiny.city,
        zipCode: this.form.value.warehouseDestiny.postcode,
        phone: this.form.value.warehouseDestiny.phone.replace(/\(([^)]*)\)/g,''),
        contactName: this.form.value.warehouseDestiny.name
      }
    }else{
      recipient = {
        name: this.form.value.name + ' '+ this.form.value.lastname,
        address: this.form.value.direction,
        country: this.form.value.country.isoCode.toUpperCase(),
        city: this.form.value.province.name,
        zipCode: this.form.value.postalcode,
        phone: this.form.value.phone,
        contactName: this.form.value.name + ' '+ this.form.value.lastname
      }
    }

    const body = {
      marketId: marketId,
      operator: operator.toUpperCase(),
      warehouseReference: this.form.value.warehouseOrigin.warehouseReference,
      referenceExpedition: this.form.value.referenceExpedition,
      sender: {
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
          this.intermediaryServiceL.presentToastError('Algunos de sus datos son incorrectos');
        }
        console.log('RESPONSE -> ',data[i]);
      }
    }, error => {
      this.intermediaryServiceL.presentToastError('Algunos de sus datos son incorrectos');
    });
  }

  warehousesSelected(warehouse){
    for(let i = 0; i < this.warehouses.length; i++){
      if(warehouse === this.warehouses[i].name){
        this.warehouseSelected = this.warehouses[i];
      }
    }
  }

  operatorsSelected(operator){
    for(let i = 0; i < this.logisticsOperators.length; i++){
      if(operator === this.logisticsOperators[i].name){
        this.operatorSelected = this.logisticsOperators[i];
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
