import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NewRuleComponent } from './new-rule/new-rule.component';
import { MarketplacesService } from '../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';

@Component({
  selector: 'suite-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  private dataSourceCategories = [
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
  ];

  private displayedCategoriesColumns: string[] = ['name', 'categories', 'products', 'edit'];

  private dataSourcePrice = [
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
  ];

  private displayedPriceColumns: string[] = ['name', 'price', 'products', 'edit'];

  private dataSourceStocks = [
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
  ];

  private displayedStocksColumns: string[] = ['name', 'stock', 'products', 'edit'];

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private marketplacesService: MarketplacesService
  ) { 
    console.log(this.route.snapshot.data['name'])
  }

  ngOnInit() {
    for (let ruleByPrice of this.dataSourcePrice) {
      ruleByPrice.minPriceFilter = <any>parseFloat(ruleByPrice.minPriceFilter).toFixed(2);
    }
    this.marketplacesService.getRulesFilter().subscribe(data => {
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
        // LLAMAR AL ENDPOINT PARA INSERTAR EN BBDD. ADAPTAR LOS DATOS LO QUE SEA NECESARIO.
        // HACER TAMBIÉN LLAMADA AL ENDPOINT PARA ACTUALIZAR LAS LISTAS DE LAS TABLAS DE REGLAS
      }
    });

    modal.present();
  }

  async editRule(ruleFilterType, rule): Promise<void> {
    let modal = await this.modalController.create({
      component: NewRuleComponent,
      componentProps: {
        ruleFilterType,
        rule,
        mode: 'edit'
      }
    });
    modal.present();
  }

}
