import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'suite-new-rule',
  templateUrl: './new-rule.component.html',
  styleUrls: ['./new-rule.component.scss']
})
export class NewRuleComponent implements OnInit {
  
  private mode;
  private rule;
  private ruleFilterType;
  private numberOfProducts;
  private action;
  private categoryList;
  private selectedCategoryFilter;
  private destinationCategories;
  private selectedDestinationCategories;
  private minPriceFilter;
  private stockFilter;
  private stockToReduce;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    this.numberOfProducts = 0;
    this.action = 'activation';
    if (this.mode == 'edit') {
      this.rule = this.navParams.get('rule');
      this.numberOfProducts = this.rule.products;
      this.action = this.rule.action;
    }
    this.ruleFilterType = this.navParams.get('ruleFilterType');
    this.selectedDestinationCategories = [];

    // DATOS ESTÁTICOS. CAMBIAR CUANDO APIS LISTAS
    this.categoryList = [
      {
        id: 2,
        name: 'Familia',
        items: [
          {id: 1, group: 2, name: 'Mujer'},
          {id: 2, group: 2, name: 'Hombre'},
          {id: 3, group: 2, name: 'Unisex'},
          {id: 4, group: 2, name: 'Kids'}
        ]
      },
      {
        id: 5,
        name: 'Tacón',
        items: [
          {id: 1, group: 5, name: 'Alto'},
          {id: 2, group: 5, name: 'Bajo'},
          {id: 3, group: 5, name: 'Sin tacón'}
        ]
      },
      {
        id: 7,
        name: 'Descripción',
        items: [
          {id: 1, group: 7, name: 'Botas'},
          {id: 2, group: 7, name: 'Botines'},
          {id: 3, group: 7, name: 'Deportivas'}
        ]
      },
      {
        id: 9,
        name: 'Material exterior',
        items: [
          {id: 1, group: 9, name: 'Piel'},
          {id: 2, group: 9, name: 'Tela'},
          {id: 3, group: 9, name: 'Plástico'}
        ]
      },
      {
        id: 10,
        name: 'Material interior',
        items: [
          {id: 1, group: 10, name: 'Piel'},
          {id: 2, group: 10, name: 'Tela'},
          {id: 3, group: 10, name: 'Plástico'}
        ]
      },
    ];
    this.selectedCategoryFilter = {
      id: 2,
      name: 'Familia',
      items: [
        {id: 1, group: 2, name: 'Mujer'},
        {id: 2, group: 2, name: 'Hombre'},
        {id: 3, group: 2, name: 'Unisex'},
        {id: 4, group: 2, name: 'Kids'}
      ]
    };
    this.destinationCategories = [
      {id: 31, name: 'Mujer'},
      {id: 38, name: 'Mujer rebajas'},
      {id: 99, name: 'Mujer todo'},
      {id: 83, name: 'Hombre'},
      {id: 49, name: 'Hombre rebajas'},
    ]
  }

  close(){
    this.modalController.dismiss();
  }

  changeSelectedCategoryFilter($event) {
    this.selectedCategoryFilter = this.categoryList.find(x => x.id === $event.value);
    console.log(this.selectedCategoryFilter);
  }

  createRule() {
    console.log('create rule')
  }

}
