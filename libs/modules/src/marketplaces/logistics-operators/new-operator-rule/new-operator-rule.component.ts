import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {MarketplacesService} from '../../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';
import {MarketplacesMgaService} from '../../../../../services/src/lib/endpoint/marketplaces-mga/marketplaces-mga.service';
import {IntermediaryService} from "@suite/services";

@Component({
  selector: 'suite-new-rule',
  templateUrl: './new-operator-rule.component.html',
  styleUrls: ['./new-operator-rule.component.scss']
})
export class NewOperatorRuleComponent implements OnInit {

  private provinces;
  private countries;
  private markets;
  private logisticsOperators;
  private rules;
  private dataBody;
  private isChecked = {'isChecked': false};
  private marketsCheck;
  private provincesCheck;
  private countriesCheck;
  private operatorSelected;
  private selectMarkets = false;
  private selectProvinces = false;
  private selectCountries = false;
  private activateButton = {'markets': false, 'provinces': false, 'countries': false, 'logisticOperator': false};

  constructor(private modalController: ModalController,
              private renderer: Renderer2,
              private marketplacesService: MarketplacesService,
              private marketplacesMgaService: MarketplacesMgaService,
              private intermediaryService: IntermediaryService,) {
  }

  ngOnInit() {
    this.provinces = '';
    this.countries = '';
    this.markets = '';
    this.rules = '';
    this.dataBody = '';
    this.marketsCheck = [];
    this.provincesCheck = [];
    this.countriesCheck = [];
    this.operatorSelected = '';

    this.marketplacesMgaService.getProvinces().subscribe(count => {
      this.provinces = count;
      if(this.provinces.length > 5){
        document.getElementById('mat-expantion-provinces').style.maxHeight = '280px';
        document.getElementById('mat-expantion-provinces').style.overflowY = 'scroll';
        document.getElementById('mat-expantion-provinces').style.marginRight = '-25px';
        document.getElementById('ion-list-provinces').style.paddingRight = '25px';
      }
    });

    this.marketplacesMgaService.getCountries().subscribe(count => {
      this.countries = count;
      if(this.countries.length > 5){
        document.getElementById('mat-expantion-countries').style.maxHeight = '280px';
        document.getElementById('mat-expantion-countries').style.overflowY = 'scroll';
        document.getElementById('mat-expantion-countries').style.marginRight = '-25px';
        document.getElementById('ion-list-countries').style.paddingRight = '25px';
      }
    });

    this.marketplacesMgaService.getMarkets().subscribe(count => {
      this.markets = count;
      if(this.markets.length > 5){
        document.getElementById('mat-expantion-markets').style.maxHeight = '280px';
        document.getElementById('mat-expantion-markets').style.overflowY = 'scroll';
        document.getElementById('mat-expantion-markets').style.marginRight = '-25px';
        document.getElementById('ion-list-markets').style.paddingRight = '25px';
      }
    });

    this.marketplacesMgaService.getLogisticsOperators().subscribe(count => {
      this.logisticsOperators = count;
    });
  }

  removeItem(arr, item){
    let i = arr.indexOf(item);
    arr.splice(i, 1);
  }

  marketsSelected(market){
    if(market.isChecked === true){
      this.marketsCheck.push(market);
      console.log('MARKETS --> ',this.marketsCheck);
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

  provincesSelected(province){
    if(province.isChecked === true){
      this.provincesCheck.push(province);
      console.log('PROVINCES --> ',this.provincesCheck);
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
      console.log('COUNTRIES --> ',this.countriesCheck);
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
        console.log('OPERATOR --> ',this.logisticsOperators[i].name);
        this.operatorSelected = this.logisticsOperators[i].id;
        this.activateButton.logisticOperator = true;
      }
    }
  }

  createRules(){
    this.dataBody = {
      "logisticOperator": this.operatorSelected,
      "markets": this.marketsCheck,
      "provinces": this.provincesCheck,
      "countries": this.countriesCheck
    };

    this.marketplacesMgaService.createRules(this.dataBody).subscribe(count => {
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
      this.selectProvinces = false;
      this.selectCountries = false;
    }
    if(select === 'provinces'){
      this.selectProvinces = true;
      this.selectMarkets = false;
      this.selectCountries = false;
    }
    if(select === 'countries'){
      this.selectCountries = true;
      this.selectProvinces = false;
      this.selectMarkets = false;
    }
    if(select === 'logistic-operator'){
      this.selectCountries = false;
      this.selectProvinces = false;
      this.selectMarkets = false;
    }
  }

  close(data) {
    this.modalController.dismiss(data);
  }

}
