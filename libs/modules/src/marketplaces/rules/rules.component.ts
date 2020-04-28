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
  private marketExternalId;

  private static readonly MINIPRECIOS_MARKET_ID = '406A51C8-EA12-4D6D-B05D-C2EA70A1A609';

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
              this.marketExternalId = RulesComponent.MINIPRECIOS_MARKET_ID;
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
    this.marketplacesService.getRulesConfigurations(this.marketExternalId).subscribe((data: any) => {
      if (data && data.length) {
        for (let ruleConfiguration of data) {
          let type = "";
          let categories = [];
          switch (ruleConfiguration.ruleType) {
            case 0:
              break;
            case 1:
              type = "enabling";
              break;
            case 2:
              type = "categories";
              categories = ruleConfiguration.categories;
              break;
          }
          let rule = {
            id: ruleConfiguration.id,
            name: ruleConfiguration.name,
            filterType: type,
            categoriesFilter: [],
            minPriceFilter: ruleConfiguration.minPriceFilter,
            maxPriceFilter: ruleConfiguration.maxPriceFilter,
            products: ruleConfiguration.products,
            referencesExceptions: [],
            description: ruleConfiguration.description,
            categories: categories
          };

          if (ruleConfiguration.ruleFilters) {
            for (let ruleFilter of ruleConfiguration.ruleFilters) {
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
        market: this.market,
        marketExternalId: this.marketExternalId
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data && data.data) {

        let ruleConfiguration = {
          name: data.data.name,
          description: data.data.description,
          ruleType: 0,
          status: 1,
          rulesFilterIds: [],
          marketsIds: [
            this.marketExternalId
          ],
          referenceException: {},
          ruleDataValidactionAttributes: [
          ],
          categories: data.data.destinationCategories,
          minPriceFilter: data.data.minPriceFilter,
          maxPriceFilter: data.data.maxPriceFilter,
          products: data.data.products
        };

        switch (data.data.filterType) {
          case "enabling":
            ruleConfiguration.ruleType = 1;
            break;

          case "categories":
            ruleConfiguration.ruleType = 2;
            break;
        }

        for (let category of data.data.categoriesFilter) {
          switch (category.type) {
            case 2:
              ruleConfiguration.rulesFilterIds.push(
                {
                  id: category.id,
                  name: category.name,
                  ruleFilterType: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 1
                }
              );
              break;
            case 3:
              ruleConfiguration.rulesFilterIds.push(
                {
                  id: category.id,
                  name: category.name,
                  ruleFilterType: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 1
                }
              );
              break;
            case 4:
              ruleConfiguration.rulesFilterIds.push(
                {
                  id: category.id,
                  name: category.name,
                  ruleFilterType: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 1
                }
              );
              break;
            case 5:
              ruleConfiguration.rulesFilterIds.push(
                {
                  id: category.id,
                  name: category.name,
                  ruleFilterType: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 1
                }
              );
              break;
          }
        }

        let exceptions = {};
        data.data.referencesExceptions.forEach(item => {
          if (item.type == 'include') {
            exceptions[item.reference] = 1;
          } else {
            exceptions[item.reference] = 0;
          }
        });

        ruleConfiguration.referenceException = exceptions;

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
        market: this.market,
        marketExternalId: this.marketExternalId
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data && data.data) {

        let ruleConfiguration = {
          id: ruleToEdit.id,
          name: data.data.name,
          description: data.data.description,
          ruleType: 0,
          status: 1,
          rulesFilterIds: [],
          marketsIds: [
            this.marketExternalId
          ],
          referenceException: {},
          ruleDataValidactionAttributes: [
          ],
          categories: data.data.destinationCategories,
          minPriceFilter: data.data.minPriceFilter,
          maxPriceFilter: data.data.maxPriceFilter,
          products: data.data.products
        };

        switch (data.data.filterType) {
          case "enabling":
            ruleConfiguration.ruleType = 1;
            break;

          case "categories":
            ruleConfiguration.ruleType = 2;
            break;
        }

        for (let category of data.data.categoriesFilter) {
          switch (category.type) {
            case 2:
              ruleConfiguration.rulesFilterIds.push(
                {
                  id: category.id,
                  name: category.name,
                  ruleFilterType: category.type,
                  externalId: category.externalId,
                  dataGroup: category.group,
                  status: 1
                }
              );
              break;
            case 3:
              ruleConfiguration.rulesFilterIds.push(
                {
                  id: category.id,
                  name: category.name,
                  ruleFilterType: category.type,
                  externalId: category.externalId,
                  status: 1
                }
              );
              break;
            case 4:
              ruleConfiguration.rulesFilterIds.push(
                {
                  id: category.id,
                  name: category.name,
                  ruleFilterType: category.type,
                  externalId: category.externalId,
                  status: 1
                }
              );
              break;
            case 5:
              ruleConfiguration.rulesFilterIds.push(
                {
                  id: category.id,
                  name: category.name,
                  ruleFilterType: category.type,
                  externalId: category.externalId,
                  status: 1
                }
              );
              break;
          }
        }

        let exceptions = {};
        data.data.referencesExceptions.forEach(item => {
          if (item.type == 'include') {
            exceptions[item.reference] = 1;
          } else {
            exceptions[item.reference] = 0;
          }
        });

        ruleConfiguration.referenceException = exceptions;

        this.marketplacesService.updateRulesConfigurations(ruleToEdit.id, ruleConfiguration).subscribe(data => {
          this.getValues();
        });
      }
    });
    modal.present();
  }

}
