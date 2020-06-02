import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MarketplacesPrestaService } from 'libs/services/src/lib/endpoint/marketplaces-presta/marketplaces-presta.service';
import { MarketplacesService } from 'libs/services/src/lib/endpoint/marketplaces/marketplaces.service';

@Component({
  selector: 'suite-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @ViewChild('paginatorCategories') paginatorCategories: MatPaginator;

  marketCategories = [];
  displayedColumns: string[] = ['check', 'id', 'name'];
  dataSource = new MatTableDataSource();

  constructor(
    private modalController: ModalController,
    private marketplacesService: MarketplacesService,
    private marketplacesPrestaService: MarketplacesPrestaService
  ) { }

  ngOnInit() {

    this.marketplacesPrestaService.getCategories().subscribe(data => {
      if(data) {
        data.data.forEach(item => {
          this.marketCategories.push({
            id: item.id_category,
            name: item.name
          });
        });
        this.dataSource = new MatTableDataSource(this.marketCategories);
        setTimeout(() => this.dataSource.paginator = this.paginatorCategories);
      }
    })
  }

  close(data) {
    this.modalController.dismiss(data);
  }

  checkCategorySelected(category) {
    
    let data = {
      name: category.name,
      market_category_id: category.id
    };

    this.marketplacesService.postProductCategory(data).subscribe(data => {
      console.log(data);
    })
  }
}
