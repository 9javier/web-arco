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


  private dataSourceBrands;
  private dataSourceMappingBrands;
  private brandsList;

  private dataSourceColors;
  private dataSourceMappingColors;
  private colorsList;

  private dataSourceSizes;
  private dataSourceMappingSizes;
  private sizesList;

  private dataSourceFeatures;
  private dataSourceMappingFeatures;
  private featuresList;

  private displayedColumns;
  private enumTypes;

  constructor(
      private route: ActivatedRoute,
      private router : Router,
      private marketplacesService: MarketplacesService
    ) {
    console.log(this.route.snapshot.data['name']) 
  }

  ngOnInit() {

    /// DATOS ESTÁTICOS. BORRAR CUANDO LAS CONEXIONES CON KRACKONLINE, AVELON Y MIDDLEWARE/RULE-ENGINE ESTÉN LISTAS

    this.dataSourceBrands = [
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
    this.dataSourceMappingBrands = new MatTableDataSource(this.dataSourceBrands);
    this.brandsList = [
      {id: 1, name: 'ADIDAS'},
      {id: 2, name: 'AMANDA'},
      {id: 3, name: 'ASICS'},
    ];

    this.dataSourceColors = [
      {
        id: 4,
        avelonData: {id: 4, name: 'AZUL'},
        marketData: {id: 4, name: 'AZUL OSCURO'}
      },
      {
        id: 5,
        avelonData: {id: 5, name: 'ROJO'},
        marketData: {id: 5, name: 'ROJO'}
      },
      {
        id: 6,
        avelonData: {id: 6, name: 'AMARILLO'},
        marketData: {id: -1, name: null}
      }
    ];
    this.dataSourceMappingColors = new MatTableDataSource(this.dataSourceColors);
    this.colorsList = [
      {id: 4, name: 'AZUL OSCURO'},
      {id: 5, name: 'ROJO'},
      {id: 6, name: 'AMARILLO'}
    ];

    this.dataSourceSizes = [
      {
        id: 7,
        avelonData: {id: 7, name: '20'},
        marketData: {id: -1, name: null}
      },
      {
        id: 8,
        avelonData: {id: 8, name: '21'},
        marketData: {id: 8, name: '38'}
      },
      {
        id: 9,
        avelonData: {id: 9, name: '22'},
        marketData: {id: 9, name: '39'}
      }
    ];
    this.dataSourceMappingSizes = new MatTableDataSource(this.dataSourceSizes);
    this.sizesList = [
      {id: 7, name: '37'},
      {id: 8, name: '38'},
      {id: 9, name: '39'},
    ];

    this.dataSourceFeatures = [
      {
        id: 10,
        avelonData: {id: 10, name: 'FAMILIA: NIÑO'},
        marketData: {id: 10, name: 'NIÑO'}
      },
      {
        id: 11,
        avelonData: {id: 11, name: 'DESCRIPCIÓN: BOTAS'},
        marketData: {id: 11, name: 'BOTAS'}
      },
      {
        id: 12,
        avelonData: {id: 12, name: 'DESCRIPCIÓN: BOTINES'},
        marketData: {id: 12, name: 'BOTINES'}
      }
    ];
    this.dataSourceMappingFeatures = new MatTableDataSource(this.dataSourceFeatures);
    this.featuresList = [
      {id: 10, name: 'NIÑO'},
      {id: 11, name: 'BOTAS'},
      {id: 12, name: 'BOTINES'},
    ];

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    this.displayedColumns = ['blank', 'avelonData', 'marketData'];
    this.enumTypes = [];

    //this.getEntities();
    //this.getMaps();
    this.saveMock();
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
    this.dataSourceMappingBrands = new MatTableDataSource([]);
    this.dataSourceMappingColors = new MatTableDataSource([]);
    this.dataSourceMappingSizes = new MatTableDataSource([]);
    this.dataSourceMappingFeatures = new MatTableDataSource([]);

    this.marketplacesService.getMapDataRules().subscribe(data => {
      if(data) {
        data.forEach(item => {
          switch(item.typeMapped) {
            case 3:
              const dataColor = this.dataSourceMappingColors.data;

              let colorMarket = {id: 0, name: ''};

              if(item.marketDataId == null) {
                colorMarket.name = item.marketDataId;
                colorMarket.id = -1;
              } else {
                this.colorsList.forEach(color => {
                  if(color.name == item.marketDataId){
                    colorMarket = color;
                  }
                })
              }
              dataColor.push({
                id: item.id,
                avelonData: {
                  id: item.id,
                  name: item.originDataId
                },
                marketData: {
                  id: colorMarket.id,
                  name: colorMarket.name
                }
              });
              this.dataSourceMappingColors.data = dataColor;
              break;
            case 4:
              const dataSize = this.dataSourceMappingSizes.data;
              
              let sizeMarket = {id: 0, name: ''};

              if(item.marketDataId == null) {
                sizeMarket.name = item.marketDataId;
                sizeMarket.id = -1;
              } else {
                this.sizesList.forEach(size => {
                  if(size.name == item.marketDataId){
                    sizeMarket = size;
                  }
                })
              }

              dataSize.push({
                id: item.id,
                avelonData: {
                  id: item.id,
                  name: item.originDataId
                },
                marketData: {
                  id: sizeMarket.id,
                  name: sizeMarket.name
                }
              });
              this.dataSourceMappingSizes.data = dataSize;
              break;
            case 5:
              const dataBrand = this.dataSourceMappingBrands.data;

              let brandMarket = {id: 0, name: ''};

              if(item.marketDataId == null) {
                brandMarket.name = item.marketDataId;
                brandMarket.id = -1;
              } else {
                this.brandsList.forEach(brand => {
                  if(brand.name == item.marketDataId){
                    brandMarket = brand;
                  }
                })
              }

              dataBrand.push({
                id: item.id,
                avelonData: {
                  id: item.id,
                  name: item.originDataId
                },
                marketData: {
                  id: brandMarket.id,
                  name: brandMarket.name
                }
              });
              this.dataSourceMappingBrands.data = dataBrand;
              break;
            case 8:
                const dataFeature = this.dataSourceMappingFeatures.data;
  
                let featureMarket = {id: 0, name: ''};
  
                if(item.marketDataId == null) {
                  featureMarket.name = item.marketDataId;
                  featureMarket.id = -1;
                } else {
                  this.featuresList.forEach(feature => {
                    if(feature.name == item.marketDataId){
                      featureMarket = feature;
                    }
                  })
                }
  
                dataFeature.push({
                  id: item.id,
                  avelonData: {
                    id: item.id,
                    name: item.originDataId
                  },
                  marketData: {
                    id: featureMarket.id,
                    name: featureMarket.name
                  }
                });
                this.dataSourceMappingFeatures.data = dataFeature;
                break;
          }
        });
      } else {
        console.log('error get map data rules')
        
      }
    })
  }

  saveMock() {
    this.dataSourceMappingBrands.filteredData.forEach(item => {
      this.brandsList.forEach(brand => {
        if(item.id == brand.id) {
          let brandMockToSave = {};
          if(item.marketData.name != null) {
            brandMockToSave = {
              id: item.id,
              originDataId: item.avelonData.name,
              marketDataId: brand.name,
              typeMapped: 5,
              marketId: 1,
              aditionalMapInfo: 'more info'
            };
          } else {
            brandMockToSave = {
              id: item.id,
              originDataId: item.avelonData.name,
              marketDataId: null,
              typeMapped: 5,
              marketId: 1,
              aditionalMapInfo: 'more info'
            };
          }

          this.marketplacesService.postMapDataRules(brandMockToSave).subscribe(data => {
            console.log(data)
          })
        }
      });
    });

    this.dataSourceMappingColors.filteredData.forEach(item => {
      this.colorsList.forEach(color => {
        if(item.id == color.id) {
          let colorsMockToSave = {};
          if(item.marketData.name != null) {
            colorsMockToSave = {
              id: item.id,
              originDataId: item.avelonData.name,
              marketDataId: color.name,
              typeMapped: 3,
              marketId: 1,
              aditionalMapInfo: 'more info'
            };
          } else {
            colorsMockToSave = {
              id: item.id,
              originDataId: item.avelonData.name,
              marketDataId: null,
              typeMapped: 3,
              marketId: 1,
              aditionalMapInfo: 'more info'
            };
          }

          this.marketplacesService.postMapDataRules(colorsMockToSave).subscribe(data => {
            console.log(data)
          })
        }
      });
    });

    this.dataSourceMappingSizes.filteredData.forEach(item => {
      this.sizesList.forEach(size => {
        if(item.id == size.id) {
          let sizesMockToSave = {};
          if(item.marketData.name != null) {
            sizesMockToSave = {
              id: item.id,
              originDataId: item.avelonData.name,
              marketDataId: size.name,
              typeMapped: 4,
              marketId: 1,
              aditionalMapInfo: 'more info'
            };
          } else {
            sizesMockToSave = {
              id: item.id,
              originDataId: item.avelonData.name,
              marketDataId: null,
              typeMapped: 4,
              marketId: 1,
              aditionalMapInfo: 'more info'
            };
          }

          this.marketplacesService.postMapDataRules(sizesMockToSave).subscribe(data => {
            console.log(data)
          })
        }
      });
    });


    this.dataSourceMappingFeatures.filteredData.forEach(item => {
      this.featuresList.forEach(feature => {
        if(item.id == feature.id) {
          let featuresMockToSave = {};
          if(item.marketData.name != null) {
            featuresMockToSave = {
              id: item.id,
              originDataId: item.avelonData.name,
              marketDataId: feature.name,
              typeMapped: 8,
              marketId: 1,
              aditionalMapInfo: 'more info'
            };
          } else {
            featuresMockToSave = {
              id: item.id,
              originDataId: item.avelonData.name,
              marketDataId: null,
              typeMapped: 5,
              marketId: 1,
              aditionalMapInfo: 'more info'
            };
          }

          this.marketplacesService.postMapDataRules(featuresMockToSave).subscribe(data => {
            console.log(data)
          })
        }
      });
    });
  }

  changeBrandSelect(e, element) {

    let originData;
    let marketData;
    let id = element.id;
    this.dataSourceMappingBrands.filteredData.forEach(item => {
      if(item.id == element.id) {
        originData = item;
      }
    });

    this.brandsList.forEach(item => {
      if(item.id == e.value) {
        marketData = item;
      }
    });

    let marketDataId = '';
    if(marketData) {
      marketDataId = marketData.name;
    } else {
      marketDataId = null;
    }

    let dataSend = {
      id,
      originDataId: originData.avelonData.name,
      marketDataId,
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
    this.dataSourceMappingColors.filteredData.forEach(item => {
      if(item.id == element.id) {
        originData = item;
      }
    });

    this.colorsList.forEach(item => {
      if(item.id == e.value) {
        marketData = item;
      }
    });

    let marketDataId = '';
    if(marketData) {
      marketDataId = marketData.name;
    } else {
      marketDataId = null;
    }

    let dataSend = {
      id,
      originDataId: originData.avelonData.name,
      marketDataId,
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
    this.dataSourceMappingSizes.filteredData.forEach(item => {
      if(item.id == element.id) {
        originData = item;
      }
    });

    this.sizesList.forEach(item => {
      if(item.id == e.value) {
        marketData = item;
      }
    });

    let marketDataId = '';
    if(marketData) {
      marketDataId = marketData.name;
    } else {
      marketDataId = null;
    }

    let dataSend = {
      id,
      originDataId: originData.avelonData.name,
      marketDataId,
      typeMapped: 4,
      marketId: 1,
      aditionalMapInfo: 'more info'
    };
    
    this.marketplacesService.updateMapDataRules(id, dataSend).subscribe(data => {
      console.log(data)
    })
  }

  changeFeatureSelect(e, element) {
    let originData;
    let marketData;
    let id = element.id;
    this.dataSourceMappingFeatures.filteredData.forEach(item => {
      if(item.id == element.id) {
        originData = item;
      }
    });

    this.featuresList.forEach(item => {
      if(item.id == e.value) {
        marketData = item;
      }
    });

    let marketDataId = '';
    if(marketData) {
      marketDataId = marketData.name;
    } else {
      marketDataId = null;
    }

    let dataSend = {
      id,
      originDataId: originData.avelonData.name,
      marketDataId,
      typeMapped: 8,
      marketId: 1,
      aditionalMapInfo: 'more info'
    };
    
    this.marketplacesService.updateMapDataRules(id, dataSend).subscribe(data => {
      console.log(data)
    })
  }

  /*brandsFilter(filterValue: string) {
    this.dataSourceMappingBrands.filter = filterValue.trim().toLowerCase();
  }

  colorsFilter(filterValue: string) {
    this.dataSourceMappingColors.filter = filterValue.trim().toLowerCase();
  }

  sizesFilter(filterValue: string) {
    this.dataSourceMappingSizes.filter = filterValue.trim().toLowerCase();
  }*/

}
