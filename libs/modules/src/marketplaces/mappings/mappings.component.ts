import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  private dataSourceBrands: MatTableDataSource<any> = new MatTableDataSource([
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
  ]);

  private brandsList = [
    {id: 1, name: 'ADIDAS'},
    {id: 2, name: 'AMANDA'},
    {id: 3, name: 'ASICS'},
  ];

  // Colors

  private dataSourceColors: MatTableDataSource<any> = new MatTableDataSource([
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
  ]);

  private colorsList = [
    {id: 1, name: 'AZUL OSCURO'},
    {id: 2, name: 'ROJO'},
    {id: 3, name: 'AMARILLO'}
  ];

  // Sizes

  private dataSourceSizes: MatTableDataSource<any> = new MatTableDataSource([
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
  ]);

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
              const dataColor = this.dataSourceColors.data;
              dataColor.push({
                id: this.dataSourceColors.data.length + 1,
                avelonData: {
                  id: this.dataSourceColors.data.length + 1,
                  name: item.originDataId
                },
                marketData: {
                  id: this.dataSourceColors.data.length + 1,
                  name: item.marketDataId
                }
              });
              this.dataSourceColors.data = dataColor;
              this.colorsList.push({
                id: this.colorsList.length + 1,
                name: item.marketDataId
              });
              break;
            case 4:
              const dataSize = this.dataSourceSizes.data;
              dataSize.push({
                id: this.dataSourceSizes.data.length + 1,
                avelonData: {
                  id: this.dataSourceSizes.data.length + 1,
                  name: item.originDataId
                },
                marketData: {
                  id: this.dataSourceSizes.data.length + 1,
                  name: item.marketDataId
                }
              });
              this.dataSourceSizes.data = dataSize;
              this.sizesList.push({
                id: this.sizesList.length + 1,
                name: item.marketDataId
              });
              break;
            case 5:
              const dataBrand = this.dataSourceBrands.data;
              dataBrand.push({
                id: item.id,
                avelonData: {
                  id: item.id,
                  name: item.originDataId
                },
                marketData: {
                  id: item.id,
                  name: item.marketDataId
                }
              });
              this.dataSourceBrands.data = dataBrand;
              this.brandsList.push({
                id: item.id,
                name: item.marketDataId
              });
              break;
          }
        });
      } else {
        console.log('error')
        
      }
    })
  }

  changeBrandSelect(e, element) {

    let originData;
    let marketData;
    let id = element.id;
    this.dataSourceBrands.filteredData.forEach(item => {
      if(item.id == element.id) {
        originData = item;
      }
    });

    this.brandsList.forEach(item => {
      if(item.id == e.value) {
        marketData = item;
      }
    });

    let dataSend = {
      id,
      originDataId: originData.avelonData.name,
      marketDataId: marketData.name,
      typeMapped: 5,
      marketId: 1,
      aditionalMapInfo: 'more info'
    };

    this.marketplacesService.updateMapDataRules(id, dataSend).subscribe(data => {
      console.log(data)
    })
  }

  changeColorSelect(e, element) {
    let originData;
    let marketData;
    let id = element.id;
    this.dataSourceColors.filteredData.forEach(item => {
      if(item.id == element.id) {
        originData = item;
      }
    });

    this.colorsList.forEach(item => {
      if(item.id == e.value) {
        marketData = item;
      }
    });

    let dataSend = {
      id,
      originDataId: originData.avelonData.name,
      marketDataId: marketData.name,
      typeMapped: 3,
      marketId: 1,
      aditionalMapInfo: 'more info'
    };

    this.marketplacesService.updateMapDataRules(id, dataSend).subscribe(data => {
      console.log(data)
    })
  }

  changeSizeSelect(e, element) {
    let originData;
    let marketData;
    let id = element.id;
    this.dataSourceSizes.filteredData.forEach(item => {
      if(item.id == element.id) {
        originData = item;
      }
    });

    this.sizesList.forEach(item => {
      if(item.id == e.value) {
        marketData = item;
      }
    });

    let dataSend = {
      id,
      originDataId: originData.avelonData.name,
      marketDataId: marketData.name,
      typeMapped: 4,
      marketId: 1,
      aditionalMapInfo: 'more info'
    };
    
    this.marketplacesService.updateMapDataRules(id, dataSend).subscribe(data => {
      console.log(data)
    })
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
