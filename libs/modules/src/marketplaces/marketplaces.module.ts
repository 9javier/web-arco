import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MarketplacesComponent } from './marketplaces.component';
import { IonicModule } from '@ionic/angular';
import { CatalogComponent } from './catalog/catalog.component';
import { CatalogMarketplacesComponent } from './catalog-marketplaces/catalog-marketplaces.component';
import { StorePriorityComponent } from './store-priority/store-priority.component';


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
  {
    path: 'krackonline/catalog',
    component: CatalogComponent,
    data: {
      name: 'KrackOnline'
    }
  },
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
    StorePriorityComponent
  ],
  entryComponents: [MarketplacesComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class MarketplacesModule { }