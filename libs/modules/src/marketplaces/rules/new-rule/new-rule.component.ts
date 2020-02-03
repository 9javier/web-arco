import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import { MarketplacesService } from '../../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';
import { MarketplacesMgaService } from '../../../../../services/src/lib/endpoint/marketplaces-mga/marketplaces-mga.service';

@Component({
  selector: 'suite-new-rule',
  templateUrl: './new-rule.component.html',
  styleUrls: ['./new-rule.component.scss']
})
export class NewRuleComponent implements OnInit {

  @ViewChild('priceInput') priceInput;
  @ViewChild('stockInput') stockInput;
  @ViewChild('reduceStockInput') reduceStockInput;
  @ViewChild('ruleNameWindow') ruleNameWindow;

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
  private destinationCategoriesCopy;
  private selectedDestinationCategories;
  private minPriceFilter;
  private stockFilter;
  private stockToReduce;
  private stockToReduceDescription;
  private filterDescription;
  private ruleName;
  private originalRuleName;
  private idToEdit;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private renderer: Renderer2,
    private marketplacesService: MarketplacesService,
    private marketplacesMgaService: MarketplacesMgaService
  ) {
  }

  ngOnInit() {
    this.mode = this.navParams.get('mode');
    this.numberOfProducts = 0;
    this.action = 'activation';
    this.ruleFilterType = this.navParams.get('ruleFilterType');
    this.selectedDestinationCategories = [];
    this.filterDescription = '';
    this.minPriceFilter = '';
    this.stockFilter = '';
    this.stockToReduce = '';
    this.stockToReduceDescription = '';
    this.selectedCategories = [];
    this.ruleName = '';
    this.idToEdit = this.navParams.get('id');

    this.categoryList = [
      {
        id: 1,
        name: 'Sección',
        items: [/*
          {id: 1, group: 1, name: 'Sección 1'},
          {id: 2, group: 1, name: 'Sección 2'},
          {id: 3, group: 1, name: 'Sección 3'},
          {id: 4, group: 1, name: 'Sección 4'}*/]
      },
      {
        id: 2,
        name: 'Familia',
        items: []
      },
      {
        id: 5,
        name: 'Tacón',
        items: []
      },
      {
        id: 7,
        name: 'Descripción',
        items: []
      },
      {
        id: 9,
        name: 'Material exterior',
        items: []
      },
      {
        id: 10,
        name: 'Material interior',
        items: []
      },
      {
        id: 12,
        name: 'Comercial',
        items: [
          /*{id: 1, group: 7, name: 'Comercial 1'},
          {id: 2, group: 7, name: 'Comercial 2'},
          {id: 3, group: 7, name: 'Comercial 3'}*/
        ]
      },
      {
        id: 15,
        name: 'Marca',
        items: []
      },
      {
        id: 16,
        name: 'Color',
        items: []
      },
      {
        id: 17,
        name: 'Talla',
        items: []
      }
    ];
    this.selectedCategoryGroupFilterObject = this.categoryList[0];
    this.destinationCategories = [];

    this.marketplacesMgaService.getFeaturesRuleMarket(1).subscribe(data => {
      if(data) {
        data.forEach(item => {
          let listItem = {
            id: item.id,
            group: item.groupNumber,
            name: item.name.trim()
          };
          let listIndex = -1;
          switch (item.groupNumber) {
            case 1:
              listIndex = 0;
              break;

            case 2:
              listIndex = 1;
              break;

            case 5:
              listIndex = 2;
              break;

            case 7:
              listIndex = 3;
              break;

            case 9:
              listIndex = 4;
              break;

            case 10:
              listIndex = 5;
              break;

            case 12:
              listIndex = 6;
              break;

            case 15:
              listIndex = 7;
              break;

            case 16:
              listIndex = 8;
              break;

            case 17:
              listIndex = 9;
              break;
          }
          this.categoryList[listIndex].items.push(listItem);
          this.destinationCategories.push(listItem);
        });
        for (let category of this.categoryList) {
          category.items.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        }
      }
      this.selectedCategoryGroupFilter = this.categoryList[0].id;
      this.selectedCategoryGroupFilterObject = this.categoryList[0];
      this.destinationCategories.sort((a, b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : ((a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))));
      this.destinationCategoriesCopy = this.destinationCategories.slice();

      if (this.mode == 'edit') {
        this.rule = this.navParams.get('rule');
        this.action = this.navParams.get('action');
        this.ruleName = this.navParams.get('ruleName');
        this.originalRuleName = this.ruleName;
        this.selectedCategories = this.navParams.get('selectedCategories');
        this.minPriceFilter = this.navParams.get('minPriceFilter') == 0 ? '' : this.navParams.get('minPriceFilter');
        this.stockFilter = this.navParams.get('stockFilter') == 0 ? '' : this.navParams.get('stockFilter');
        this.numberOfProducts = this.navParams.get('numberOfProducts');
        this.selectedDestinationCategories = this.navParams.get('selectedDestinationCategories');
        this.stockToReduce = this.navParams.get('stockToReduce') == 0 ? '' : this.navParams.get('stockToReduce');
        this.reorganizeDestinationCategories();

        if (this.action == 'stock') {
          this.addReduceStockFilter();
        }

        switch (this.ruleFilterType) {
          case 'category':
            this.filterDescription = '';
            for (let category of this.selectedCategories) {
              let group = this.categoryList.find(x => x.id === category.group);
              this.filterDescription += group.name + ': ' + category.name;
              if (this.selectedCategories.indexOf(category) != this.selectedCategories.length - 1) {
                this.filterDescription += ', ';
              }
            }
            break;

          case 'price':
            this.addPriceFilter();
            break;

          case 'stock':
            this.addStockFilter();
            break;
        }
      } else {
        this.marketplacesMgaService.getTotalNumberOfProducts().subscribe(count => {
          this.numberOfProducts = count;
        });
      }

    });
  }

  close(data) {
    this.modalController.dismiss(data);
  }

  changeSelectedCategoryGroupFilter($event) {
    this.selectedCategoryGroupFilter = $event.value;
    this.selectedCategoryGroupFilterObject = this.categoryList.find(x => x.id === $event.value);
  }

  addCategoryToCategoriesFilter(category) {
    if (this.selectedCategories.some(cat => (cat.id == category.id && cat.group == category.group))) {
      this.selectedCategories.splice(this.selectedCategories.map(cat => cat.id).indexOf(category.id), 1);
    } else {
      this.selectedCategories.push(category);
      this.selectedCategories.sort((a, b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : ((a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))));
    }
    this.reorganizeDestinationCategories();
    this.filterProducts('categories');
    this.filterDescription = '';
    for (let category of this.selectedCategories) {
      let group = this.categoryList.find(x => x.id === category.group);
      this.filterDescription += group.name + ': ' + category.name;
      if (this.selectedCategories.indexOf(category) != this.selectedCategories.length - 1) {
        this.filterDescription += ', ';
      }
    }
  }

  formatCurrency() {
    if (this.minPriceFilter == '') {
      return true;
    }

    return (/^[0-9]+(\.[0-9]{1,2})?$/.test(this.minPriceFilter));

  }

  blurCurrencyInput() {
    if (/^[0-9]+(\.[0-9]{1,2})?$/.test(this.minPriceFilter)) {
      this.minPriceFilter = parseFloat(this.minPriceFilter).toString();
      if (this.minPriceFilter.includes('.')) {
        if (this.minPriceFilter.split('.')[1].length == 1) {
          this.minPriceFilter += '0';
        }
      } else {
        this.minPriceFilter += '.00';
      }
    } else {
      this.minPriceFilter = '';
    }
    this.addPriceFilter();
    this.filterProducts('price');
  }

  addPriceFilter() {
    if (this.minPriceFilter != '' && /^[0-9]+(\.[0-9]{1,2})?$/.test(this.minPriceFilter)) {
      this.filterDescription = 'Precio mínimo: ' + this.minPriceFilter + ' €';
    } else {
      this.filterDescription = '';
    }
  }

  checkEnterKeyPriceInput(e) {
    if (e.key == "Enter") {
      this.priceInput.nativeElement.blur();
    }
  }

  formatStock() {
    if (this.stockFilter == '') {
      return true;
    }

    return (/^[0-9]\d*$/.test(this.stockFilter));
  }

  blurStockInput() {
    if (/^[0-9]\d*$/.test(this.stockFilter)) {
      this.stockFilter = parseInt(this.stockFilter).toString();
    } else {
      this.stockFilter = '';
    }
    this.addStockFilter();
    this.filterProducts('stock');
  }

  addStockFilter() {
    if (this.stockFilter != '' && /^[0-9]\d*$/.test(this.stockFilter)) {
      this.filterDescription = 'Stock de seguridad: ' + this.stockFilter;
    } else {
      this.filterDescription = '';
    }
  }

  checkEnterKeyStockInput(e) {
    if (e.key == "Enter") {
      this.stockInput.nativeElement.blur();
    }
  }

  formatReduceStock() {
    if (this.stockToReduce == '') {
      return true;
    }

    return (/^[0-9]\d*$/.test(this.stockToReduce));
  }

  blurReduceStockInput() {
    if (/^[0-9]\d*$/.test(this.stockToReduce)) {
      this.stockToReduce = parseInt(this.stockToReduce).toString();
    } else {
      this.stockToReduce = '';
    }
    this.addReduceStockFilter();
  }

  addReduceStockFilter() {
    if (this.stockToReduce != '' && /^[0-9]\d*$/.test(this.stockToReduce)) {
      this.stockToReduceDescription = this.stockToReduce;
    } else {
      this.stockToReduceDescription = '';
    }
  }

  checkEnterKeyReduceStockInput(e) {
    if (e.key == "Enter") {
      this.reduceStockInput.nativeElement.blur();
    }
  }

  selectCategoryRow(category) {
    if (this.selectedDestinationCategories.some(cat => (cat.id == category.id && cat.group == category.group))) {
      this.selectedDestinationCategories.splice(this.selectedDestinationCategories.map(cat => cat.id).indexOf(category.id), 1);
    } else {
      this.selectedDestinationCategories.push(category);
      this.selectedDestinationCategories.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
    }
  }

  checkCategorySelected(category) {
    return this.selectedDestinationCategories.some(cat => (cat.id == category.id && cat.group == category.group));
  }

  filterProducts(filter) {
    switch (filter) {

      // EN TODOS LOS TIPOS DE FILTROS, SI ESTOS ESTÁN VACÍOS SE DEVUELVEN EL TOTAL DE LOS PRODUCTOS (TODOS LOS PRODUCTOS ENTRAN EN LA REGLA, YA QUE NO HAY FILTRO)

      case 'categories':
        // CONSULTA Y CONTEO DE LOS PRODUCTOS QUE TENGAN LAS CATEGORÍAS SELECCIONADAS
        break;
      case 'price':
        // CONSULTA Y CONTEO DE LOS PRODUCTOS QUE TENGAN UN PRECIO IGUAL O MAYOR AL INTRODUCIDO
        break;
      case 'stock':
        // CONSULTA Y CONTEO DE LOS PRODUCTOS QUE TENGAN UN STOCK IGUAL O MAYOR AL INTRODUCIDO
        break;
    }
  }

  reorganizeDestinationCategories() {
    this.destinationCategoriesCopy = this.destinationCategories.slice();
    for (let category of this.selectedCategories) {
      for (let destinationCategory of this.destinationCategoriesCopy) {
        if (destinationCategory.id == category.id) {
          this.destinationCategoriesCopy.splice(this.destinationCategoriesCopy.indexOf(destinationCategory), 1);
          if (this.selectedDestinationCategories.some(cat => (cat.id == destinationCategory.id && cat.group == destinationCategory.group))) {
            this.selectedDestinationCategories.splice(this.selectedDestinationCategories.map(cat => cat.id).indexOf(destinationCategory.id), 1);
          }
        }
      }
    }
  }

  actionChange() {
    if (this.ruleFilterType == 'category') {
      this.reorganizeDestinationCategories();
    }
  }

  createRule() {
    this.renderer.setStyle(this.ruleNameWindow.nativeElement, 'display', 'flex');
  }

  cancelRuleNaming() {
    this.renderer.setStyle(this.ruleNameWindow.nativeElement, 'display', 'none');
    if (this.mode == 'create') {
      this.ruleName = '';
    } else {
      this.ruleName = this.originalRuleName;
    }
  }

  createRuleButtonActivation() {

    if (this.numberOfProducts <= 0) {
      return false;
    }

    switch (this.action) {

      case 'activation':

        switch (this.ruleFilterType) {

          case 'category':
            return true;
            break;
          case 'price':
             return (this.minPriceFilter != '' && this.formatCurrency());
            break;
          case 'stock':
            return (this.stockFilter != '' && this.formatStock());
            break;
        }

        break;

      case 'categories':

        if (!this.selectedDestinationCategories.length) {
          return false;
        }

        switch (this.ruleFilterType) {

          case 'category':
            return true;
            break;
          case 'price':
            return (this.minPriceFilter != '' && this.formatCurrency());
            break;
          case 'stock':
            return (this.stockFilter != '' && this.formatStock());
            break;
        }

        break;

      case 'stock':

        if (this.stockToReduce == '' || this.stockToReduce == 0 || !this.formatReduceStock()) {
          return false;
        }

        switch (this.ruleFilterType) {

          case 'category':
            return true;
            break;
          case 'price':
            return (this.minPriceFilter != '' && this.formatCurrency());
            break;
          case 'stock':
            return (this.stockFilter != '' && this.formatStock());
            break;
        }

        break;

      default:
        return false;
        break;
    }
  }

  async finishCreateRule() {
    if (this.ruleName != '') {

      let rule = null;

      switch (this.action) {

        case 'activation':

          switch (this.ruleFilterType) {

            case 'category':
              rule = {
                name: this.ruleName,
                filterType: this.ruleFilterType,
                action: this.action,
                categoriesFilter: this.selectedCategories,
                minPriceFilter: 0,
                stockFilter: 0,
                products: this.numberOfProducts,
                destinationCategories: [],
                stockToReduce: 0
              };
              break;
            case 'price':
              rule = {
                name: this.ruleName,
                filterType: this.ruleFilterType,
                action: this.action,
                categoriesFilter: [],
                minPriceFilter: this.minPriceFilter,
                stockFilter: 0,
                products: this.numberOfProducts,
                destinationCategories: [],
                stockToReduce: 0
              };
              break;
            case 'stock':
              rule = {
                name: this.ruleName,
                filterType: this.ruleFilterType,
                action: this.action,
                categoriesFilter: [],
                minPriceFilter: 0,
                stockFilter: parseInt(this.stockFilter),
                products: this.numberOfProducts,
                destinationCategories: [],
                stockToReduce: 0
              };
              break;
          }

          break;

        case 'categories':

          switch (this.ruleFilterType) {

            case 'category':
              rule = {
                name: this.ruleName,
                filterType: this.ruleFilterType,
                action: this.action,
                categoriesFilter: this.selectedCategories,
                minPriceFilter: 0,
                stockFilter: 0,
                products: this.numberOfProducts,
                destinationCategories: this.selectedDestinationCategories,
                stockToReduce: 0
              };
              break;
            case 'price':
              rule = {
                name: this.ruleName,
                filterType: this.ruleFilterType,
                action: this.action,
                categoriesFilter: [],
                minPriceFilter: this.minPriceFilter,
                stockFilter: 0,
                products: this.numberOfProducts,
                destinationCategories: this.selectedDestinationCategories,
                stockToReduce: 0
              };
              break;
            case 'stock':
              rule = {
                name: this.ruleName,
                filterType: this.ruleFilterType,
                action: this.action,
                categoriesFilter: [],
                minPriceFilter: 0,
                stockFilter: parseInt(this.stockFilter),
                products: this.numberOfProducts,
                destinationCategories: this.selectedDestinationCategories,
                stockToReduce: 0
              };
              break;
          }

          break;

        case 'stock':

          switch (this.ruleFilterType) {

            case 'category':
              rule = {
                name: this.ruleName,
                filterType: this.ruleFilterType,
                action: this.action,
                categoriesFilter: this.selectedCategories,
                minPriceFilter: 0,
                stockFilter: 0,
                products: this.numberOfProducts,
                destinationCategories: [],
                stockToReduce: parseInt(this.stockToReduce)
              };
              break;
            case 'price':
              rule = {
                name: this.ruleName,
                filterType: this.ruleFilterType,
                action: this.action,
                categoriesFilter: [],
                minPriceFilter: this.minPriceFilter,
                stockFilter: 0,
                products: this.numberOfProducts,
                destinationCategories: [],
                stockToReduce: parseInt(this.stockToReduce)
              };
              break;
            case 'stock':
              rule = {
                name: this.ruleName,
                filterType: this.ruleFilterType,
                action: this.action,
                categoriesFilter: [],
                minPriceFilter: 0,
                stockFilter: parseInt(this.stockFilter),
                products: this.numberOfProducts,
                destinationCategories: [],
                stockToReduce: parseInt(this.stockToReduce)
              };
              break;
          }

          break;
      }

      this.renderer.setStyle(this.ruleNameWindow.nativeElement, 'display', 'none');
      rule['id'] = this.idToEdit;
      this.close(rule);
    }
  }

  selectedCategoriesIncludes(category) {
    return this.selectedCategories.some(cat => (cat.id == category.id && cat.group == category.group));
  }

}
