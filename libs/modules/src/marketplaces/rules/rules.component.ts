import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NewRuleComponent } from './new-rule/new-rule.component';
import { MarketplacesService } from '../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'suite-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  private dataSourceCategories: MatTableDataSource<any> = new MatTableDataSource([
    {
      id: 1,
      name: "Rebajas para botas",
      filterType: "category",
      action: "categories",
      categoriesFilter: [
        {id: 31, group: 2, name: "Mujer"},
        {id: 83, group: 2, name: "Hombre"},
        {id: 134, group: 2, name: "Kids"},
      ],
      minPriceFilter: "0.00",
      stockFilter: 0,
      products: 4546,
      destinationCategories: [
        {id: 38, group: 2, name: "Mujer rebajas"},
        {id: 49, group: 2, name: "Hombre rebajas"}
      ],
      stockToReduce: 0
    },
    {
      id: 2,
      name: "Menos 20 de stock a tacón alto",
      filterType: "category",
      action: "stock",
      categoriesFilter: [
        {id: 1, group: 3, name: "Alto"}
      ],
      minPriceFilter: "0.00",
      stockFilter: 0,
      products: 230,
      destinationCategories: [],
      stockToReduce: 20
    },
    {
      id: 3,
      name: "Envíar deportivas azules",
      filterType: "category",
      action: "activation",
      categoriesFilter: [
        {id: 3, group: 4, name: "Deportivas"},
        {id: 2, group: 9, name: "Azul"}
      ],
      minPriceFilter: "0.00",
      stockFilter: 0,
      products: 79,
      destinationCategories: [],
      stockToReduce: 0
    }
  ]);

  private displayedCategoriesColumns: string[] = ['name', 'categories', 'products', 'edit'];

  private dataSourcePrice: MatTableDataSource<any> = new MatTableDataSource([
    {
      id: 4,
      name: "Envíar mayores de 45.00 €",
      filterType: "price",
      action: "activation",
      categoriesFilter: [],
      minPriceFilter: "45.00",
      stockFilter: 0,
      products: 5720,
      destinationCategories: [],
      stockToReduce: 0
    },
    {
      id: 5,
      name: "Añadir a mujer mayores de 23.40 €",
      filterType: "price",
      action: "categories",
      categoriesFilter: [],
      minPriceFilter: "23.40",
      stockFilter: 0,
      products: 12230,
      destinationCategories: [
        {id: 31, group: 2, name: "Mujer"}
      ],
      stockToReduce: 0
    },
    {
      id: 6,
      name: "Restar 5 al stock de los mayores de 34.99 €",
      filterType: "price",
      action: "stock",
      categoriesFilter: [],
      minPriceFilter: "34.99",
      stockFilter: 0,
      products: 6677,
      destinationCategories: [],
      stockToReduce: 5
    }
  ]);

  private displayedPriceColumns: string[] = ['name', 'price', 'products', 'edit'];

  private dataSourceStocks: MatTableDataSource<any> = new MatTableDataSource([
    {
      id: 7,
      name: "Envíar productos con stock mayor a 10",
      filterType: "stock",
      action: "activation",
      categoriesFilter: [],
      minPriceFilter: "0.00",
      stockFilter: 10,
      products: 230,
      destinationCategories: [],
      stockToReduce: 0
    },
    {
      id: 8,
      name: "Añadir a hombres rebajas stock mayor a 12",
      filterType: "stock",
      action: "categories",
      categoriesFilter: [],
      minPriceFilter: "0.00",
      stockFilter: 12,
      products: 230,
      destinationCategories: [
        {id: 49, group: 2, name: "Hombre rebajas"}
      ],
      stockToReduce: 0
    },
    {
      id: 9,
      name: "Restar 32 de stock a los que tengan 45 o más",
      filterType: "stock",
      action: "stock",
      categoriesFilter: [],
      minPriceFilter: "0.00",
      stockFilter: 45,
      products: 230,
      destinationCategories: [],
      stockToReduce: 32
    }
  ]);

  private displayedStocksColumns: string[] = ['name', 'stock', 'products', 'edit'];

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private marketplacesService: MarketplacesService
  ) { 
    console.log(this.route.snapshot.data['name'])
  }

  ngOnInit() {
    for (let ruleByPrice of this.dataSourcePrice.data) {
      ruleByPrice.minPriceFilter = <any>parseFloat(ruleByPrice.minPriceFilter).toFixed(2);
    }
    this.marketplacesService.getRulesFilter().subscribe(data => {
      if(data) {
        data.forEach(rule => {
          if(rule.ruleFilterType == 1) {
            const dataCategories = this.dataSourceCategories.data;
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

            dataCategories.push(category);
            this.dataSourceCategories.data = dataCategories;
            console.log(this.dataSourceCategories)
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
    })
    
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
      if (data.data) {
        console.log(data.data);

        let categoriesToSend = ''

        data.data.categoriesFilter.forEach(item => {
          categoriesToSend = categoriesToSend.concat(item.name);
          categoriesToSend = categoriesToSend.concat(',')
        })
        
        categoriesToSend = categoriesToSend.slice(0,-1);

        let dataToSend = {
         filterToAdd: {
          id: 789,
          name: data.data.name,
          ruleFilterType: 1,
          externalId: "1",
          dataGroup: categoriesToSend,
          status: 0,
         },
          marketsIds: [
            "1"
          ]
        }

        this.marketplacesService.postRulesFilter(dataToSend).subscribe(data => {
          console.log(data)
        })
      }
    });

    modal.present();
  }

  async editRule(ruleToEdit): Promise<void> {
    let rule = JSON.parse(JSON.stringify(ruleToEdit));
    let modal = await this.modalController.create({
      component: NewRuleComponent,
      componentProps: {
        ruleFilterType: rule.filterType,
        action: rule.action,
        ruleName: rule.name,
        selectedCategories: rule.categoriesFilter,
        minPriceFilter: rule.minPriceFilter,
        stockFilter: rule.stockFilter,
        numberOfProducts: rule.products,
        selectedDestinationCategories: rule.destinationCategories,
        stockToReduce: rule.stockToReduce,
        mode: 'edit'
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data.data) {
        let editedRule = data.data;
        if(!this.checkForRuleEdition(ruleToEdit, editedRule)) {

          // EL SIGUIENTE BLOQUE ES ALGO TEMPORAL PARA ACTUALIZAR EN EL FRONT LAS LISTAS DE REGLAS. EN UN FUTURO SE MANDARA LA REGLA EDITADA A LA API Y ALLI SE ACTUALIZARÁ, Y A CONTINUACIÓN SE HARÁ LA CONSULTA DE LA LISTA DE NUEVO PARA QUE YA RECOGA EL DATO ACTUALIZADO DESDE LAS TABLAS

          switch (ruleToEdit.filterType) {
            case 'category':
              this.dataSourceCategories[this.dataSourceCategories.data.map(cat => cat.id).indexOf(ruleToEdit.id)].action = editedRule.action;
              this.dataSourceCategories[this.dataSourceCategories.data.map(cat => cat.id).indexOf(ruleToEdit.id)].name = editedRule.name;
              this.dataSourceCategories[this.dataSourceCategories.data.map(cat => cat.id).indexOf(ruleToEdit.id)].categoriesFilter = editedRule.categoriesFilter;
              this.dataSourceCategories[this.dataSourceCategories.data.map(cat => cat.id).indexOf(ruleToEdit.id)].minPriceFilter = editedRule.minPriceFilter;
              this.dataSourceCategories[this.dataSourceCategories.data.map(cat => cat.id).indexOf(ruleToEdit.id)].stockFilter = editedRule.stockFilter;
              this.dataSourceCategories[this.dataSourceCategories.data.map(cat => cat.id).indexOf(ruleToEdit.id)].products = editedRule.products;
              this.dataSourceCategories[this.dataSourceCategories.data.map(cat => cat.id).indexOf(ruleToEdit.id)].destinationCategories = editedRule.destinationCategories;
              this.dataSourceCategories[this.dataSourceCategories.data.map(cat => cat.id).indexOf(ruleToEdit.id)].stockToReduce = editedRule.stockToReduce;
              break;

            case 'price':
              this.dataSourcePrice[this.dataSourcePrice.data.map(cat => cat.id).indexOf(ruleToEdit.id)].action = editedRule.action;
              this.dataSourcePrice[this.dataSourcePrice.data.map(cat => cat.id).indexOf(ruleToEdit.id)].name = editedRule.name;
              this.dataSourcePrice[this.dataSourcePrice.data.map(cat => cat.id).indexOf(ruleToEdit.id)].categoriesFilter = editedRule.categoriesFilter;
              this.dataSourcePrice[this.dataSourcePrice.data.map(cat => cat.id).indexOf(ruleToEdit.id)].minPriceFilter = editedRule.minPriceFilter;
              this.dataSourcePrice[this.dataSourcePrice.data.map(cat => cat.id).indexOf(ruleToEdit.id)].stockFilter = editedRule.stockFilter;
              this.dataSourcePrice[this.dataSourcePrice.data.map(cat => cat.id).indexOf(ruleToEdit.id)].products = editedRule.products;
              this.dataSourcePrice[this.dataSourcePrice.data.map(cat => cat.id).indexOf(ruleToEdit.id)].destinationCategories = editedRule.destinationCategories;
              this.dataSourcePrice[this.dataSourcePrice.data.map(cat => cat.id).indexOf(ruleToEdit.id)].stockToReduce = editedRule.stockToReduce;
              break;

            case 'stock':
              this.dataSourceStocks[this.dataSourceStocks.data.map(cat => cat.id).indexOf(ruleToEdit.id)].action = editedRule.action;
              this.dataSourceStocks[this.dataSourceStocks.data.map(cat => cat.id).indexOf(ruleToEdit.id)].name = editedRule.name;
              this.dataSourceStocks[this.dataSourceStocks.data.map(cat => cat.id).indexOf(ruleToEdit.id)].categoriesFilter = editedRule.categoriesFilter;
              this.dataSourceStocks[this.dataSourceStocks.data.map(cat => cat.id).indexOf(ruleToEdit.id)].minPriceFilter = editedRule.minPriceFilter;
              this.dataSourceStocks[this.dataSourceStocks.data.map(cat => cat.id).indexOf(ruleToEdit.id)].stockFilter = editedRule.stockFilter;
              this.dataSourceStocks[this.dataSourceStocks.data.map(cat => cat.id).indexOf(ruleToEdit.id)].products = editedRule.products;
              this.dataSourceStocks[this.dataSourceStocks.data.map(cat => cat.id).indexOf(ruleToEdit.id)].destinationCategories = editedRule.destinationCategories;
              this.dataSourceStocks[this.dataSourceStocks.data.map(cat => cat.id).indexOf(ruleToEdit.id)].stockToReduce = editedRule.stockToReduce;
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
