import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketplacesService } from '../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'suite-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.scss']
})

export class MappingsComponent implements OnInit {


  displayedBrandsColumns: string[] = ['avelonData', 'marketData'];
  dataSourceBrands: any;

  displayedColorsColumns: string[] = ['avelonData', 'marketData'];
  dataSourceColors: any;

  displayedSizesColumns: string[] = ['avelonData', 'marketData'];
  dataSourceSizes: any;

  enumTypes = [];
  brandsList = [];
  colorsList = [];
  sizesList = [];

  avelonDataBrands = [];
  avelonDataColors = [];
  avelonDataSizes = [];

  constructor(
      private route: ActivatedRoute,
      private router : Router,
      private marketplacesService: MarketplacesService
    ) {
    console.log(this.route.snapshot.data['name']) 
  }

  ngOnInit() {
    this.getEntities();
    this.getMaps();
  }

  getEntities() {
    this.marketplacesService.getMapEntities().subscribe(data => {
      if(data && data.enumItem) {
        this.enumTypes = data.enumItem;
        console.log(this.enumTypes)
      } else {
        console.log('error')
      }
    })
  }

  getMaps() {
    this.marketplacesService.getMapDataRules().subscribe(data => {
      if(data) {
        data.forEach(item => {
          switch(item.typeMapped) {
            case 3:
              this.colorsList.push(item);
              break;
            case 4:
              this.sizesList.push(item);
              break;
            case 5:
              this.brandsList.push(item);
              break;
          }
        });
        this.dataSourceColors = new MatTableDataSource(this.colorsList);
        this.dataSourceSizes = new MatTableDataSource(this.sizesList);
        this.dataSourceBrands = new MatTableDataSource(this.brandsList);
      } else {
        console.log('error')
      }
    })
  }

  brandsFilter(filterValue: string) {
    this.dataSourceBrands.filter = filterValue.trim().toLowerCase();
  }

  colorsFilter(filterValue: string) {
    this.dataSourceColors.filter = filterValue.trim().toLowerCase();
  }

  sizesFilter(filterValue: string) {
    this.dataSourceSizes.filter = filterValue.trim().toLowerCase();
  }

  changeBrandSelect(e) {
    console.log(e.value)
  }

  changeColorSelect(e) {
    console.log(e.value)
  }

  changeSizeSelect(e) {
    console.log(e.value)
  }

}
