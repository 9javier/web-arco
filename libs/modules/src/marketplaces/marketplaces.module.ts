import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MarketplacesComponent } from './marketplaces.component';
import { IonicModule } from '@ionic/angular';

//style libraries
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatSelectModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';

//Components
import { CatalogComponent } from './catalog/catalog.component';
import { CatalogMarketplacesComponent } from './catalog-marketplaces/catalog-marketplaces.component';
import { StorePriorityComponent } from './store-priority/store-priority.component';
import { LogisticsOperators } from './logistics-operators/logistics-operators.component';
import { MappingsComponent } from './mappings/mappings.component';
import { RulesComponent } from './rules/rules.component';
import { RulesModule } from './rules/rules.module';
import { SecurityStocksComponent } from './security-stocks/security-stocks.component';
import {CategorizeProductsModule} from "./catalog/modals/categorize-products/categorize-products.module";
import {FormsModule} from "@angular/forms";
import {LogisticsOperatorsModule} from "./logistics-operators/logistics-operators.module";

import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';

import {InfoModalModule} from "./info-modal/info-modal.module";

const routes: Routes = [
  {
    path: '',
    component: MarketplacesComponent
  },
  {
    path: 'catalogs-marketplaces',
    component: CatalogMarketplacesComponent,
    data: {
      name: 'Catálogo Marketplaces'
    }
  },

  //KrackOnline
  {
    path: 'miniprecios/catalog',
    component: CatalogComponent,
    data: {
      name: 'Miniprecios'
    }
  },{
    path: 'miniprecios/mapping',
    component: MappingsComponent,
    data: {
      name: 'Miniprecios'
    }
  },
  {
    path: 'miniprecios/rules',
    component: RulesComponent,
    data: {
      name: 'Miniprecios'
    }
  },
  {
    path: 'miniprecios/security-stocks',
    component: SecurityStocksComponent,
    data: {
      name: 'Miniprecios'
    }
  },
  {
    path: 'amazon/catalog',
    component: CatalogComponent,
    data: {
      name: 'Amazon'
    }
  },{
    path: 'amazon/mapping',
    component: MappingsComponent,
    data: {
      name: 'Amazon'
    }
  },
  {
    path: 'amazon/rules',
    component: RulesComponent,
    data: {
      name: 'Amazon'
    }
  },
  {
    path: 'amazon/security-stocks',
    component: SecurityStocksComponent,
    data: {
      name: 'Amazon'
    }
  },

  //-----------
  {
    path: 'store-priority',
    component: StorePriorityComponent,
    data: {
      name: 'Prioridad de Tienda'
    }
  },

  {
    path: 'logistics-operators',
    component: LogisticsOperators,
    data: {
      name: 'Parametrización logística'
    }
  }
];

@NgModule({
  declarations: [
    MarketplacesComponent,
    CatalogMarketplacesComponent,
    CatalogComponent,
    MappingsComponent,
    RulesComponent,
    SecurityStocksComponent,
    StorePriorityComponent,
    LogisticsOperators
  ],
  entryComponents: [MarketplacesComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,
    RulesModule,
    CategorizeProductsModule,
    LogisticsOperatorsModule,
    MatListModule,
    MatPaginatorModule,
    FormsModule,
    PaginatorComponentModule,
    InfoModalModule
  ]
})
export class MarketplacesModule { }
