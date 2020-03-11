import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {MarketplacesService} from '../../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';
import {MarketplacesMgaService} from '../../../../../services/src/lib/endpoint/marketplaces-mga/marketplaces-mga.service';
import {forkJoin} from "rxjs";

@Component({
  selector: 'suite-new-rule',
  templateUrl: './new-rule.component.html',
  styleUrls: ['./new-rule.component.scss']
})
export class NewRuleComponent implements OnInit {

  @ViewChild('minPriceInput') minPriceInput;
  @ViewChild('maxPriceInput') maxPriceInput;
  @ViewChild('ruleNameWindow') ruleNameWindow;
  @ViewChild('includeReferenceInput') includeReferenceInput;
  @ViewChild('excludeReferenceInput') excludeReferenceInput;

  private mode;
  private rule;
  private ruleFilterType;
  private numberOfProducts;
  private categoryList;
  private selectedCategoryGroupFilter;
  private selectedCategoryGroupFilterObject;
  private selectedCategories;
  private destinationCategories;
  private selectedDestinationCategories;
  private minPriceFilter;
  private maxPriceFilter;
  private priceRange;
  private filterDescription;
  private ruleName;
  private originalRuleName;
  private includeReferenceText;
  private includeReferenceArray;
  private excludeReferenceText;
  private excludeReferenceArray;
  private referencesExceptions;
  private categorySearched;
  private market;

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
    this.market = this.navParams.get('market');
    this.numberOfProducts = 0;
    this.ruleFilterType = this.navParams.get('ruleFilterType');
    this.selectedDestinationCategories = [];
    this.filterDescription = '';
    this.minPriceFilter = '';
    this.maxPriceFilter = '';
    this.priceRange = '';
    this.selectedCategories = [];
    this.ruleName = '';
    this.referencesExceptions = [];
    this.includeReferenceText = '';
    this.includeReferenceArray = [];
    this.excludeReferenceText = '';
    this.excludeReferenceArray = [];
    this.categorySearched = '';

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
        items: []
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
      },
      {
        id: 19,
        name: 'Añadir referencias',
        items: []
      },
      {
        id: 20,
        name: 'Excluír referencias',
        items: []
      },
    ];
    this.destinationCategories = [];

    forkJoin([
      this.marketplacesService.getBrands(),
      this.marketplacesService.getColors(),
      this.marketplacesService.getSizes(),
      this.marketplacesService.getFeatures()
    ]).subscribe((results: any) => {

      if (results && results.length) {
        if (results[0] && results[0].length) {
          results[0].forEach(brand => {
            let listItem = {
              id: brand.id,
              externalId: brand.externalId,
              type: brand.ruleFilterType,
              group: "15",
              name: brand.name.trim()
            };
            this.categoryList[7].items.push(listItem);
          });
        }

        if (results[1] && results[1].length) {
          results[1].forEach(color => {
            let listItem = {
              id: color.id,
              externalId: color.externalId,
              type: color.ruleFilterType,
              group: "16",
              name: color.name.trim()
            };
            this.categoryList[8].items.push(listItem);
          });
        }

        if (results[2] && results[2].length) {
          results[2].forEach(size => {
            let listItem = {
              id: size.id,
              externalId: size.externalId,
              type: size.ruleFilterType,
              group: "17",
              name: size.name.trim()
            };
            this.categoryList[9].items.push(listItem);
          });
        }

        if (results[3] && results[3].length) {
          results[3].forEach(feature => {
            if (feature.dataGroup == "1" || feature.dataGroup == "2" || feature.dataGroup == "5" || feature.dataGroup == "7" || feature.dataGroup == "9" || feature.dataGroup == "10" || feature.dataGroup == "12") {
              let listItem = {
                id: feature.id,
                externalId: feature.externalId,
                type: feature.ruleFilterType,
                group: feature.dataGroup,
                name: feature.name.trim()
              };
              let listIndex = -1;
              switch (listItem.group) {
                case "1":
                  listIndex = 0;
                  break;

                case "2":
                  listIndex = 1;
                  break;

                case "5":
                  listIndex = 2;
                  break;

                case "7":
                  listIndex = 3;
                  break;

                case "9":
                  listIndex = 4;
                  break;

                case "10":
                  listIndex = 5;
                  break;

                case "12":
                  listIndex = 6;
                  break;
              }

              this.categoryList[listIndex].items.push(listItem);
            }
          });
        }
        for (let i = 0; i < this.categoryList.length; i++) {
          let category = this.categoryList[i];
          if (i != 9) {
            category.items.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
          } else {
            let categoriesTransformed = [];

            for (let sizeValue of category.items.slice()) {
              let numbers = '';
              let letters = '';
              for (let i = 0; i < sizeValue.name.length; i++) {
                if  (isNaN(sizeValue.name[i])) {
                  letters = sizeValue.name.substr(i, sizeValue.name.length);
                  break;
                } else {
                  numbers += sizeValue.name[i];
                }
              }
              if (numbers == '') {
                numbers = '999999';
              }
              categoriesTransformed.push({sizeValue, numbers, letters});
            }

            categoriesTransformed.sort((a, b) => (parseInt(a.numbers) > parseInt(b.numbers)) ? 1 : ((parseInt(b.numbers) > parseInt(a.numbers)) ? -1 : (a.letters.toLowerCase() > b.letters.toLowerCase()) ? 1 : ((b.letters.toLowerCase() > a.letters.toLowerCase()) ? -1 : 0)));

            let sortedSizes = [];

            for (let size of categoriesTransformed) {
              sortedSizes.push(size.sizeValue);
            }

            category.items = sortedSizes.slice();
          }
        }
      }

      this.selectedCategoryGroupFilter = this.categoryList[0].id;
      this.selectedCategoryGroupFilterObject = {...this.categoryList[0]};

      if (this.ruleFilterType == "categories") {
        this.marketplacesService.getMarketCategories().subscribe(data => {
          this.destinationCategories = data;
          this.destinationCategories.sort((a, b) => {
            if (isNaN(a.marketCategoryID) || isNaN(b.marketCategoryID)) {
              return ((a.marketCategoryID > b.marketCategoryID) ? 1 : ((b.marketCategoryID > a.marketCategoryID) ? -1 : 0));
            } else {
              return ((parseInt(a.marketCategoryID) > parseInt(b.marketCategoryID)) ? 1 : ((parseInt(b.marketCategoryID) > parseInt(a.marketCategoryID)) ? -1 : 0));
            }
          });
        });
      }

      if (this.mode == 'edit') {
        this.rule = this.navParams.get('rule');
        this.ruleName = this.navParams.get('ruleName');
        this.originalRuleName = this.ruleName;
        this.selectedCategories = this.navParams.get('selectedCategories');
        this.minPriceFilter = this.navParams.get('minPriceFilter') == 0 ? '' : this.navParams.get('minPriceFilter');
        this.maxPriceFilter = this.navParams.get('maxPriceFilter') == 0 ? '' : this.navParams.get('maxPriceFilter');
        this.numberOfProducts = this.navParams.get('numberOfProducts');
        this.selectedDestinationCategories = this.navParams.get('selectedDestinationCategories');
        this.referencesExceptions = this.navParams.get('referencesExceptions') == [] ? [] : this.navParams.get('referencesExceptions');

        if (this.referencesExceptions && this.referencesExceptions.length) {
          for (let exception of this.referencesExceptions) {
            if (exception.type == "include") {
              this.includeReferenceArray.push(exception.reference);
            } else {
              this.excludeReferenceArray.push(exception.reference);
            }
          }
          this.includeReferenceText = '';
          this.excludeReferenceText = '';
          for (let i = 0; i < this.includeReferenceArray.length; i++) {
            this.includeReferenceText += this.includeReferenceArray[i];
            if (i != this.includeReferenceArray.length - 1) {
              this.includeReferenceText += ', ';
            }
          }

          for (let i = 0; i < this.excludeReferenceArray.length; i++) {
            this.excludeReferenceText += this.excludeReferenceArray[i];
            if (i != this.excludeReferenceArray.length - 1) {
              this.excludeReferenceText += ', ';
            }
          }
        }

        switch (this.ruleFilterType) {
          case 'categories':
          case 'enabling':
            this.filterDescription = '';
            for (let category of this.selectedCategories) {
              let group = this.categoryList.find(x => x.id === parseInt(category.group));
              this.filterDescription += group.name + ': ' + category.name;
              if (this.selectedCategories.indexOf(category) != this.selectedCategories.length - 1) {
                this.filterDescription += ', ';
              }
            }
            if (this.minPriceFilter != '' && this.maxPriceFilter != '') {
              this.priceRange = this.minPriceFilter + ' - ' + this.maxPriceFilter;
              if (this.selectedCategories.length) {
                this.priceRange = ', Precio: ' + this.minPriceFilter + ' € - ' + this.maxPriceFilter + ' €';
              } else {
                this.priceRange = 'Precio: ' + this.minPriceFilter + ' € - ' + this.maxPriceFilter + ' €';
              }
              this.filterDescription += this.priceRange;
            }

            if (this.includeReferenceArray.length && this.includeReferenceText != '') {
              if (this.selectedCategories.length || this.priceRange != '') {
                this.filterDescription += ', Referencias añadidas: ';
              } else {
                this.filterDescription += 'Referencias añadidas: ';
              }
              for (let i = 0; i < this.includeReferenceArray.length; i++) {
                this.filterDescription += this.includeReferenceArray[i];
                if (i != this.includeReferenceArray.length - 1) {
                  this.filterDescription += ', ';
                }
              }
            }
            if (this.excludeReferenceArray.length && this.excludeReferenceText != '') {
              if (this.selectedCategories.length || this.priceRange != '' || (this.includeReferenceArray && this.includeReferenceText != '')) {
                this.filterDescription += ', Referencias excluídas: ';
              } else {
                this.filterDescription += 'Referencias excluídas: ';
              }
              for (let i = 0; i < this.excludeReferenceArray.length; i++) {
                this.filterDescription += this.excludeReferenceArray[i];
                if (i != this.excludeReferenceArray.length - 1) {
                  this.filterDescription += ', ';
                }
              }
            }
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

  changeSelectedCategoryGroupFilter(e) {
    this.selectedCategoryGroupFilter = e.value;
    this.selectedCategoryGroupFilterObject = {...this.categoryList.find(x => x.id === e.value)};
    this.categorySearched = '';
  }

  addCategoryToCategoriesFilter(category) {
    if (this.selectedCategories.some(cat => (cat.id == category.id && cat.group == category.group))) {
      for (let i = 0; i < this.selectedCategories.length; i++) {
        if (this.selectedCategories[i].id == category.id && this.selectedCategories[i].group == category.group) {
          this.selectedCategories.splice(i, 1);
          break;
        }
      }

    } else {
      this.selectedCategories.push(category);
      this.selectedCategories.sort((a, b) => (parseInt(a.group) > parseInt(b.group)) ? 1 : ((parseInt(b.group) > parseInt(a.group)) ? -1 : ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0))));

    }

    this.filterProducts();
    this.filterDescription = '';
    for (let category of this.selectedCategories) {
      let group = this.categoryList.find(x => x.id === parseInt(category.group));
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
    if (this.includeReferenceArray.length && this.includeReferenceText != '') {
      if (this.selectedCategories.length || this.priceRange != '') {
        this.filterDescription += ', Referencias añadidas: ';
      } else {
        this.filterDescription += 'Referencias añadidas: ';
      }
      for (let i = 0; i < this.includeReferenceArray.length; i++) {
        this.filterDescription += this.includeReferenceArray[i];
        if (i != this.includeReferenceArray.length - 1) {
          this.filterDescription += ', ';
        }
      }
    }
    if (this.excludeReferenceArray.length && this.excludeReferenceText != '') {
      if (this.selectedCategories.length || this.priceRange != '' || (this.includeReferenceArray && this.includeReferenceText != '')) {
        this.filterDescription += ', Referencias excluídas: ';
      } else {
        this.filterDescription += 'Referencias excluídas: ';
      }
      for (let i = 0; i < this.excludeReferenceArray.length; i++) {
        this.filterDescription += this.excludeReferenceArray[i];
        if (i != this.excludeReferenceArray.length - 1) {
          this.filterDescription += ', ';
        }
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
      let group = this.categoryList.find(x => x.id === parseInt(category.group));
      this.filterDescription += group.name + ': ' + category.name;
      if (this.selectedCategories.indexOf(category) != this.selectedCategories.length - 1) {
        this.filterDescription += ', ';
      }
    }
    this.filterDescription += this.priceRange;

    if (this.includeReferenceArray.length && this.includeReferenceText != '') {
      if (this.selectedCategories.length || this.priceRange != '') {
        this.filterDescription += ', Referencias añadidas: ';
      } else {
        this.filterDescription += 'Referencias añadidas: ';
      }
      for (let i = 0; i < this.includeReferenceArray.length; i++) {
        this.filterDescription += this.includeReferenceArray[i];
        if (i != this.includeReferenceArray.length - 1) {
          this.filterDescription += ', ';
        }
      }
    }
    if (this.excludeReferenceArray.length && this.excludeReferenceText != '') {
      if (this.selectedCategories.length || this.priceRange != '' || (this.includeReferenceArray && this.includeReferenceText != '')) {
        this.filterDescription += ', Referencias excluídas: ';
      } else {
        this.filterDescription += 'Referencias excluídas: ';
      }
      for (let i = 0; i < this.excludeReferenceArray.length; i++) {
        this.filterDescription += this.excludeReferenceArray[i];
        if (i != this.excludeReferenceArray.length - 1) {
          this.filterDescription += ', ';
        }
      }
    }
    this.filterProducts();
  }

  addIncludeReferenceToFilter() {

    this.includeReferenceArray = this.includeReferenceText.split(",");

    this.filterDescription = '';

    for (let category of this.selectedCategories) {
      let group = this.categoryList.find(x => x.id === parseInt(category.group));
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
    if (this.includeReferenceArray.length && this.includeReferenceText != '') {
      if (this.selectedCategories.length || this.priceRange != '') {
        this.filterDescription += ', Referencias añadidas: ';
      } else {
        this.filterDescription += 'Referencias añadidas: ';
      }
      for (let i = 0; i < this.includeReferenceArray.length; i++) {
        this.filterDescription += this.includeReferenceArray[i].trim();
        if (i != this.includeReferenceArray.length - 1) {
          this.filterDescription += ', ';
        }
      }
    }
    if (this.excludeReferenceArray.length && this.excludeReferenceText != '') {
      if (this.selectedCategories.length || this.priceRange != '' || (this.includeReferenceArray && this.includeReferenceText != '')) {
        this.filterDescription += ', Referencias excluídas: ';
      } else {
        this.filterDescription += 'Referencias excluídas: ';
      }
      for (let i = 0; i < this.excludeReferenceArray.length; i++) {
        this.filterDescription += this.excludeReferenceArray[i].trim();
        if (i != this.excludeReferenceArray.length - 1) {
          this.filterDescription += ', ';
        }
      }
    }
  }

  addExcludeReferenceToFilter() {

    this.excludeReferenceArray = this.excludeReferenceText.split(",");

    this.filterDescription = '';

    for (let category of this.selectedCategories) {
      let group = this.categoryList.find(x => x.id === parseInt(category.group));
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
    if (this.includeReferenceArray.length && this.includeReferenceText != '') {
      if (this.selectedCategories.length || this.priceRange != '') {
        this.filterDescription += ', Referencias añadidas: ';
      } else {
        this.filterDescription += 'Referencias añadidas: ';
      }
      for (let i = 0; i < this.includeReferenceArray.length; i++) {
        this.filterDescription += this.includeReferenceArray[i].trim();
        if (i != this.includeReferenceArray.length - 1) {
          this.filterDescription += ', ';
        }
      }
    }
    if (this.excludeReferenceArray.length && this.excludeReferenceText != '') {
      if (this.selectedCategories.length || this.priceRange != '' || (this.includeReferenceArray && this.includeReferenceText != '')) {
        this.filterDescription += ', Referencias excluídas: ';
      } else {
        this.filterDescription += 'Referencias excluídas: ';
      }
      for (let i = 0; i < this.excludeReferenceArray.length; i++) {
        this.filterDescription += this.excludeReferenceArray[i].trim();
        if (i != this.excludeReferenceArray.length - 1) {
          this.filterDescription += ', ';
        }
      }
    }
  }

  deletePriceRangeFromFilter() {
    this.minPriceFilter = '';
    this.maxPriceFilter = '';
    this.priceRange = '';
    this.filterDescription = '';

    for (let category of this.selectedCategories) {
      let group = this.categoryList.find(x => x.id === parseInt(category.group));
      this.filterDescription += group.name + ': ' + category.name;
      if (this.selectedCategories.indexOf(category) != this.selectedCategories.length - 1) {
        this.filterDescription += ', ';
      }
    }

    if (this.includeReferenceArray.length && this.includeReferenceText != '') {
      if (this.selectedCategories.length || this.priceRange != '') {
        this.filterDescription += ', Referencias añadidas: ';
      } else {
        this.filterDescription += 'Referencias añadidas: ';
      }
      for (let i = 0; i < this.includeReferenceArray.length; i++) {
        this.filterDescription += this.includeReferenceArray[i];
        if (i != this.includeReferenceArray.length - 1) {
          this.filterDescription += ', ';
        }
      }
    }
    if (this.excludeReferenceArray.length && this.excludeReferenceText != '') {
      if (this.selectedCategories.length || this.priceRange != '' || (this.includeReferenceArray && this.includeReferenceText != '')) {
        this.filterDescription += ', Referencias excluídas: ';
      } else {
        this.filterDescription += 'Referencias excluídas: ';
      }
      for (let i = 0; i < this.excludeReferenceArray.length; i++) {
        this.filterDescription += this.excludeReferenceArray[i];
        if (i != this.excludeReferenceArray.length - 1) {
          this.filterDescription += ', ';
        }
      }
    }
  }

  deleteIncludeReferenceFromFilter() {
    this.includeReferenceText = '';
    this.includeReferenceArray = [];

    this.filterDescription = '';

    for (let category of this.selectedCategories) {
      let group = this.categoryList.find(x => x.id === parseInt(category.group));
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

    if (this.excludeReferenceArray.length && this.excludeReferenceText != '') {
      if (this.selectedCategories.length || this.priceRange != '') {
        this.filterDescription += ', Referencias excluídas: ';
      } else {
        this.filterDescription += 'Referencias excluídas: ';
      }
      for (let i = 0; i < this.excludeReferenceArray.length; i++) {
        this.filterDescription += this.excludeReferenceArray[i].trim();
        if (i != this.excludeReferenceArray.length - 1) {
          this.filterDescription += ', ';
        }
      }
    }
  }

  deleteExcludeReferenceFromFilter() {
    this.excludeReferenceText = '';
    this.excludeReferenceArray = [];

    this.filterDescription = '';

    for (let category of this.selectedCategories) {
      let group = this.categoryList.find(x => x.id === parseInt(category.group));
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
    if (this.includeReferenceArray.length && this.includeReferenceText != '') {
      if (this.selectedCategories.length || this.priceRange != '') {
        this.filterDescription += ', Referencias añadidas: ';
      } else {
        this.filterDescription += 'Referencias añadidas: ';
      }
      for (let i = 0; i < this.includeReferenceArray.length; i++) {
        this.filterDescription += this.includeReferenceArray[i].trim();
        if (i != this.includeReferenceArray.length - 1) {
          this.filterDescription += ', ';
        }
      }
    }
  }

  priceRangeIsInFilter() {
    return (this.priceRange != '');
  }

  includeReferenceIsInFilter() {
    return (this.includeReferenceText != '' && this.includeReferenceArray.length);
  }

  excludeReferenceIsInFilter() {
    return (this.excludeReferenceText != '' && this.excludeReferenceArray.length);
  }

  formatMinPriceCurrency() {
    if (this.minPriceFilter == '') {
      return true;
    }

    return (/^[0-9]+(\.[0-9]{1,2})?$/.test(this.minPriceFilter));

  }

  formatIncludeReferences() {
    if (this.includeReferenceText == '') {
      return true;
    }

    return (/^[0-9]+(,\s?[0-9]+)*$/.test(this.includeReferenceText));
  }

  formatExcludeReferences() {
    if (this.excludeReferenceText == '') {
      return true;
    }

    return (/^[0-9]+(,\s?[0-9]+)*$/.test(this.excludeReferenceText));
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

  addIncludeReferenceButtonActivation() {
    if (this.excludeReferenceArray.length && this.excludeReferenceText != '') {
      let includeArray = this.includeReferenceText.split(",");
      for (let i = 0; i < includeArray.length; i++) {
        for (let j = 0; j < this.excludeReferenceArray.length; j++) {
          if (includeArray[i].trim() == this.excludeReferenceArray[j].trim()) {
            return false;
          }
        }
      }
    }
    return (/^[0-9]+(,\s?[0-9]+)*$/.test(this.includeReferenceText));
  }

  addExcludeReferenceButtonActivation() {
    if (this.includeReferenceArray.length && this.includeReferenceText != '') {
      let excludeArray = this.excludeReferenceText.split(",");
      for (let i = 0; i < excludeArray.length; i++) {
        for (let j = 0; j < this.includeReferenceArray.length; j++) {
          if (excludeArray[i].trim() == this.includeReferenceArray[j].trim()) {
            return false;
          }
        }
      }
    }
    return (/^[0-9]+(,\s?[0-9]+)*$/.test(this.excludeReferenceText));
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

  selectCategoryRow(category) {
    if (this.selectedDestinationCategories.some(cat => (cat.id == category.id))) {
      for (let i = 0; i < this.selectedDestinationCategories.length; i++) {
        if (this.selectedDestinationCategories[i].id == category.id) {
          this.selectedDestinationCategories.splice(i, 1);
          break;
        }
      }
    } else {
      this.selectedDestinationCategories.push(category);
    }
  }

  filterProducts() {

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

        return this.selectedDestinationCategories.length;

        break;

      default:
        return false;
        break;
    }
  }

  async finishCreateRule() {
    if (this.ruleName != '') {

      let rule = null;
      let description = '';

      switch (this.ruleFilterType) {

        case 'enabling':

          if (this.includeReferenceArray.length && this.includeReferenceText != '') {
            for (let includeReference of this.includeReferenceArray) {
              this.referencesExceptions.push({reference: includeReference.trim(), type: 'include'});
            }
          }

          if (this.excludeReferenceArray.length && this.excludeReferenceText != '') {
            for (let excludeReference of this.excludeReferenceArray) {
              this.referencesExceptions.push({reference: excludeReference.trim(), type: 'exclude'});
            }
          }

          if (this.selectedCategories.length || (this.minPriceFilter != '' && this.minPriceFilter != '') || this.includeReferenceArray.length || this.excludeReferenceArray.length) {
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

            if (this.includeReferenceArray.length) {
              if (this.selectedCategories.length || (this.minPriceFilter != '' && this.minPriceFilter != '')) {
                description += ', ';
              }
              description += 'Referencias añadidas: ';
              for (let i = 0; i < this.includeReferenceArray.length; i++) {
                description += this.includeReferenceArray[i];
                if (i != this.includeReferenceArray.length - 1) {
                  description += ', ';
                }
              }
            }

            if (this.excludeReferenceArray.length) {
              if (this.selectedCategories.length || (this.minPriceFilter != '' && this.minPriceFilter != '') || this.includeReferenceArray.length) {
                description += ', ';
              }
              description += 'Referencias excluídas: ';
              for (let i = 0; i < this.excludeReferenceArray.length; i++) {
                description += this.excludeReferenceArray[i];
                if (i != this.excludeReferenceArray.length - 1) {
                  description += ', ';
                }
              }
            }

          }

          rule = {
            name: this.ruleName,
            filterType: this.ruleFilterType,
            categoriesFilter: this.selectedCategories,
            minPriceFilter: this.minPriceFilter == '' ? '0.00' : this.minPriceFilter,
            maxPriceFilter: this.maxPriceFilter == '' ? '0.00' : this.maxPriceFilter,
            products: this.numberOfProducts,
            destinationCategories: [],
            referencesExceptions: this.referencesExceptions,
            description
          };
          break;

        case 'categories':

          if (this.includeReferenceArray.length && this.includeReferenceText != '') {
            for (let includeReference of this.includeReferenceArray) {
              this.referencesExceptions.push({reference: includeReference.trim(), type: 'include'});
            }
          }

          if (this.excludeReferenceArray.length && this.excludeReferenceText != '') {
            for (let excludeReference of this.excludeReferenceArray) {
              this.referencesExceptions.push({reference: excludeReference.trim(), type: 'exclude'});
            }
          }

          if (this.selectedCategories.length || (this.minPriceFilter != '' && this.minPriceFilter != '') || this.includeReferenceArray.length || this.excludeReferenceArray.length) {
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

            if (this.includeReferenceArray.length) {
              if (this.selectedCategories.length || (this.minPriceFilter != '' && this.minPriceFilter != '')) {
                description += ', ';
              }
              description += 'Referencias añadidas: ';
              for (let i = 0; i < this.includeReferenceArray.length; i++) {
                description += this.includeReferenceArray[i];
                if (i != this.includeReferenceArray.length - 1) {
                  description += ', ';
                }
              }
            }

            if (this.excludeReferenceArray.length) {
              if (this.selectedCategories.length || (this.minPriceFilter != '' && this.minPriceFilter != '') || this.includeReferenceArray.length) {
                description += ', ';
              }
              description += 'Referencias excluídas: ';
              for (let i = 0; i < this.excludeReferenceArray.length; i++) {
                description += this.excludeReferenceArray[i];
                if (i != this.excludeReferenceArray.length - 1) {
                  description += ', ';
                }
              }
            }

          }

          rule = {
            name: this.ruleName,
            filterType: this.ruleFilterType,
            categoriesFilter: this.selectedCategories,
            minPriceFilter: this.minPriceFilter == '' ? '0.00' : this.minPriceFilter,
            maxPriceFilter: this.maxPriceFilter == '' ? '0.00' : this.maxPriceFilter,
            products: this.numberOfProducts,
            destinationCategories: this.selectedDestinationCategories,
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

  searchCategories() {
    this.selectedCategoryGroupFilterObject.items = this.categoryList.find(x => x.id === this.selectedCategoryGroupFilter).items.slice();
    if (this.categorySearched && this.categorySearched.trim() != '') {
      let categories = [];
      for (let category of this.selectedCategoryGroupFilterObject.items) {
        if (category.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.categorySearched.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          categories.push(category);
        }
      }
      this.selectedCategoryGroupFilterObject.items = categories.slice();
    }

  }

  checkCategorySelected(category) {
    return this.selectedDestinationCategories.some(cat => (cat.id == category.id && cat.group == category.group));
  }

  filterWithSearcher() {
    return (this.selectedCategoryGroupFilter != 18 && this. selectedCategoryGroupFilter != 19 && this.selectedCategoryGroupFilter != 20);
  }
}
