import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MarketplacesComponent } from './marketplaces.component';
import { IonicModule } from '@ionic/angular';
import { CatalogComponent } from './catalog/catalog.component';
import { CatalogMarketplacesComponent } from './catalog-marketplaces/catalog-marketplaces.component';
import { StorePriorityComponent } from './store-priority/store-priority.component';
import { MappingsComponent } from './mappings/mappings.component';
import { RulesComponent } from './rules/rules.component';
import { SecurityStocksComponent } from './security-stocks/security-stocks.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';

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
    path: 'krackonline/catalog',
    component: CatalogComponent,
    data: {
      name: 'KrackOnline'
    }
  },{
    path: 'krackonline/mapping',
    component: MappingsComponent,
    data: {
      name: 'KrackOnline'
    }
  },
  {
    path: 'krackonline/rules',
    component: RulesComponent,
    data: {
      name: 'KrackOnline'
    }
  },
  {
    path: 'krackonline/security-stocks',
    component: SecurityStocksComponent,
    data: {
      name: 'KrackOnline'
    }
  },

  //Miniprecios
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

  //-----------
  {
    path: 'store-priority',
    component: StorePriorityComponent,
    data: {
      name: 'Prioridad de Tienda'
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
    StorePriorityComponent
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
    MatInputModule
  ]
})
export class MarketplacesModule { }