import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {MarketplacesService} from '../../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';
import {MarketplacesMgaService} from '../../../../../services/src/lib/endpoint/marketplaces-mga/marketplaces-mga.service';
import {IntermediaryService} from "@suite/services";

@Component({
  selector: 'suite-new-rule',
  templateUrl: './update-operator-rule.component.html',
  styleUrls: ['./update-operator-rule.component.scss']
})
export class UpdateOperatorRuleComponent implements OnInit {

  private provinces;
  private countries;
  private markets;
  private logisticsOperators;
  private warehousesOrigins;
  private warehousesDestinies;
  private rules;
  private dataBody;
  private isChecked = {'isChecked': false};
  private marketsCheck;
  private provincesCheck;
  private countriesCheck;
  private warehousesOriginsCheck;
  private warehousesDestiniesCheck;
  private operatorSelected;
  private selectMarkets = false;
  private selectProvinces = false;
  private selectCountries = false;
  private selectWarehousesOrigins = false;
  private selectWarehousesDestinies = false;
  private activateButton = {'markets': true, 'warehousesOrigins': true, 'warehousesDestinies': true, 'provinces': true, 'countries': true, 'logisticOperator': true};
  private elementRule;
  private selectedOperator;

  constructor(private modalController: ModalController,
              private renderer: Renderer2,
              private marketplacesService: MarketplacesService,
              private marketplacesMgaService: MarketplacesMgaService,
              private intermediaryService: IntermediaryService,
              private navParams: NavParams,) {
  }

  ngOnInit() {
    this.provinces = '';
    this.countries = '';
    this.markets = '';
    this.rules = '';
    this.warehousesOrigins = '';
    this.warehousesDestinies = '';
    this.dataBody = '';
    this.marketsCheck = [];
    this.provincesCheck = [];
    this.countriesCheck = [];
    this.warehousesOriginsCheck = [];
    this.warehousesDestiniesCheck = [];
    this.operatorSelected = '';
    this.elementRule = this.navParams.get('element');

    this.marketplacesMgaService.getProvinces().subscribe(count => {
      this.provinces = count;
      this.checkAlreadySeleted(this.provinces, this.elementRule.provincia);
      this.initSelectedChecked(this.provinces, 'province');
      if(this.provinces.length > 5){
        document.getElementById('mat-expantion-provinces').style.maxHeight = '280px';
        document.getElementById('mat-expantion-provinces').style.overflowY = 'scroll';
        document.getElementById('mat-expantion-provinces').style.marginRight = '-25px';
        document.getElementById('ion-list-provinces').style.paddingRight = '25px';
      }
    });

    this.marketplacesMgaService.getCountries().subscribe(count => {
      this.countries = count;
      this.checkAlreadySeleted(this.countries, this.elementRule.pais);
      this.initSelectedChecked(this.countries, 'country');
      if(this.countries.length > 5){
        document.getElementById('mat-expantion-countries').style.maxHeight = '280px';
        document.getElementById('mat-expantion-countries').style.overflowY = 'scroll';
        document.getElementById('mat-expantion-countries').style.marginRight = '-25px';
        document.getElementById('ion-list-countries').style.paddingRight = '25px';
      }
    });

    this.marketplacesMgaService.getMarkets().subscribe(count => {
      this.markets = count;
      this.checkAlreadySeleted(this.markets, this.elementRule.marketplace);
      this.initSelectedChecked(this.markets, 'market');
      if(this.markets.length > 5){
        document.getElementById('mat-expantion-markets').style.maxHeight = '280px';
        document.getElementById('mat-expantion-markets').style.overflowY = 'scroll';
        document.getElementById('mat-expantion-markets').style.marginRight = '-25px';
        document.getElementById('ion-list-markets').style.paddingRight = '25px';
      }
    });

    this.marketplacesMgaService.getWarehouse().subscribe(count => {
      this.warehousesOrigins = count;
      this.checkAlreadySeleted(this.warehousesOrigins, this.elementRule.warehouseOrigin);
      this.initSelectedChecked(this.warehousesOrigins, 'warehousesOrigins');
      if(this.warehousesOrigins.length > 5){
        document.getElementById('mat-expantion-warehouses-origins').style.maxHeight = '280px';
        document.getElementById('mat-expantion-warehouses-origins').style.overflowY = 'scroll';
        document.getElementById('mat-expantion-warehouses-origins').style.marginRight = '-25px';
        document.getElementById('ion-list-warehouses-origins').style.paddingRight = '25px';
      }
    });

    this.marketplacesMgaService.getWarehouse().subscribe(count => {
      this.warehousesDestinies = count;
      this.checkAlreadySeleted(this.warehousesDestinies, this.elementRule.warehouseDestiny);
      this.initSelectedChecked(this.warehousesDestinies, 'warehousesDestinies');
      if(this.warehousesDestinies.length > 5){
        document.getElementById('mat-expantion-warehouses-destinies').style.maxHeight = '280px';
        document.getElementById('mat-expantion-warehouses-destinies').style.overflowY = 'scroll';
        document.getElementById('mat-expantion-warehouses-destinies').style.marginRight = '-25px';
        document.getElementById('ion-list-warehouses-destinies').style.paddingRight = '25px';
      }
    });

    this.marketplacesMgaService.getLogisticsOperators().subscribe(count => {
      this.logisticsOperators = count;
      this.selectAlreadySeleted(this.logisticsOperators, this.elementRule.operadorLogistico);
      this.operatorsSelected(this.logisticsOperators);
    });
  }

  private checkAlreadySeleted(completeList, currentList) {
    for (let element of currentList) {
      const elementInCompleteList = completeList.find(e => e.id == element.id);
      if (elementInCompleteList) {
        elementInCompleteList.isChecked = true;
      }
    }
  }

  private selectAlreadySeleted(completeList, currentList) {
    for (let element of currentList) {
      const elementInCompleteList = completeList.find(e => e.id == element.id);
      if (elementInCompleteList) {
        this.selectedOperator = element.name;
      }
    }
  }

  removeItem(arr, item){
    let i = arr.indexOf(item);
    arr.splice(i, 1);
  }

  initSelectedChecked(elements, element){
    switch(element) {
      case 'market':
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].isChecked === true) {
            this.marketsCheck.push(elements[i]);
          }
        }
        break;
      case 'warehousesOrigins':
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].isChecked === true) {
            this.warehousesOriginsCheck.push(elements[i]);
          }
        }
        break;
      case 'warehousesDestinies':
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].isChecked === true) {
            this.warehousesDestiniesCheck.push(elements[i]);
          }
        }
        break;
      case 'province':
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].isChecked === true) {
            this.provincesCheck.push(elements[i]);
          }
        }
        break;
      case 'country':
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].isChecked === true) {
            this.countriesCheck.push(elements[i]);
          }
        }
        break;
      case 'logistic-operator':
        this.operatorSelected = this.elementRule.operadorLogistico.id;
        this.activateButton.logisticOperator = true;
        break;
    }
  }

  marketsSelected(market){
    if(market.isChecked === true){
      this.marketsCheck.push(market);
      if(this.marketsCheck.length > 0){
        this.activateButton.markets = true;
      }
    }else{
      this.removeItem(this.marketsCheck, market);
      if(this.marketsCheck.length === 0){
        this.activateButton.markets = false;
      }
    }
  }

  warehousesOriginsSelected(warehouse){
    if(warehouse.isChecked === true){
      this.warehousesOriginsCheck.push(warehouse);
      if(this.warehousesOriginsCheck.length > 0){
        this.activateButton.warehousesOrigins = true;
      }
    }else{
      this.removeItem(this.warehousesOriginsCheck, warehouse);
      if(this.warehousesOriginsCheck.length === 0){
        this.activateButton.warehousesOrigins = false;
      }
    }
  }

  warehousesDestiniesSelected(warehouse){
    if(warehouse.isChecked === true){
      this.warehousesDestiniesCheck.push(warehouse);
      if(this.warehousesDestiniesCheck.length > 0){
        this.activateButton.warehousesDestinies = true;
      }
    }else{
      this.removeItem(this.warehousesDestiniesCheck, warehouse);
      if(this.warehousesDestiniesCheck.length === 0){
        this.activateButton.warehousesDestinies = false;
      }
    }
  }

  provincesSelected(province){
    if(province.isChecked === true){
      this.provincesCheck.push(province);
      if(this.provincesCheck.length > 0){
        this.activateButton.provinces = true;
      }
    }else{
      this.removeItem(this.provincesCheck, province);
      if(this.provincesCheck.length === 0){
        this.activateButton.provinces = false;
      }
    }
  }

  countriesSelected(country){
    if(country.isChecked === true){
      this.countriesCheck.push(country);
      if(this.countriesCheck.length > 0){
        this.activateButton.countries = true;
      }
    }else{
      this.removeItem(this.countriesCheck, country);
      if(this.countriesCheck.length === 0){
        this.activateButton.countries = false;
      }
    }
  }

  operatorsSelected(operator){
    for(let i = 0; i < this.logisticsOperators.length; i++){
      if(operator === this.logisticsOperators[i].name){
        this.operatorSelected = this.logisticsOperators[i].id;
        this.activateButton.logisticOperator = true;
      }
    }
  }

  updateRules(){
    this.dataBody = {
      "id": this.elementRule.idRule,
      "logisticOperator": this.operatorSelected,
      "markets": this.marketsCheck,
      "warehousesOrigins": this.warehousesOriginsCheck,
      "warehousesDestinies": this.warehousesDestiniesCheck,
      "provinces": this.provincesCheck,
      "countries": this.countriesCheck
    };

    this.marketplacesMgaService.updateRules(this.dataBody).subscribe(count => {
      this.rules = count;
      this.intermediaryService.presentToastSuccess("Regla guardada con éxito");
      this.modalController.dismiss(null);
    }, error => {
      this.intermediaryService.presentToastError("Error al guardar la regla");
      this.modalController.dismiss(null);
    });
  }

  openSelects(select){
    if(select === 'markets'){
      this.selectMarkets = true;
      this.selectWarehousesOrigins = false;
      this.selectWarehousesDestinies = false;
      this.selectProvinces = false;
      this.selectCountries = false;
    }
    if(select === 'warehousesOrigins'){
      this.selectWarehousesOrigins = true;
      this.selectWarehousesDestinies = false;
      this.selectMarkets = false;
      this.selectProvinces = false;
      this.selectCountries = false;
    }
    if(select === 'warehousesDestinies'){
      this.selectWarehousesDestinies = true;
      this.selectWarehousesOrigins = false;
      this.selectMarkets = false;
      this.selectProvinces = false;
      this.selectCountries = false;
    }
    if(select === 'provinces'){
      this.selectProvinces = true;
      this.selectMarkets = false;
      this.selectWarehousesOrigins = false;
      this.selectWarehousesDestinies = false;
      this.selectCountries = false;
    }
    if(select === 'countries'){
      this.selectCountries = true;
      this.selectProvinces = false;
      this.selectMarkets = false;
      this.selectWarehousesOrigins = false;
      this.selectWarehousesDestinies = false;
    }
    if(select === 'logistic-operator'){
      this.selectCountries = false;
      this.selectProvinces = false;
      this.selectMarkets = false;
      this.selectWarehousesOrigins = false;
    }
  }

  close(data) {
    this.modalController.dismiss(data);
  }

}
