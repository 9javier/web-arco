import {Component, OnInit, Renderer2} from '@angular/core';
import {MarketplacesService} from '../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';
import {MarketplacesMgaService} from '../../../../services/src/lib/endpoint/marketplaces-mga/marketplaces-mga.service';
import {ModalController} from '@ionic/angular';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from "@angular/material/table";
import {NewOperatorRuleComponent} from "./new-operator-rule/new-operator-rule.component";
import {IntermediaryService} from "@suite/services";
import {UpdateOperatorRuleComponent} from "./update-operator-rule/update-operator-rule.component";

@Component({
  selector: 'logistics-operators',
  templateUrl: './logistics-operators.component.html',
  styleUrls: ['./logistics-operators.component.scss']
})
export class LogisticsOperators implements OnInit {

  displayedColumns: string[] = ['select', 'marketplace', 'warehouseOrigin', 'warehouseDestiny', 'provincia', 'pais', 'operadorLogistico'];
  private dataSource;
  private operatorsRules;
  private operator = [];
  private provinces  = [];
  private countries  = [];
  private markets = [];
  private warehousesOrigins = [];
  private warehousesDestinies = [];
  private idRule;
  private rulesData = [];
  private selection;

  constructor (private modalController: ModalController,
              private renderer: Renderer2,
              private marketplacesService: MarketplacesService,
              private marketplacesMgaService: MarketplacesMgaService,
              private intermediaryService: IntermediaryService,) {
  }

  ngOnInit() {
    this.tableDataLoad();
  }

  tableDataLoad(){
    this.operatorsRules = '';

    this.marketplacesMgaService.getAllRules().subscribe(count => {
      this.operatorsRules = count;
      this.rulesData = [];

      for(let i = 0; i < this.operatorsRules.length; i++){
        this.operator.push({id: this.operatorsRules[i].logisticOperator.id, name: this.operatorsRules[i].logisticOperator.name});
        this.idRule = this.operatorsRules[i].id;

        for (let x = 0; x < this.operatorsRules[i].markets.length; x++) {
          this.markets.push({id: this.operatorsRules[i].markets[x].id, name: this.operatorsRules[i].markets[x].name});
        }
        for (let x = 0; x < this.operatorsRules[i].warehousesOrigins.length; x++) {
          this.warehousesOrigins.push({id: this.operatorsRules[i].warehousesOrigins[x].id, name: this.operatorsRules[i].warehousesOrigins[x].name});
        }
        for (let x = 0; x < this.operatorsRules[i].warehousesDestinies.length; x++) {
          this.warehousesDestinies.push({id: this.operatorsRules[i].warehousesDestinies[x].id, name: this.operatorsRules[i].warehousesDestinies[x].name});
        }
        for (let z = 0; z < this.operatorsRules[i].provinces.length; z++) {
          this.provinces.push({id: this.operatorsRules[i].provinces[z].id, name: this.operatorsRules[i].provinces[z].name});
        }
        for (let s = 0; s < this.operatorsRules[i].countries.length; s++) {
          this.countries.push({id: this.operatorsRules[i].countries[s].id, name: this.operatorsRules[i].countries[s].name});
        }
        this.rulesData.push({idRule: this.idRule, marketplace: this.markets, warehouseOrigin: this.warehousesOrigins, warehouseDestiny: this.warehousesDestinies, provincia: this.provinces, pais: this.countries, operadorLogistico: this.operator});

        this.operator = [];
        this.markets = [];
        this.warehousesOrigins = [];
        this.warehousesDestinies = [];
        this.provinces = [];
        this.countries = [];
      }

      this.dataSource = new MatTableDataSource(this.rulesData);
      this.selection = new SelectionModel(true, []);
    });
  }

  isAllSelected() {
    const numSelected = this.selection['selected'].length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  async addOperatorRule(ruleFilterType){
    let modal = await this.modalController.create({
      component: NewOperatorRuleComponent,
      componentProps: {
        ruleFilterType,
        mode: 'create'
      }
    });

    modal.onDidDismiss().then((data) => {
      this.tableDataLoad();
    });
    modal.present();
  }

  async updateOperatorRule(event, element){
    event.stopPropagation();
    event.preventDefault();

    let modal = await this.modalController.create({
      component: UpdateOperatorRuleComponent,
      componentProps: {
        element,
        mode: 'update'
      }
    });

    modal.onDidDismiss().then((data) => {
      this.tableDataLoad();
    });
    modal.present();
  }

  confirmDeletion():void{
    this.intermediaryService.presentConfirm("¿Está seguro de eliminar las reglas seleccionadas?",()=>{
      this.deleteRules();
    });
  }

  async deleteRules(){
    let rules = this.selection['selected'];
    if(rules.length > 0){
      for(let i = 0; i < rules.length; i++){
        await this.marketplacesMgaService.deleteRules(rules[i].idRule).subscribe(count => {
          this.tableDataLoad();
          this.intermediaryService.presentToastSuccess("Reglas eliminadas con éxito");
        }, error => {
          this.tableDataLoad();
          this.intermediaryService.presentToastError("Error al eliminar las reglas");
        });
      }
    }
  }

  public getNames(list): string {
    return list.map(i => i.name).join(', ');
  }

}
