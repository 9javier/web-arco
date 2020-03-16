import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {NewRuleComponent} from './new-rule/new-rule.component';
import {MarketplacesService} from '../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';
import {MatTableDataSource} from '@angular/material';

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

  private market;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private marketplacesService: MarketplacesService,
  ) {
  }

  ngOnInit() {

    this.dataSourceCategories = [];
    this.dataSourceRulesCategories = new MatTableDataSource(this.dataSourceCategories);
    this.displayedCategoriesColumns = ['name', 'categories', 'products', 'edit'];

    this.dataSourceEnabling = [];
    this.dataSourceRulesEnabling = new MatTableDataSource(this.dataSourceEnabling);
    this.displayedEnablingColumns = ['name', 'categories', 'products', 'edit'];

    this.marketplacesService.getMarkets().subscribe((data: any) => {
      this.market = null;
      if (data && data.length) {
        for (let market of data) {
          switch (this.route.snapshot.data['name']) {
            case "Miniprecios":
              this.market = market.id;
              break;
          }

          if (this.market) {
            break;
          }
        }
      }
      this.getValues();
    });



  }

  getValues() {
    this.dataSourceEnabling = [];
    this.dataSourceCategories = [];
    this.marketplacesService.getRulesConfigurationsByMarket(this.market).subscribe((data: any) => {
      if (data.data && data.data.length) {
        console.log(data.data)
        for (let ruleConfiguration of data.data) {
          let type = "";
          let categories = [];
          switch (ruleConfiguration.type) {
            case 0:
              break;
            case "disabling":
              type = "enabling";
              break;
            case "categories":
              type = "categories";
              categories = ruleConfiguration.productCategories;
              break;
          }
          let rule = {
            id: ruleConfiguration.id,
            name: ruleConfiguration.name,
            filterType: type,
            categoriesFilter: [],
            minPriceFilter: "0.00",
            maxPriceFilter: "0.00",
            products: 132824,
            destinationCategories: [],
            referencesExceptions: [],
            description: ruleConfiguration.description,
            categories: categories
          };

          if (ruleConfiguration.rulesFilters) {
            for (let ruleFilter of ruleConfiguration.rulesFilters) {
              let category = {
                id: ruleFilter.id,
                name: ruleFilter.name,
                externalId: ruleFilter.externalId,
                type: ruleFilter.ruleFilterType,
                group: 0
              };
              switch (ruleFilter.ruleFilterType) {
                case 2:
                  category.group = ruleFilter.dataGroup;
                  break;
                case 3:
                  category.group = 16;
                  break;
                case 4:
                  category.group = 17;
                  break;
                case 5:
                  category.group = 15;
                  break;
              }
              rule.categoriesFilter.push(category);
            }
          }

          if (ruleConfiguration.referenceExceptions) {
            for (let exception of ruleConfiguration.referenceExceptions) {
              rule.referencesExceptions.push(
                {
                  reference: exception.reference,
                  type: exception.exceptionType ? "include" : "exclude"
                }
              );
            }
          }

          switch (rule.filterType) {
            case "enabling":
              this.dataSourceEnabling.push(rule);
              break;

            case "categories":
              this.dataSourceCategories.push(rule);
              break;
          }

        }

        this.dataSourceRulesEnabling = new MatTableDataSource(this.dataSourceEnabling);
        this.dataSourceRulesCategories = new MatTableDataSource(this.dataSourceCategories);
      }
    });
  }

  async openModalNewRule(ruleFilterType): Promise<void> {
    let modal = await this.modalController.create({
      component: NewRuleComponent,
      componentProps: {
        ruleFilterType,
        mode: 'create',
        market: this.market
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data && data.data) {

        let ruleConfiguration = {
          name: data.data.name,
          description: data.data.description,
          type: "disabling",
          status: "active",
          ruleFilters: [],
          marketIDs: [
            this.market
          ],
          /*referenceExceptions: {},
          ruleDataValidactionAttributes: [
          ],*/
          categories: []
        };

        switch (data.data.filterType) {
          case "enabling":
            ruleConfiguration.type = "disabling";
            break;

          case "categories":
            ruleConfiguration.type = "categories";
            break;
        }

        for (let category of data.data.categoriesFilter) {
          switch (category.type) {
            case 2:
              ruleConfiguration.ruleFilters.push(
                {
                  id: category.id,
                  name: category.name,
                  type: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 'active'
                }
              );
              break;
            case 3:
              ruleConfiguration.ruleFilters.push(
                {
                  id: category.id,
                  name: category.name,
                  type: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 'active'
                }
              );
              break;
            case 4:
              ruleConfiguration.ruleFilters.push(
                {
                  id: category.id,
                  name: category.name,
                  type: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 'active'
                }
              );
              break;
            case 5:
              ruleConfiguration.ruleFilters.push(
                {
                  id: category.id,
                  name: category.name,
                  type: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 'active'
                }
              );
              break;
          }
        }

      /*let exceptions = {};
        data.data.referencesExceptions.forEach(item => {
          if (item.type == 'include') {
            exceptions[item.reference] = 1;
          } else {
            exceptions[item.reference] = 0;
          }
        });
        
        ruleConfiguration.referenceExceptions = exceptions;*/

        let categoriesToSend = [];
        data.data.destinationCategories.forEach(category => {
          categoriesToSend.push({
            name: category.name,
            marketCategoryID: category.market_category_id
          });
        });

        ruleConfiguration.categories = categoriesToSend;

        console.log(ruleConfiguration)
        this.marketplacesService.postRulesConfigurations(ruleConfiguration).subscribe(data => {
          this.getValues();
        });
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
        ruleName: rule.name,
        selectedCategories: rule.categoriesFilter,
        minPriceFilter: rule.minPriceFilter,
        maxPriceFilter: rule.maxPriceFilter,
        numberOfProducts: rule.products,
        selectedDestinationCategories: rule.categories,
        referencesExceptions: rule.referencesExceptions,
        id: rule.id,
        mode: 'edit',
        market: this.market
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data && data.data) {

        console.log(data.data)

        let ruleConfiguration = {
          name: data.data.name,
          description: data.data.description,
          type: "disabling",
          status: 'active',
          ruleFilters: [],
          marketIDs: [
            this.market
          ],
          /*referenceExceptions: {},
          ruleDataValidactionAttributes: [
          ],*/
          categories: []
        };

        switch (data.data.filterType) {
          case "enabling":
            ruleConfiguration.type = "disabling";
            break;

          case "categories":
            ruleConfiguration.type = "categories";
            break;
        }

        for (let category of data.data.categoriesFilter) {
          switch (category.type) {
            case 2:
              ruleConfiguration.ruleFilters.push(
                {
                  name: category.name,
                  type: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 'active'
                }
              );
              break;
            case 3:
              ruleConfiguration.ruleFilters.push(
                {
                  name: category.name,
                  type: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 'active'
                }
              );
              break;
            case 4:
              ruleConfiguration.ruleFilters.push(
                {
                  name: category.name,
                  type: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 'active'
                }
              );
              break;
            case 5:
              ruleConfiguration.ruleFilters.push(
                {
                  name: category.name,
                  type: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 'active'
                }
              );
              break;
          }
        }

       /* let exceptions = {};
        data.data.referencesExceptions.forEach(item => {
          if (item.type == 'include') {
            exceptions[item.reference] = 1;
          } else {
            exceptions[item.reference] = 0;
          }
        });

        ruleConfiguration.referenceExceptions = exceptions;*/

        console.log(ruleConfiguration)

        this.marketplacesService.updateRulesConfigurations(ruleToEdit.id, ruleConfiguration).subscribe(data => {
          this.getValues();
        });
      }
    });
    modal.present();
  }

}
