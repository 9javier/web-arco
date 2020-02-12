import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NewRuleComponent } from './new-rule/new-rule.component';
import { MarketplacesService } from '../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';
import { MatTableDataSource } from '@angular/material';
import { MarketplacesMgaService } from '../../../../services/src/lib/endpoint/marketplaces-mga/marketplaces-mga.service';

@Component({
  selector: 'suite-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  private dataSourceCategories;
  private dataSourceRulesCategories;
  private displayedCategoriesColumns;

  private dataSourceEnabling;
  private dataSourceRulesEnabling;
  private displayedEnablingColumns;

  private dataSourceStocks;
  private dataSourceRulesStocks;
  private displayedStocksColumns;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private marketplacesService: MarketplacesService,
    private marketplacesMgaService: MarketplacesMgaService
  ) { 
    console.log(this.route.snapshot.data['name']);
  }

  ngOnInit() {

    // LLAMAR AL ENDPOINT PARA RECOGER LOS DATOS. UNA VEZ OBTENIDOS, HABRÁ QUE AÑADIR CÓDIGO PARA CLASIFICAR LAS REGLAS SEGÚN SU TIPO DE FILTRO

    this.dataSourceCategories = [];
    this.dataSourceRulesCategories = new MatTableDataSource(this.dataSourceCategories);
    this.displayedCategoriesColumns = ['name', 'categories', 'products', 'edit'];

    this.dataSourceEnabling = [];
    this.dataSourceRulesEnabling = new MatTableDataSource(this.dataSourceEnabling);
    this.displayedEnablingColumns = ['name', 'categories', 'products', 'edit'];

    this.dataSourceStocks = [];
    this.dataSourceRulesStocks = new MatTableDataSource(this.dataSourceStocks);
    this.displayedStocksColumns = ['name', 'stock', 'products', 'edit'];



    /*this.marketplacesService.getRulesFilter().subscribe(data => {
      if(data) {
        data.forEach(rule => {
          if(rule.ruleFilterType == 1) {
            const dataCategoriesGet = this.dataSourceRulesCategories.data;
            let category = {
              id: rule.id,
              name: rule.name,
              action: "categories",
              filterType: "category",
              categoriesFilter: [
                {id: 78, group: 2, name: rule.dataGroup}
              ],
              minPriceFilter: "0.00",
              stockFilter: 0,
              products: 10,
              destinationCategories: [],
              stockToReduce: 0
            };

            dataCategoriesGet.push(category);
            this.dataSourceRulesCategories.data = dataCategoriesGet;
          } else if(rule.ruleFilterType == 2) {
            const dataPricesGet = this.dataSourceRulesPrice.data;
            let price = {
              id: rule.id,
              name: rule.name,
              filterType: "price",
              action: "categories",
              categoriesFilter: [
                {id: 78, group: 2, name: rule.dataGroup}
              ],
              minPriceFilter: rule.dataGroup,
              stockFilter: 0,
              products: 10,
              destinationCategories: [],
              stockToReduce: 0
            };

            dataPricesGet.push(price);
            this.dataSourceRulesPrice.data = dataPricesGet;
          } else if(rule.ruleFilterType == 3) {
            const dataStocksGet = this.dataSourceRulesStocks.data;
            let stock = {
              id: rule.id,
              name: rule.name,
              filterType: "stock",
              action: "stock",
              categoriesFilter: [],
              minPriceFilter: "0.00",
              stockFilter: rule.dataGroup,
              products: 100,
              destinationCategories: [],
              stockToReduce: 5
            };

            dataStocksGet.push(stock);
            this.dataSourceRulesStocks.data = dataStocksGet;
          }
        })
      } else {
        console.log('error get rules filter')
      }
    })
    this.marketplacesService.getRulesFilterTypes().subscribe(data => {
      if(data) {
        console.log(data)
      } else {
        console.log('error get rules filter')
      }
    })*/
    
  }

  async openModalNewRule(ruleFilterType): Promise<void> {
    let modal = await this.modalController.create({
      component: NewRuleComponent,
      componentProps: {
        ruleFilterType,
        mode: 'create'
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data && data.data) {

        console.log('data->', data.data);

        let dataGroupToSend = [];
        let filterType = 0;

        switch(data.data.filterType) {
          case 'categories':
            filterType = 1;
            data.data.categoriesFilter.forEach(item => {
              dataGroupToSend.push({
                id: item.id,
                group: item.group
              })
            });
            break;
          case 'enabling':
            filterType = 2;
            data.data.categoriesFilter.forEach(item => {
              dataGroupToSend.push({
                id: item.id,
                group: item.group
              })
            });
            break;
          case 'stock':
            filterType = 3;
            dataGroupToSend = data.data.stockFilter;
            break;
        } 

        let dataToSend = {
         filterToAdd: {
          name: data.data.name,
          ruleFilterType: filterType,
          externalId: "1",
          dataGroup: dataGroupToSend,
          status: 0,
         },
          marketsIds: [
            "1"
          ],
          referenceExceptions: data.data.referencesExceptions,
          ruleDataValidactionAttributes: []
        }

        console.log(dataToSend)
        this.marketplacesService.postRulesConfigurations(dataToSend).subscribe(data => {
          console.log(data)
        })

        this.temporalAddNeRule(data.data); // FUNCIÓN TEMPORAL PARA QUE SE VEA EN EL FRONT LA NUEVA REGLA CREADA. BORRAR LUEGO

        // LLAMAR AL ENDPOINT PARA INSERTAR EN BBDD. ADAPTAR LOS DATOS LO QUE SEA NECESARIO.
        // HACER TAMBIÉN LLAMADA AL ENDPOINT PARA ACTUALIZAR LAS LISTAS DE LAS TABLAS DE REGLAS CON UNA CONSULTA. TRAER EL ID AUTOGENERADO
      }
    });

    modal.present();
  }

  // BORRAR LUEGO /////////////////////////////////////////////////////////////
  temporalAddNeRule(rule) {

    let maxIdCategory = 0;
    let maxIdEnabling = 0;
    let maxIdStock = 0;

    this.dataSourceCategories.map((existingRule) => {
      if (existingRule.id > maxIdCategory) {
        maxIdCategory = existingRule.id;
      }
    });

    this.dataSourceEnabling.map((existingRule) => {
      if (existingRule.id > maxIdEnabling) {
        maxIdEnabling = existingRule.id;
      }
    });

    this.dataSourceStocks.map((existingRule) => {
      if (existingRule.id > maxIdStock) {
        maxIdStock = existingRule.id;
      }
    });

    let maxId = Math.max(maxIdCategory, maxIdEnabling, maxIdStock);

    rule.id = maxId + 1;

    switch (rule.filterType) {
      case 'categories':

        this.dataSourceCategories.push(rule);
        this.dataSourceCategories.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSourceRulesCategories = new MatTableDataSource(this.dataSourceCategories);

        break;

      case 'enabling':

        this.dataSourceEnabling.push(rule);
        this.dataSourceEnabling.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSourceRulesEnabling = new MatTableDataSource(this.dataSourceEnabling);

        break;

      case 'stock':

        this.dataSourceStocks.push(rule);
        this.dataSourceStocks.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSourceRulesStocks = new MatTableDataSource(this.dataSourceStocks);

        break;
    }

  }
  //////////////////////////////////////////////////////////////////////////////

  async editRule(ruleToEdit): Promise<void> {
    let rule = JSON.parse(JSON.stringify(ruleToEdit));
    let modal = await this.modalController.create({
      component: NewRuleComponent,
      componentProps: {
        ruleFilterType: rule.filterType,
        ruleName: rule.name,
        selectedCategories: rule.categoriesFilter,
        minPriceFilter: rule.minPriceFilter,
        maxPriceFilter: rule.maxPriceFilter,
        stockFilter: rule.stockFilter,
        numberOfProducts: rule.products,
        selectedDestinationCategories: rule.destinationCategories,
        stockToReduce: rule.stockToReduce,
        referencesExceptions: rule.referencesExceptions,
        id: rule.id,
        mode: 'edit'
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data.data) {

        let editedRule = data.data;

        let dataGroupToSend = [];
        let filterType = 0;

        switch(data.data.filterType) {
          case 'categories':
            filterType = 1;
            data.data.categoriesFilter.forEach(item => {
              dataGroupToSend.push({
                id: item.id,
                group: item.group
              })
            });
            break;
          case 'enabling':
            filterType = 2;
            data.data.categoriesFilter.forEach(item => {
              dataGroupToSend.push({
                id: item.id,
                group: item.group
              })
            });
            break;
          case 'stock':
            filterType = 3;
            dataGroupToSend = data.data.stockFilter;
            break;
        } 

        let dataToSend = {
         filterToAdd: {
          name: data.data.name,
          ruleFilterType: filterType,
          externalId: "1",
          dataGroup: dataGroupToSend,
          status: 0,
         },
          marketsIds: [
            "1"
          ],
          referenceExceptions: data.data.referencesExceptions,
          ruleDataValidactionAttributes: []
        }

        console.log(dataToSend)
        /*this.marketplacesService.postRulesConfigurations(dataToSend).subscribe(data => {
          console.log(data)
        })*/

        if(!this.checkForRuleEdition(ruleToEdit, editedRule)) {

          // EL SIGUIENTE BLOQUE ES ALGO TEMPORAL PARA ACTUALIZAR EN EL FRONT LAS LISTAS DE REGLAS. EN UN FUTURO SE MANDARA LA REGLA EDITADA A LA API Y ALLI SE ACTUALIZARÁ, Y A CONTINUACIÓN SE HARÁ LA CONSULTA DE LA LISTA DE NUEVO PARA QUE YA RECOGA EL DATO ACTUALIZADO DESDE LAS TABLAS

          switch (ruleToEdit.filterType) {
            case 'categories':

              this.dataSourceCategories[this.dataSourceCategories.map(cat => cat.id).indexOf(ruleToEdit.id)] = editedRule;
              this.dataSourceRulesCategories = new MatTableDataSource(this.dataSourceCategories);

              break;

            case 'enabling':

              this.dataSourceEnabling[this.dataSourceEnabling.map(cat => cat.id).indexOf(ruleToEdit.id)] = editedRule;
              this.dataSourceRulesEnabling = new MatTableDataSource(this.dataSourceEnabling);

              break;

            case 'stock':

              this.dataSourceStocks[this.dataSourceStocks.map(cat => cat.id).indexOf(ruleToEdit.id)] = editedRule;
              this.dataSourceRulesStocks = new MatTableDataSource(this.dataSourceStocks);

              break;
          }

          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


          // LLAMAR AL ENDPOINT PARA ACTUALIZAR EN BBDD. ADAPTAR LOS DATOS LO QUE SEA NECESARIO.
          // HACER TAMBIÉN LLAMADA AL ENDPOINT PARA ACTUALIZAR LAS LISTAS DE LAS TABLAS DE REGLAS

        }
      }
    });
    modal.present();
  }

  checkForRuleEdition(rule, editedRule) {

    return false;

    if (rule.name == editedRule.name && rule.action == editedRule.action && rule.minPriceFilter == editedRule.minPriceFilter && rule.stockFilter == editedRule.stockFilter && rule.products == editedRule.products && rule.stockToReduce == editedRule.stockToReduce) {
      if (rule.categoriesFilter.length != editedRule.categoriesFilter.length) {
        return false;
      }

      if (rule.destinationCategories.length != editedRule.destinationCategories.length) {
        return false;
      }

      if (rule.categoriesFilter.length) {
        rule.categoriesFilter.sort((a, b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : ((a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))));
        editedRule.categoriesFilter.sort((a, b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : ((a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))));

        for (let i = 0; i < rule.categoriesFilter.length; i++) {
          if (rule.categoriesFilter[i].id != editedRule.categoriesFilter[i].id) {
            return false;
          }
        }

      }
      if (rule.destinationCategories.length) {
        rule.destinationCategories.sort((a, b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : ((a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))));
        editedRule.destinationCategories.sort((a, b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : ((a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))));

        for (let i = 0; i < rule.destinationCategories.length; i++) {
          if (rule.destinationCategories[i].id != editedRule.destinationCategories[i].id) {
            return false;
          }
        }

      }

      return true;

    } else {
      return false;
    }
  }

}
