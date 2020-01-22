import { Component, OnInit} from '@angular/core';
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

  private dataSourceCategories;
  private dataSourceRulesCategories;
  private displayedCategoriesColumns: string[] = ['name', 'categories', 'products', 'edit'];

  private dataSourcePrice;
  private dataSourceRulesPrice;
  private displayedPriceColumns: string[] = ['name', 'price', 'products', 'edit'];

  private dataSourceStocks;
  private dataSourceRulesStocks;
  private displayedStocksColumns: string[] = ['name', 'stock', 'products', 'edit'];

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private marketplacesService: MarketplacesService
  ) { 
    console.log(this.route.snapshot.data['name'])
  }

  ngOnInit() {

    // LLAMAR AL ENDPOINT PARA RECOGER LOS DATOS. UNA VEZ OBTENIDOS, HABRÁ QUE AÑADIR CÓDIGO PARA CLASIFICAR LAS REGLAS SEGÚN SU TIPO DE FILTRO

    this.dataSourceCategories = [
      /* {
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
       }*/
    ];
    this.dataSourceRulesCategories = new MatTableDataSource(this.dataSourceCategories);

    this.dataSourcePrice = [
      /*{
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
      }*/
    ];
    this.dataSourceRulesPrice = new MatTableDataSource(this.dataSourcePrice);

    this.dataSourceStocks = [
      /*{
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
      }*/
    ];
    this.dataSourceRulesStocks = new MatTableDataSource(this.dataSourceStocks);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    this.marketplacesService.getRulesFilter().subscribe(data => {
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

        let filterType = 0;

        let dataGroupToSend = '';

        switch(data.data.filterType) {
          case 'category':
            filterType = 1;

            data.data.categoriesFilter.forEach(item => {
              dataGroupToSend = dataGroupToSend.concat(item.name);
              dataGroupToSend = dataGroupToSend.concat(',')
            })
            
            dataGroupToSend = dataGroupToSend.slice(0,-1);
            break;
          case 'price':
            filterType = 2;
            dataGroupToSend = data.data.minPriceFilter;
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
          ]
        }

        this.marketplacesService.postRulesFilter(dataToSend).subscribe(data => {
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
    let maxIdPrice = 0;
    let maxIdStock = 0;

    this.dataSourceCategories.map((existingRule) => {
      if (existingRule.id > maxIdCategory) {
        maxIdCategory = existingRule.id;
      }
    });

    this.dataSourcePrice.map((existingRule) => {
      if (existingRule.id > maxIdPrice) {
        maxIdPrice = existingRule.id;
      }
    });

    this.dataSourceStocks.map((existingRule) => {
      if (existingRule.id > maxIdStock) {
        maxIdStock = existingRule.id;
      }
    });

    let maxId = Math.max(maxIdCategory, maxIdPrice, maxIdStock);

    console.log(this.dataSourceCategories);

    rule.id = maxId + 1;

    console.log('rule', rule);

    switch (rule.filterType) {
      case 'category':

        this.dataSourceCategories.push(rule);
        this.dataSourceCategories.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSourceRulesCategories = new MatTableDataSource(this.dataSourceCategories);

        break;

      case 'price':

        this.dataSourcePrice.push(rule);
        this.dataSourcePrice.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        for (let ruleByPrice of this.dataSourcePrice) {
          ruleByPrice.minPriceFilter = <any>parseFloat(ruleByPrice.minPriceFilter).toFixed(2);
        }
        this.dataSourceRulesPrice = new MatTableDataSource(this.dataSourcePrice);

        break;

      case 'stock':

        this.dataSourceStocks.push(rule);
        this.dataSourceStocks.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSourceRulesStocks = new MatTableDataSource(this.dataSourceStocks);

        break;
    }

    console.log(this.dataSourceCategories);

  }
  //////////////////////////////////////////////////////////////////////////////

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

              this.dataSourceCategories[this.dataSourceCategories.map(cat => cat.id).indexOf(ruleToEdit.id)]/*.action*/ = editedRule;
              this.dataSourceRulesCategories = new MatTableDataSource(this.dataSourceCategories);

              break;

            case 'price':

              this.dataSourcePrice[this.dataSourcePrice.map(cat => cat.id).indexOf(ruleToEdit.id)] = editedRule;
              this.dataSourceRulesPrice = new MatTableDataSource(this.dataSourcePrice);

              break;

            case 'stock':

              this.dataSourceStocks[this.dataSourceStocks.map(cat => cat.id).indexOf(ruleToEdit.id)] = editedRule;
              this.dataSourceRulesStocks = new MatTableDataSource(this.dataSourceStocks);

              break;
          }

          //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


          // LLAMAR AL ENDPOINT PARA ACTUALIZAR EN BBDD. ADAPTAR LOS DATOS LO QUE SEA NECESARIO.
          // HACER TAMBIÉN LLAMADA AL ENDPOINT PARA ACTUALIZAR LAS LISTAS DE LAS TABLAS DE REGLAS

          for (let ruleByPrice of this.dataSourcePrice) {
            ruleByPrice.minPriceFilter = <any>parseFloat(ruleByPrice.minPriceFilter).toFixed(2);
          }

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
