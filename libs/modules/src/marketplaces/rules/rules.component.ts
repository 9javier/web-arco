import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NewRuleComponent } from './new-rule/new-rule.component';

@Component({
  selector: 'suite-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  private dataSourceCategories = [
    {
      id: 1,
      name: 'Mujer', 
      categories: [
        {
          id: 1,
          group: 2,
          name: 'Mujer'
        },
        {
          id: 2,
          group: 2,
          name: 'mujer outlet'
        },
        {
          id: 3,
          group: 2,
          name: 'mujer rebajas'
        },
        {
          id: 4,
          group: 2,
          name: 'todo mujer'
        }
      ],
      products: 3655,
      action: 'categories'
    },
    {
      id: 2,
      name: 'Hombre',
      categories: [
        {
          id: 5,
          group: 2,
          name: 'Hombre'
        },
        {
          id: 6,
          group: 2,
          name: 'hombre outlet'
        },
        {
          id: 7,
          group: 2,
          name: 'hombre rebajas'
        },
        {
          id: 8,
          group: 2,
          name: 'todo hombre'
        }
      ],
      products: 3655,
      action: 'stock'
    },
    {
      id: 3,
      name: 'Kids',
      categories: [
        {
          id: 9,
          group: 2,
          name: 'Niño'
        },
        {
          id: 10,
          group: 2,
          name: 'niña'
        },
        {
          id: 11,
          group: 2,
          name: 'kids rebajas'
        },
        {
          id: 12,
          group: 2,
          name: 'kids outlet'
        }
      ],
      products: 3655,
      action: 'categories'
    }
  ];

  private displayedCategoriesColumns: string[] = ['name', 'categories', 'products', 'edit'];

  private dataSourcePrice = [
    {
      id: 1,
      name: 'Mayores de 100 €',
      price: 100,
      products: 343,
      action: 'activation'
    },
    {
      id: 2,
      name: 'Mayores de 300 €',
      price: 300,
      products: 343,
      action: 'activation'
    },
    {
      id: 3,
      name:  'Mayores de 433.99 €',
      price: 433.99,
      products: 343,
      action: 'activation'
    }
  ];

  private displayedPriceColumns: string[] = ['name', 'price', 'products', 'edit'];

  private dataSourceStocks = [
    {
      name: 'Stock mayor que 30',
      stock: 30,
      products: 7894,
      action: 'stock'
    },
    {
      name: 'Stock mayor que 58',
      stock: 58,
      products: 2344,
      action: 'activation'
    },
    {
      name: 'Stock mayor que 25',
      stock: 25,
      products: 9665,
      action: 'categories'
    }
  ];

  private displayedStocksColumns: string[] = ['name', 'stock', 'products', 'edit'];

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController
  ) { 
    console.log(this.route.snapshot.data['name'])
  }

  ngOnInit() {
    for (let ruleByPrice of this.dataSourcePrice) {
      ruleByPrice.price = <any>ruleByPrice.price.toFixed(2);
    }
  }

  async openModalNewRule(ruleFilterType): Promise<void> {
    let modal = await this.modalController.create({
      component: NewRuleComponent,
      componentProps: {
        ruleFilterType,
        mode: 'create'
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
