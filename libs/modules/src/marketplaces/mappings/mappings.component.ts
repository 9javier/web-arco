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


  /// DATOS ESTÁTICOS. BORRAR CUANDO LAS CONEXIONES CON KRACKONLINE, AVELON Y MIDDLEWARE/RULE-ENGINE ESTÉN LISTAS
  //  Brands
  private dataSourceBrands = [
    {
      id: 1,
      avelonData: {id: 1, name: 'ADIDAS SL'},
      marketData: {id: 1, name: 'ADIDAS'}
    },
    {
      id: 2,
      avelonData: {id: 2, name: 'AMANDA A.'},
      marketData: {id: -1, name: null}
    },
    {
      id: 3,
      avelonData: {id: 3, name: 'ASICS'},
      marketData: {id: 3, name: 'ASICS'}
    }
  ];

  private brandsList = [
    {id: 1, name: 'ADIDAS'},
    {id: 2, name: 'AMANDA'},
    {id: 3, name: 'ASICS'},
  ];

  // Colors

  private dataSourceColors = [
    {
      id: 1,
      avelonData: {id: 1, name: 'AZUL'},
      marketData: {id: 1, name: 'AZUL OSCURO'}
    },
    {
      id: 2,
      avelonData: {id: 2, name: 'ROJO'},
      marketData: {id: 2, name: 'ROJO'}
    },
    {
      id: 3,
      avelonData: {id: 3, name: 'AMARILLO'},
      marketData: {id: -1, name: null}
    }
  ];

  private colorsList = [
    {id: 1, name: 'AZUL OSCURO'},
    {id: 2, name: 'ROJO'},
    {id: 3, name: 'AMARILLO'}
  ];

  // Sizes

  private dataSourceSizes = [
    {
      id: 1,
      avelonData: {id: 1, name: '20'},
      marketData: {id: -1, name: null}
    },
    {
      id: 2,
      avelonData: {id: 2, name: '21'},
      marketData: {id: 2, name: '38'}
    },
    {
      id: 3,
      avelonData: {id: 3, name: '22'},
      marketData: {id: 3, name: '39'}
    }
  ];

  private sizesList = [
    {id: 1, name: '37'},
    {id: 2, name: '38'},
    {id: 3, name: '39'},
  ];

  // Features

  private dataSourceFeatures = [
    {
      id: 1,
      avelonData: {id: 1, name: 'FAMILIA: NIÑO'},
      marketData: {id: 1, name: 'NIÑO'}
    },
    {
      id: 2,
      avelonData: {id: 2, name: 'DESCRIPCIÓN: BOTAS'},
      marketData: {id: 2, name: 'BOTAS'}
    },
    {
      id: 3,
      avelonData: {id: 3, name: 'DESCRIPCIÓN: BOTINES'},
      marketData: {id: 3, name: 'BOTINES'}
    }
  ];

  private featuresList = [
    {id: 1, name: 'NIÑO'},
    {id: 2, name: 'BOTAS'},
    {id: 3, name: 'BOTINES'},
  ];

  /////////////////////////////////////////////////////////////////////////////////////

  private displayedBrandsColumns: string[] = ['blank', 'id', 'avelonData', 'marketData'];
  //private dataSourceBrands: any;

  private displayedColorsColumns: string[] = ['blank', 'id', 'avelonData', 'marketData'];
  //private dataSourceColors: any;

  private displayedSizesColumns: string[] = ['blank', 'id', 'avelonData', 'marketData'];
  //private dataSourceSizes: any;

  private displayedFeaturesColumns: string[] = ['blank', 'id', 'avelonData', 'marketData'];
  //private dataSourceFeatures: any;

  private enumTypes = [];

  // private brandsList = [];
  // private colorsList = [];
  // private sizesList = [];
  // private featuresList = [];

  private avelonDataBrands = [];
  private avelonDataColors = [];
  private avelonDataSizes = [];
  private avelonDataFeatures = [];

  constructor(
      private route: ActivatedRoute,
      private router : Router,
      private marketplacesService: MarketplacesService
    ) {
    console.log(this.route.snapshot.data['name']) 
  }

  ngOnInit() {
    //this.getEntities();
    //this.getMaps();
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
        /*this.dataSourceColors = new MatTableDataSource(this.colorsList);
        this.dataSourceSizes = new MatTableDataSource(this.sizesList);
        this.dataSourceBrands = new MatTableDataSource(this.brandsList);
        this.dataSourceFeatures = new MatTableDataSource(this.featuresList);*/
      } else {
        console.log('error')
      }
    })
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

  changeFeatureSelect(e) {
    console.log(e.value)
  }

  /*brandsFilter(filterValue: string) {
    this.dataSourceBrands.filter = filterValue.trim().toLowerCase();
  }

  colorsFilter(filterValue: string) {
    this.dataSourceColors.filter = filterValue.trim().toLowerCase();
  }

  sizesFilter(filterValue: string) {
    this.dataSourceSizes.filter = filterValue.trim().toLowerCase();
  }*/

}
