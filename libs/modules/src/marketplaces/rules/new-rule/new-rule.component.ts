import {Component, OnInit} from '@angular/core';
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
  private selectedCategoryGroupFilter;
  private selectedCategoryGroupFilterObject;
  private selectedCategories;
  private destinationCategories;
  private selectedDestinationCategories;
  private minPriceFilter;
  private stockFilter;
  private stockToReduce;
  private filterDescription;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) {
  }

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    this.numberOfProducts = 0;
    this.action = 'activation';
    /*if (this.mode == 'edit') {
      this.rule = this.navParams.get('rule');
      this.numberOfProducts = this.rule.products;
      this.action = this.rule.action;
    }*/
    this.ruleFilterType = this.navParams.get('ruleFilterType');
    this.selectedDestinationCategories = [];
    this.filterDescription = '';

    // DATOS ESTÁTICOS. CAMBIAR CUANDO APIS LISTAS
    this.categoryList = [
      {
        id: 1,
        name: 'Sección',
        items: [
          {id: 1, group: 1, name: 'Sección 1'},
          {id: 2, group: 1, name: 'Sección 2'},
          {id: 3, group: 1, name: 'Sección 3'},
          {id: 4, group: 1, name: 'Sección 4'}
        ]
      },
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
        id: 3,
        name: 'Tacón',
        items: [
          {id: 1, group: 3, name: 'Alto'},
          {id: 2, group: 3, name: 'Bajo'},
          {id: 3, group: 3, name: 'Sin tacón'}
        ]
      },
      {
        id: 4,
        name: 'Descripción',
        items: [
          {id: 1, group: 4, name: 'Botas'},
          {id: 2, group: 4, name: 'Botines'},
          {id: 3, group: 4, name: 'Deportivas'}
        ]
      },
      {
        id: 5,
        name: 'Material exterior',
        items: [
          {id: 1, group: 5, name: 'Piel'},
          {id: 2, group: 5, name: 'Tela'},
          {id: 3, group: 5, name: 'Plástico'}
        ]
      },
      {
        id: 6,
        name: 'Material interior',
        items: [
          {id: 1, group: 6, name: 'Piel'},
          {id: 2, group: 6, name: 'Tela'},
          {id: 3, group: 6, name: 'Plástico'}
        ]
      },
      {
        id: 7,
        name: 'Comercial',
        items: [
          {id: 1, group: 7, name: 'Comercial 1'},
          {id: 2, group: 7, name: 'Comercial 2'},
          {id: 3, group: 7, name: 'Comercial 3'}
        ]
      },
      {
        id: 8,
        name: 'Marca',
        items: [
          {id: 1, group: 8, name: 'ADIDAS SL'},
          {id: 2, group: 8, name: 'AMANDA A.'},
          {id: 3, group: 8, name: 'ASICS'}
        ]
      },
      {
        id: 9,
        name: 'Colores',
        items: [
          {id: 1, group: 9, name: 'Rojo'},
          {id: 2, group: 9, name: 'Azul'},
          {id: 3, group: 9, name: 'Amarillo'}
        ]
      },
      {
        id: 10,
        name: 'Tallas',
        items: [
          {id: 1, group: 10, name: '34'},
          {id: 2, group: 10, name: '35'},
          {id: 3, group: 10, name: '36'}
        ]
      }
    ];
    this.selectedCategoryGroupFilter = this.categoryList[0].id;
    this.selectedCategoryGroupFilterObject = this.categoryList[0];
    this.selectedCategories = [];
    this.destinationCategories = [
      {id: 31, name: 'Mujer'},
      {id: 38, name: 'Mujer rebajas'},
      {id: 99, name: 'Mujer todo'},
      {id: 83, name: 'Hombre'},
      {id: 49, name: 'Hombre rebajas'},
    ]
  }

  close() {
    this.modalController.dismiss();
  }

  changeselectedCategoryGroupFilter($event) {
    this.selectedCategoryGroupFilter = $event.value;
    this.selectedCategoryGroupFilterObject = this.categoryList.find(x => x.id === $event.value);
    console.log(this.selectedCategoryGroupFilter);
    console.log(this.selectedCategoryGroupFilterObject);
  }

  createRule() {
    console.log('create rule')
  }

  addCategoryToCategoriesFilter(category) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories.splice(this.selectedCategories.indexOf(category), 1);
    } else {
      this.selectedCategories.push(category);
      this.selectedCategories.sort((a, b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : ((a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))));
    }
    this.filterDescription = '';
    for (let category of this.selectedCategories) {
      let group = this.categoryList.find(x => x.id === category.group);
      this.filterDescription += group.name + ': ' + category.name;
      if (this.selectedCategories.indexOf(category) != this.selectedCategories.length - 1) {
        this.filterDescription += ', ';
      }
    }
  }




}
