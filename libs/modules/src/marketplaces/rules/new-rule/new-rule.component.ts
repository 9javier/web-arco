import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {MarketplacesService} from '../../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';
import {MarketplacesMgaService} from '../../../../../services/src/lib/endpoint/marketplaces-mga/marketplaces-mga.service';
import { ManageFilteredProductsComponent } from '../manage-filtered-products/manage-filtered-products/manage-filtered-products.component';

@Component({
  selector: 'suite-new-rule',
  templateUrl: './new-rule.component.html',
  styleUrls: ['./new-rule.component.scss']
})
export class NewRuleComponent implements OnInit {

  @ViewChild('minPriceInput') minPriceInput;
  @ViewChild('maxPriceInput') maxPriceInput;
  @ViewChild('stockInput') stockInput;
  @ViewChild('reduceStockInput') reduceStockInput;
  @ViewChild('ruleNameWindow') ruleNameWindow;

  private mode;
  private rule;
  private ruleFilterType;
  private numberOfProducts;
  private categoryList;
  private selectedCategoryGroupFilter;
  private selectedCategoryGroupFilterObject;
  private selectedDestinationCategoryGroupFilter;
  private selectedDestinationCategoryGroupFilterObject;
  private selectedCategories;
  private destinationCategories;
  private selectedDestinationCategories;
  private minPriceFilter;
  private maxPriceFilter;
  private priceRange;
  private stockFilter;
  private stockToReduce;
  private stockToReduceDescription;
  private filterDescription;
  private ruleName;
  private originalRuleName;
  private referencesExceptions;
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
    this.ruleFilterType = this.navParams.get('ruleFilterType');
    this.selectedDestinationCategories = [];
    this.filterDescription = '';
    this.minPriceFilter = '';
    this.maxPriceFilter = '';
    this.priceRange = '';
    this.stockFilter = '';
    this.stockToReduce = '';
    this.stockToReduceDescription = '';
    this.selectedCategories = [];
    this.ruleName = '';
    this.referencesExceptions = [];
    this.idToEdit = this.navParams.get('id');

    this.categoryList = [
      {
        id: 1,
        name: 'Sección',
        items: []
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
      },
      {
        id: 18,
        name: 'Precio',
        items: []
      }
    ];
    this.destinationCategories = [];
    if (this.ruleFilterType == 'categories') {
      this.destinationCategories = [
        {
          id: 1,
          name: 'Sección',
          items: []
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
    }

    this.marketplacesMgaService.getFeaturesRuleMarket(1).subscribe(data => {
      if (data) {
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
          if (this.ruleFilterType == 'categories') {
            this.destinationCategories[listIndex].items.push(listItem);
          }
        });
        this.categoryList[10].items.push({
          id: 18,
          name: 'Precio',
          items: []
        });
        for (let category of this.categoryList) {
          category.items.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        }

        if (this.ruleFilterType == 'categories') {
          for (let category of this.destinationCategories) {
            category.items.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          }
        }
      }
      this.selectedCategoryGroupFilter = this.categoryList[0].id;
      this.selectedCategoryGroupFilterObject = this.categoryList[0];
      if (this.ruleFilterType == 'categories') {
        this.selectedDestinationCategoryGroupFilter = this.destinationCategories[0].id;
        this.selectedDestinationCategoryGroupFilterObject = this.destinationCategories[0];
      }

      /*if (this.mode == 'edit') {
        this.rule = this.navParams.get('rule');
        this.ruleName = this.navParams.get('ruleName');
        this.originalRuleName = this.ruleName;
        this.selectedCategories = this.navParams.get('selectedCategories');
        this.minPriceFilter = this.navParams.get('minPriceFilter') == 0 ? '' : this.navParams.get('minPriceFilter');
        this.maxPriceFilter = this.navParams.get('maxPriceFilter') == 0 ? '' : this.navParams.get('maxPriceFilter');
        this.stockFilter = this.navParams.get('stockFilter') == 0 ? '' : this.navParams.get('stockFilter');
        this.numberOfProducts = this.navParams.get('numberOfProducts');
        this.selectedDestinationCategories = this.navParams.get('selectedDestinationCategories');
        this.stockToReduce = this.navParams.get('stockToReduce') == 0 ? '' : this.navParams.get('stockToReduce');
        this.referencesExceptions = this.navParams.get('referencesExceptions') == [] ? [] : this.navParams.get('referencesExceptions');

        if (this.ruleFilterType == 'stock') {
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
      } else {*/
      this.marketplacesMgaService.getTotalNumberOfProducts().subscribe(count => {
        this.numberOfProducts = count;
      });
      //}

    });
  }

  close(data) {
    this.modalController.dismiss(data);
  }

  changeSelectedCategoryGroupFilter(e) {
    this.selectedCategoryGroupFilter = e.value;
    this.selectedCategoryGroupFilterObject = this.categoryList.find(x => x.id === e.value);
  }

  changeSelectedDestinationCategories(e) {
    this.selectedDestinationCategoryGroupFilter = e.value;
    this.selectedDestinationCategoryGroupFilterObject = this.destinationCategories.find(x => x.id === e.value);
  }

  addCategoryToCategoriesFilter(category) {
    let destination = false;
    if (this.ruleFilterType == 'categories') {
      destination = this.selectedDestinationCategories.some(cat => (cat.id == category.id && cat.group == category.group));
    }
    if (this.selectedCategories.some(cat => (cat.id == category.id && cat.group == category.group))) {
      for (let i = 0; i < this.selectedCategories.length; i++) {
        if (this.selectedCategories[i].id == category.id && this.selectedCategories[i].group == category.group) {
          this.selectedCategories.splice(i, 1);
          break;
        }
      }

      if (this.ruleFilterType == 'categories') {
        if (destination) {
          for (let i = 0; i < this.selectedDestinationCategories.length; i++) {
            if (this.selectedDestinationCategories[i].id == category.id && this.selectedDestinationCategories[i].group == category.group) {
              this.selectedDestinationCategories.splice(i, 1);
              break;
            }
          }
          if (this.selectedCategoryGroupFilter == this.selectedDestinationCategoryGroupFilter) {
            let items = this.selectedDestinationCategoryGroupFilterObject.items;
            this.selectedDestinationCategoryGroupFilterObject.items = [];
            setTimeout(() => {
              for (let item of items) {
                this.selectedDestinationCategoryGroupFilterObject.items.push(item);
              }
            });
          }
        }
      }

    } else {
      this.selectedCategories.push(category);
      this.selectedCategories.sort((a, b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : ((a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))));

      if (this.ruleFilterType == 'categories') {
        if (!destination) {
          this.selectedDestinationCategories.push(category);
          if (this.selectedCategoryGroupFilter == this.selectedDestinationCategoryGroupFilter) {
            let items = this.selectedDestinationCategoryGroupFilterObject.items;
            this.selectedDestinationCategoryGroupFilterObject.items = [];
            setTimeout(() => {
              for (let item of items) {
                this.selectedDestinationCategoryGroupFilterObject.items.push(item);
              }
            });
          }
        }
      }

    }

    this.filterProducts('categories');
    this.filterDescription = '';
    for (let category of this.selectedCategories) {
      let group = this.categoryList.find(x => x.id === category.group);
      this.filterDescription += group.name + ': ' + category.name;
      if (this.selectedCategories.indexOf(category) != this.selectedCategories.length - 1) {
        this.filterDescription += ', ';
      }
    }
    if (this.priceRange != '') {
      if (this.selectedCategories.length) {
        this.filterDescription += ', Precio: ' + this.minPriceFilter + ' € - ' + this.maxPriceFilter + ' €';
      } else {
        this.filterDescription += 'Precio: ' + this.minPriceFilter + ' € - ' + this.maxPriceFilter + ' €';
      }
    }
  }

  addPriceRangeToFilter() {
    if (this.selectedCategories.length) {
      this.priceRange = ', Precio: ' + this.minPriceFilter + ' € - ' + this.maxPriceFilter + ' €';
    } else {
      this.priceRange = 'Precio: ' + this.minPriceFilter + ' € - ' + this.maxPriceFilter + ' €';
    }

    this.filterDescription = '';

    for (let category of this.selectedCategories) {
      let group = this.categoryList.find(x => x.id === category.group);
      this.filterDescription += group.name + ': ' + category.name;
      if (this.selectedCategories.indexOf(category) != this.selectedCategories.length - 1) {
        this.filterDescription += ', ';
      }
    }
    this.filterDescription += this.priceRange;
    this.filterProducts('categories');
  }

  deletePriceRangeFromFilter() {
    this.minPriceFilter = '';
    this.maxPriceFilter = '';
    this.priceRange = '';
    this.filterDescription = '';

    for (let category of this.selectedCategories) {
      let group = this.categoryList.find(x => x.id === category.group);
      this.filterDescription += group.name + ': ' + category.name;
      if (this.selectedCategories.indexOf(category) != this.selectedCategories.length - 1) {
        this.filterDescription += ', ';
      }
    }
  }

  priceRangeIsInFilter() {
    return (this.priceRange != '');
  }

  formatMinPriceCurrency() {
    if (this.minPriceFilter == '') {
      return true;
    }

    return (/^[0-9]+(\.[0-9]{1,2})?$/.test(this.minPriceFilter));

  }

  blurMinPriceCurrencyInput() {
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

  }

  blurMaxPriceCurrencyInput() {
    if (/^[0-9]+(\.[0-9]{1,2})?$/.test(this.maxPriceFilter)) {
      this.maxPriceFilter = parseFloat(this.maxPriceFilter).toString();
      if (this.maxPriceFilter.includes('.')) {
        if (this.maxPriceFilter.split('.')[1].length == 1) {
          this.maxPriceFilter += '0';
        }
      } else {
        this.maxPriceFilter += '.00';
      }
    } else {
      this.maxPriceFilter = '';
    }

  }

  formatMaxPriceCurrency() {
    if (this.maxPriceFilter == '') {
      return true;
    }

    return (/^[0-9]+(\.[0-9]{1,2})?$/.test(this.maxPriceFilter));

  }

  addPriceRangeButtonActivation() {
    return ((/^[0-9]+(\.[0-9]{1,2})?$/.test(this.minPriceFilter)) && (/^[0-9]+(\.[0-9]{1,2})?$/.test(this.maxPriceFilter)) && this.maxPriceFilter != '' && this.minPriceFilter != '' && parseFloat(this.maxPriceFilter) > parseFloat(this.minPriceFilter));
  }

  checkEnterKeyMinPriceInput(e) {
    if (e.key == "Enter") {
      this.maxPriceInput.nativeElement.focus();
    }
  }

  checkEnterKeyMaxPriceInput(e) {
    if (e.key == "Enter") {
      this.maxPriceInput.nativeElement.blur();
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
      for (let i = 0; i < this.selectedDestinationCategories.length; i++) {
        if (this.selectedDestinationCategories[i].id == category.id && this.selectedDestinationCategories[i].group == category.group) {
          this.selectedDestinationCategories.splice(i, 1);
          break;
        }
      }
    } else {
      this.selectedDestinationCategories.push(category);
      this.selectedDestinationCategories.sort((a, b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : ((a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))));
    }
  }

  checkCategorySelected(category) {
    return this.selectedDestinationCategories.some(cat => (cat.id == category.id && cat.group == category.group));
  }

  filterProducts(filter) {
    switch (filter) {

      case 'categories':
        // CONSULTA Y CONTEO DE LOS PRODUCTOS QUE TENGAN LAS CATEGORÍAS SELECCIONADAS
        break;
      case 'stock':
        // CONSULTA Y CONTEO DE LOS PRODUCTOS QUE TENGAN UN STOCK IGUAL O MAYOR AL INTRODUCIDO
        break;
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

    switch (this.ruleFilterType) {

      case 'enabling':

        return true;

        break;

      case 'categories':

        return this.checkCategoryRuleValidation();

        break;

      case 'stock':

        if (this.stockToReduce == '' || this.stockToReduce == 0 || !this.formatReduceStock() || this.stockFilter == '' || (parseInt(this.stockToReduce) > parseInt(this.stockFilter))) {
          return false;
        }
        return this.formatStock();

        break;

      default:
        return false;
        break;
    }
  }

  checkCategoryRuleValidation() {
    return (JSON.stringify(this.selectedCategories).trim() != JSON.stringify(this.selectedDestinationCategories).trim());
  }

  async finishCreateRule() {
    if (this.ruleName != '') {

      let rule = null;
      let description = '';

      switch (this.ruleFilterType) {

        case 'enabling':

          if (this.selectedCategories.length || (this.minPriceFilter != '' && this.minPriceFilter != '')) {
            for (let i = 0; i < this.selectedCategories.length; i++) {
              if (i == 0 && i != this.selectedCategories.length - 1) {
                description += this.selectedCategories[i].name + ', ';
              }

              if (i == 0 && i == this.selectedCategories.length - 1) {
                description += this.selectedCategories[i].name;
              }

              if (i > 0 && i < this.selectedCategories.length - 1) {
                description += this.selectedCategories[i].name + ', ';
              }

              if (i != 0 && i == this.selectedCategories.length - 1) {
                description += this.selectedCategories[i].name;
              }

            }

            if (this.minPriceFilter != '' && this.minPriceFilter != '') {
              if (this.selectedCategories.length) {
                description += ', ';
              }
              description += this.minPriceFilter + ' € - ' + this.maxPriceFilter + ' €';
            }

          }

          rule = {
            name: this.ruleName,
            filterType: this.ruleFilterType,
            categoriesFilter: this.selectedCategories,
            minPriceFilter: this.minPriceFilter == '' ? '0.00' : this.minPriceFilter,
            maxPriceFilter: this.maxPriceFilter == '' ? '0.00' : this.maxPriceFilter,
            stockFilter: 0,
            products: this.numberOfProducts,
            destinationCategories: [],
            stockToReduce: 0,
            referencesExceptions: this.referencesExceptions,
            description
          };
          break;

        case 'categories':

          if (this.selectedCategories.length || (this.minPriceFilter != '' && this.minPriceFilter != '')) {
            for (let i = 0; i < this.selectedCategories.length; i++) {
              if (i == 0 && i != this.selectedCategories.length - 1) {
                description += this.selectedCategories[i].name + ', ';
              }

              if (i == 0 && i == this.selectedCategories.length - 1) {
                description += this.selectedCategories[i].name;
              }

              if (i > 0 && i < this.selectedCategories.length - 1) {
                description += this.selectedCategories[i].name + ', ';
              }

              if (i != 0 && i == this.selectedCategories.length - 1) {
                description += this.selectedCategories[i].name;
              }

            }

            if (this.minPriceFilter != '' && this.minPriceFilter != '') {
              if (this.selectedCategories.length) {
                description += ', ';
              }
              description += this.minPriceFilter + ' € - ' + this.maxPriceFilter + ' €';
            }

          }

          rule = {
            name: this.ruleName,
            filterType: this.ruleFilterType,
            categoriesFilter: this.selectedCategories,
            minPriceFilter: this.minPriceFilter == '' ? '0.00' : this.minPriceFilter,
            maxPriceFilter: this.maxPriceFilter == '' ? '0.00' : this.maxPriceFilter,
            stockFilter: 0,
            products: this.numberOfProducts,
            destinationCategories: this.selectedDestinationCategories,
            stockToReduce: 0,
            referencesExceptions: this.referencesExceptions,
            description
          };
          break;

        case 'stock':
          description += this.stockFilter;
          rule = {
            name: this.ruleName,
            filterType: this.ruleFilterType,
            categoriesFilter: [],
            minPriceFilter: '0.00',
            maxPriceFilter: '0.00',
            stockFilter: parseInt(this.stockFilter),
            products: this.numberOfProducts,
            destinationCategories: [],
            stockToReduce: parseInt(this.stockToReduce),
            referencesExceptions: this.referencesExceptions,
            description
          };
          break;
      }

      this.renderer.setStyle(this.ruleNameWindow.nativeElement, 'display', 'none');
      this.close(rule);
    }
  }

  selectedCategoriesIncludes(category) {
    return this.selectedCategories.some(cat => (cat.id == category.id && cat.group == category.group));
  }

  deleteExceptionReference(exception) {

  }

  async openManageFilteredProductsModal(): Promise<void> {
    let modal = await this.modalController.create({
      component: ManageFilteredProductsComponent,
      componentProps: {}
    });

    modal.onDidDismiss().then((data) => {})

    modal.present();
  }

}
