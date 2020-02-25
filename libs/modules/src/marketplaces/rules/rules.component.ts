import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {NewRuleComponent} from './new-rule/new-rule.component';
import {CategoriesComponent} from '../categories/categories.component';

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

  /*private dataSourceStocks;
  private dataSourceRulesStocks;
  private displayedStocksColumns;*/

  private market = "";

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private marketplacesService: MarketplacesService,
  ) {
    switch (this.route.snapshot.data['name']) {
      case "Miniprecios":
        this.market = "1";
        break;
    }
  }

  ngOnInit() {

    this.dataSourceCategories = [];
    this.dataSourceRulesCategories = new MatTableDataSource(this.dataSourceCategories);
    this.displayedCategoriesColumns = ['name', 'categories', 'products', 'edit'];

    this.dataSourceEnabling = [];
    this.dataSourceRulesEnabling = new MatTableDataSource(this.dataSourceEnabling);
    this.displayedEnablingColumns = ['name', 'categories', 'products', 'edit'];

    /*this.dataSourceStocks = [];
    this.dataSourceRulesStocks = new MatTableDataSource(this.dataSourceStocks);
    this.displayedStocksColumns = ['name', 'stock', 'products', 'edit'];*/

    this.getValues();

  }

  getValues() {
    this.dataSourceEnabling = [];
    this.marketplacesService.getRulesConfigurations(this.market).subscribe((data: any) => {
      if (data && data.length) {
        for (let ruleConfiguration of data) {
          let rule = {
            id: ruleConfiguration.id,
            name: ruleConfiguration.name,
            filterType: "enabling",
            categoriesFilter: [],
            minPriceFilter: "0.00",
            maxPriceFilter: "0.00",
            // stockFilter: 0,
            products: 132824,
            destinationCategories: [],
            // stockToReduce: 0,
            referencesExceptions: [],
            description: ruleConfiguration.description
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
                  category.group = ruleConfiguration.dataGroup;
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

          this.dataSourceEnabling.push(rule);

        }

        this.dataSourceRulesEnabling = new MatTableDataSource(this.dataSourceEnabling);
      }
    });
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
      if (data && data.data) {

        let ruleConfiguration = {
          name: data.data.name,
          description: data.data.description,
          status: 1,
          rulesFilterIds: [],
          marketsIds: [
            this.market
          ],
          referenceExceptions: {},
          ruleDataValidactionAttributes: [
          ]
        };

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
        
        ruleConfiguration.referenceExceptions = exceptions;

        this.marketplacesService.postRulesConfigurations(ruleConfiguration).subscribe(data => {
          this.getValues();
        });
      }
    });

    modal.present();
  }

  async openModalCategories(): Promise<void> {
    let modal = await this.modalController.create({
      component: CategoriesComponent
    });

    modal.onDidDismiss().then((data) => {})

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
        // stockFilter: rule.stockFilter,
        numberOfProducts: rule.products,
        selectedDestinationCategories: rule.destinationCategories,
        // stockToReduce: rule.stockToReduce,
        referencesExceptions: rule.referencesExceptions,
        id: rule.id,
        mode: 'edit'
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data && data.data) {

        let ruleConfiguration = {
          id: ruleToEdit.id,
          name: data.data.name,
          description: data.data.description,
          status: 1,
          rulesFilterIds: [],
          marketsIds: [
            this.market
          ],
          referenceExceptions: {},
          ruleDataValidactionAttributes: [
          ]
        };

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

        ruleConfiguration.referenceExceptions = exceptions;

        this.marketplacesService.updateRulesConfigurations(ruleToEdit.id, ruleConfiguration).subscribe(data => {
          this.getValues();
        });
      }
    });
    modal.present();
  }

}
