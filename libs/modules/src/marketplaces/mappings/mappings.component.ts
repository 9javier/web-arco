import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketplacesService } from '../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';
import { MarketplacesPrestaService } from '../../../../services/src/lib/endpoint/marketplaces-presta/marketplaces-presta.service';
import { MarketplacesMgaService } from '../../../../services/src/lib/endpoint/marketplaces-mga/marketplaces-mga.service';
import { MatTableDataSource, MatPaginator, MatPaginatorIntl } from '@angular/material';

import {PaginatorLanguageComponent} from "../../components/paginator-language/paginator-language.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'suite-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: PaginatorLanguageComponent() }
  ]
})

export class MappingsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
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

  private dataDBsave = [];

  private displayedColumns;
  private enumTypes;

  private showingBrands;
  private showingColors;
  private showingFeatures;
  private showingSizes;

  constructor(
      private route: ActivatedRoute,
      private router : Router,
      private marketplacesService: MarketplacesService,
      private marketplacesPrestaService: MarketplacesPrestaService,
      private marketplacesMgaService: MarketplacesMgaService,
      private http: HttpClient
    ) {
    console.log(this.route.snapshot.data['name']) 
  }

  ngOnInit() {

    this.dataSourceBrands = [];
    this.dataSourceMappingBrands = new MatTableDataSource(this.dataSourceBrands);
    this.brandsList = [];

    this.marketplacesMgaService.getBrands().subscribe(data => {
      if(data) {
        data.forEach(brand => {
          this.dataSourceBrands.push({
            id: null,
            avelonData: {id: brand.id, name: brand.name},
            marketData: {id: -1, name: null}
          });
        });
        this.dataSourceMappingBrands = new MatTableDataSource(this.dataSourceBrands);
        setTimeout(() => this.dataSourceMappingBrands.paginator = this.paginator);
        this.showingBrands = this.dataSourceBrands.slice(0, 10);
      }
    });

    this.dataSourceColors = [];
    this.dataSourceMappingColors = new MatTableDataSource(this.dataSourceColors);
    this.colorsList = [];

    this.marketplacesMgaService.getColors().subscribe(data => {
      if(data) {
        data.forEach(color => {
          this.dataSourceColors.push({
            id: null,
            avelonData: {id: color.id, name: color.name},
            marketData: {id: -1, name: null}
          });
        });
        this.dataSourceMappingColors = new MatTableDataSource(this.dataSourceColors);
        setTimeout(() => this.dataSourceMappingColors.paginator = this.paginator);
        this.showingColors = this.dataSourceColors.slice(0, 10);
      }
    });

    this.dataSourceSizes = [];
    this.dataSourceMappingSizes = new MatTableDataSource(this.dataSourceSizes);
    this.sizesList = [];

    this.marketplacesMgaService.getSizes().subscribe(data => {
      if(data) {
        data.forEach(size => {
          this.dataSourceSizes.push({
            id: null,
            avelonData: {id: size.id, name: size.name},
            marketData: {id: -1, name: null}
          });
        });
        this.dataSourceMappingSizes = new MatTableDataSource(this.dataSourceSizes);
        setTimeout(() => this.dataSourceMappingSizes.paginator = this.paginator);
        this.showingSizes = this.dataSourceSizes.slice(0, 10);
      }
    });

    this.dataSourceFeatures = [];
    this.dataSourceMappingFeatures = new MatTableDataSource(this.dataSourceFeatures);
    this.featuresList = [];

    this.marketplacesMgaService.getFeaturesByMarket(1).subscribe(data => {
      if(data) {
        data.forEach(feature => {
          this.dataSourceFeatures.push({
            id: null,
            avelonData: {id: feature.id, name: feature.name, group: feature.groupNumber},
            marketData: {id: -1, name: null}
          });
        });
        this.dataSourceMappingFeatures = new MatTableDataSource(this.dataSourceFeatures);
        setTimeout(() => this.dataSourceMappingFeatures.paginator = this.paginator);
        this.showingFeatures = this.dataSourceFeatures.slice(0, 10);
      }
    });

    this.getDestinyValues();

    this.displayedColumns = ['blank', 'avelonData', 'marketData'];
    this.enumTypes = [];

    //this.getEntities();
    //this.getMaps();
    //this.saveMock();
  }

  getDestinyValues() {
    this.http.get('assets/data/mapping-prestashop-data.json').subscribe((data: any) => {
      this.brandsList = data.brands;
      this.sizesList = data.sizes;
      this.featuresList = data.features;
      this.colorsList = data.colors;
    });
  }

  setSelectorValues(e, type) {
    let page = e.pageIndex;
    switch (type) {
      case 'brands':
        if (page == 0) {
          this.showingBrands = this.dataSourceBrands.slice(0, 10);
        } else {
          this.showingBrands = this.dataSourceBrands.slice(page * 10, page * 10 + 10);
        }
        break;

      case 'features':
        if (page == 0) {
          this.showingFeatures = this.dataSourceFeatures.slice(0, 10);
        } else {
          this.showingFeatures = this.dataSourceFeatures.slice(page * 10, page * 10 + 10);
        }
        break;

      case 'colors':
        if (page == 0) {
          this.showingColors = this.dataSourceColors.slice(0, 10);
        } else {
          this.showingColors = this.dataSourceColors.slice(page * 10, page * 10 + 10);
        }
        break;

      case 'sizes':
        if (page == 0) {
          this.showingSizes = this.dataSourceSizes.slice(0, 10);
        } else {
          this.showingSizes = this.dataSourceSizes.slice(page * 10, page * 10 + 10);
        }
        break;
    }
  }

  isRowShowing(id, type, group?) {
    switch (type) {
      case 'brands':
        return (this.showingBrands.some(e => e.avelonData.id == id));
        break;

      case 'features':
        return (this.showingFeatures.some(e => {
            return (e.avelonData.id == id && e.avelonData.group == group);
          }
        ));
        break;

      case 'colors':
        return (this.showingColors.some(e => e.avelonData.id == id));
        break;

      case 'sizes':
        return (this.showingSizes.some(e => e.avelonData.id == id));
        break;
    }
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
        this.dataDBsave = data;
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

  getGroupName(group) {
    switch (group) {
      case 2:
        return "FAMILIA: ";
        break;
      case 5:
        return "TACÓN: ";
        break;
      case 7:
        return "DESCRIPCIÓN: ";
        break;
      case 9:
        return "MAT. EXTERIOR: ";
        break;
      case 10:
        return "MAT. INTERIOR: ";
        break;
      default:
        return "";
        break;
    }
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
