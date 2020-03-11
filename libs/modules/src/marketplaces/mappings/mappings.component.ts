import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MarketplacesService} from '../../../../services/src/lib/endpoint/marketplaces/marketplaces.service';
import {MarketplacesPrestaService} from '../../../../services/src/lib/endpoint/marketplaces-presta/marketplaces-presta.service';
import {MatTableDataSource, MatPaginator, MatPaginatorIntl} from '@angular/material';
import {forkJoin} from 'rxjs'

import {PaginatorLanguageComponent} from "../../components/paginator-language/paginator-language.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'suite-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.scss'],
  providers: [
    {provide: MatPaginatorIntl, useValue: PaginatorLanguageComponent()}
  ]
})

export class MappingsComponent implements OnInit {

  @ViewChild('paginatorBrands') paginatorBrands: MatPaginator;
  @ViewChild('paginatorFeatures') paginatorFeatures: MatPaginator;
  @ViewChild('paginatorColors') paginatorColors: MatPaginator;
  @ViewChild('paginatorSizes') paginatorSizes: MatPaginator;


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

  private showingBrands;
  private showingColors;
  private showingFeatures;
  private showingSizes;

  private brandSearched;
  private colorSearched;
  private featureSearched;
  private sizeSearched;

  private market;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marketplacesService: MarketplacesService,
    private marketplacesPrestaService: MarketplacesPrestaService,
    private http: HttpClient
  ) {
  }

  ngOnInit() {

    this.dataSourceBrands = [];
    this.dataSourceMappingBrands = new MatTableDataSource(this.dataSourceBrands);
    this.brandsList = [];


    this.dataSourceColors = [];
    this.dataSourceMappingColors = new MatTableDataSource(this.dataSourceColors);
    this.colorsList = [];

    this.dataSourceSizes = [];
    this.dataSourceMappingSizes = new MatTableDataSource(this.dataSourceSizes);
    this.sizesList = [];

    this.dataSourceFeatures = [];
    this.dataSourceMappingFeatures = new MatTableDataSource(this.dataSourceFeatures);
    this.featuresList = [];

    this.displayedColumns = ['blank', 'avelonData', 'marketData'];

    this.marketplacesService.getMarkets().subscribe((data: any) => {
      this.market = null;
      if (data && data.length) {
        for (let market of data) {
          switch (this.route.snapshot.data['name']) {
            case "Miniprecios":
              this.market = market.id;
              break;
          }

          if (this.market) {
            break;
          }
        }
      }

      this.getMappingValue();

    });

  }

  getMappingValue() {

    forkJoin([
      this.marketplacesService.getBrands(),
      this.marketplacesService.getColors(),
      this.marketplacesService.getSizes(),
      this.marketplacesService.getFeatures()
    ]).subscribe(results => {

      if (results[0] && results[0].length) {
        results[0].forEach(brand => {
          this.dataSourceBrands.push({
            avelonData: {id: brand.externalId, name: brand.name.trim()},
            marketData: {id: -1, name: null}
          });
        });
        this.dataSourceBrands.sort((a, b) => (a.avelonData.name.toLowerCase() > b.avelonData.name.toLowerCase()) ? 1 : ((b.avelonData.name.toLowerCase() > a.avelonData.name.toLowerCase()) ? -1 : 0));
        this.dataSourceMappingBrands = new MatTableDataSource(this.dataSourceBrands);
        setTimeout(() => this.dataSourceMappingBrands.paginator = this.paginatorBrands);
        this.showingBrands = this.dataSourceMappingBrands.data.slice(0, 10);
      }

      if (results[1] && results[1].length) {
        results[1].forEach(color => {
          this.dataSourceColors.push({
            avelonData: {id: color.externalId, name: color.name.trim()},
            marketData: {id: -1, name: null}
          });
        });
        this.dataSourceColors.sort((a, b) => (a.avelonData.name.toLowerCase() > b.avelonData.name.toLowerCase()) ? 1 : ((b.avelonData.name.toLowerCase() > a.avelonData.name.toLowerCase()) ? -1 : 0));
        this.dataSourceMappingColors = new MatTableDataSource(this.dataSourceColors);
        setTimeout(() => this.dataSourceMappingColors.paginator = this.paginatorColors);
        this.showingColors = this.dataSourceMappingColors.data.slice(0, 10);
      }

      if (results[2] && results[2].length) {
        results[2].forEach(size => {
          if (this.dataSourceSizes.length) {
            if (!this.dataSourceSizes.find(searchSize => {
              return searchSize.avelonData.name.trim() === size.name.trim();
            })) {
              this.dataSourceSizes.push({
                avelonData: {id: size.name.trim(), name: size.name.trim()},
                marketData: {id: -1, name: null}
              });
            }
          } else {
            this.dataSourceSizes.push({
              avelonData: {id: size.name.trim(), name: size.name.trim()},
              marketData: {id: -1, name: null}
            });
          }
        });

        let sizeTransformed = [];

        for (let sizeValue of this.dataSourceSizes.slice()) {
          let numbers = '';
          let letters = '';
          for (let i = 0; i < sizeValue.avelonData.name.length; i++) {
            if  (isNaN(sizeValue.avelonData.name[i])) {
              letters = sizeValue.avelonData.name.substr(i, sizeValue.avelonData.name.length);
              break;
            } else {
              numbers += sizeValue.avelonData.name[i];
            }
          }
          if (numbers == '') {
            numbers = '999999';
          }
          sizeTransformed.push({sizeValue, numbers, letters});
        }

        sizeTransformed.sort((a, b) => (parseInt(a.numbers) > parseInt(b.numbers)) ? 1 : ((parseInt(b.numbers) > parseInt(a.numbers)) ? -1 : (a.letters.toLowerCase() > b.letters.toLowerCase()) ? 1 : ((b.letters.toLowerCase() > a.letters.toLowerCase()) ? -1 : 0)));

        let sortedSizes = [];

        for (let size of sizeTransformed) {
          sortedSizes.push(size.sizeValue);
        }

        this.dataSourceSizes = sortedSizes.slice();

        this.dataSourceMappingSizes = new MatTableDataSource(this.dataSourceSizes);
        setTimeout(() => this.dataSourceMappingSizes.paginator = this.paginatorSizes);
        this.showingSizes = this.dataSourceMappingSizes.data.slice(0, 10);
      }

      if (results[3] && results[3].length) {
        results[3].forEach(feature => {
          if (feature.dataGroup == "2" || feature.dataGroup == "5" || feature.dataGroup == "7" || feature.dataGroup == "9" || feature.dataGroup == "10") {
            this.dataSourceFeatures.push({
              avelonData: {id: feature.externalId, name: feature.name.trim(), group: feature.dataGroup},
              marketData: {id: -1, name: null}
            });
          }
        });
        this.dataSourceFeatures.sort((a, b) => (parseInt(a.avelonData.group) > parseInt(b.avelonData.group)) ? 1 : ((parseInt(b.avelonData.group) > parseInt(a.avelonData.group)) ? -1 : ((a.avelonData.name.toLowerCase() > b.avelonData.name.toLowerCase()) ? 1 : ((b.avelonData.name.toLowerCase() > a.avelonData.name.toLowerCase()) ? -1 : 0))));
        this.dataSourceMappingFeatures = new MatTableDataSource(this.dataSourceFeatures);
        setTimeout(() => this.dataSourceMappingFeatures.paginator = this.paginatorFeatures);
        this.showingFeatures = this.dataSourceMappingFeatures.data.slice(0, 10);
      }

      this.getDestinyValues();
    });
  }

  updateDataSaved() {
    this.marketplacesService.getMapDataRules().subscribe(data => {
      if (data) {
        this.dataDBsave = data.data;
      } else {
        this.dataDBsave = [];
      }

      console.log(this.dataDBsave)

      this.dataDBsave.forEach(item => {
        switch (item.type) {
          case 2:
          case 'feature':
            let dataFeature = this.dataSourceFeatures;

            let featureMarket = {id: -1, name: null};

            this.featuresList.forEach(feature => {
              if (feature.id == item.marketDataId) {
                featureMarket = feature;
              }
            });

            dataFeature.forEach(data => {
              if (data.avelonData.id == item.originDataId && data.avelonData.group == item.additionalMapInfo) {
                data.marketData = {
                  id: featureMarket.id,
                  name: featureMarket.name
                }
              }
            });

            this.dataSourceFeatures = dataFeature;
            this.dataSourceMappingFeatures.data = this.dataSourceFeatures;
            if (this.featureSearched && this.featureSearched.trim() != '') {
              this.searchOnMappingList('feature');
            }
            break;
          case 3:
          case 'color':
            let dataColor = this.dataSourceColors;

            let colorMarket = {id: -1, name: null};


            this.colorsList.forEach(color => {
              if (color.id == item.marketDataId) {
                colorMarket = color;
              }
            });

            dataColor.forEach(data => {
              if (data.avelonData.id == item.originDataId) {
                data.marketData = {
                  id: colorMarket.id,
                  name: colorMarket.name
                }
              }
            });

            this.dataSourceColors = dataColor;
            this.dataSourceMappingColors.data = this.dataSourceColors;
            if (this.colorSearched && this.colorSearched.trim() != '') {
              this.searchOnMappingList('color');
            }
            break;
          case 4:
          case 'size':
            let dataSize = this.dataSourceSizes;

            let sizeMarket = {id: -1, name: null};

            this.sizesList.forEach(size => {
              if (size.id == item.marketDataId) {
                sizeMarket = size;
              }
            });

            dataSize.forEach(data => {
              if (data.avelonData.id == item.originDataId) {
                data.marketData = {
                  id: sizeMarket.id,
                  name: sizeMarket.name
                }
              }
            });

            this.dataSourceSizes = dataSize;
            this.dataSourceMappingSizes.data = this.dataSourceSizes;
            if (this.sizeSearched && this.sizeSearched.trim() != '') {
              this.searchOnMappingList('size');
            }
            break;
          case 5:
          case 'brand':
            let dataBrand = this.dataSourceBrands;

            let brandMarket = {id: -1, name: null};

            this.brandsList.forEach(brand => {
              if (brand.id == item.marketDataId) {
                brandMarket = brand;
              }
            });

            dataBrand.forEach(data => {
              if (data.avelonData.id == item.originDataId) {
                data.marketData = {
                  id: brandMarket.id,
                  name: brandMarket.name
                }
              }
            });

            this.dataSourceBrands = dataBrand;
            this.dataSourceMappingBrands.data = this.dataSourceBrands;
            if (this.brandSearched && this.brandSearched.trim() != '') {
              this.searchOnMappingList('brand');
            }
            break;
        }
      });
    });
  }

  getDestinyValues() {
    this.http.get('assets/data/mapping-prestashop-data.json').subscribe((data: any) => {
      this.brandsList = data.brands;
      this.brandsList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));

      for (let size of data.sizes) {
        if (this.sizesList.length) {
          if (!this.sizesList.find(searchSize => {
            return searchSize.name.trim() === size.name.trim();
          })) {
            this.sizesList.push({id: size.name, name: size.name});
          }
        } else {
          this.sizesList.push({id: size.name, name: size.name});
        }
      }
      this.sizesList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));

      this.featuresList = data.features;
      for (let feature of this.featuresList) {
        let groupName = "";
        switch (feature.group) {
          case "6":
            groupName = "Mat. Interior: ";
            break;
          case "7":
            groupName = "Mat. Exterior: ";
            break;
          case "9":
            groupName = "Medidas: ";
            break;
          case "14":
            groupName = "Familias: ";
            break;
          case "16":
            groupName = "Tipo de producto: ";
            break;
        }
        feature.name = groupName + feature.name;
      }
      this.featuresList.sort((a, b) => (parseInt(a.group) > parseInt(b.group)) ? 1 : ((parseInt(b.group) > parseInt(a.group)) ? -1 : ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0))));

      this.colorsList = data.colors;
      this.colorsList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.updateDataSaved();
    });
  }

  setSelectorValues(e, type) {
    let page = e.pageIndex;
    switch (type) {
      case 'brands':
        if (page == 0) {
          this.showingBrands = this.dataSourceMappingBrands.data.slice(0, 10);
        } else {
          this.showingBrands = this.dataSourceMappingBrands.data.slice(page * 10, page * 10 + 10);
        }
        break;

      case 'features':
        if (page == 0) {
          this.showingFeatures = this.dataSourceMappingFeatures.data.slice(0, 10);
        } else {
          this.showingFeatures = this.dataSourceMappingFeatures.data.slice(page * 10, page * 10 + 10);
        }
        break;

      case 'colors':
        if (page == 0) {
          this.showingColors = this.dataSourceMappingColors.data.slice(0, 10);
        } else {
          this.showingColors = this.dataSourceMappingColors.data.slice(page * 10, page * 10 + 10);
        }
        break;

      case 'sizes':
        if (page == 0) {
          this.showingSizes = this.dataSourceMappingSizes.data.slice(0, 10);
        } else {
          this.showingSizes = this.dataSourceMappingSizes.data.slice(page * 10, page * 10 + 10);
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

  changeBrandSelect(e, element) {
    let marketData = null;

    this.brandsList.forEach(item => {
      if (item.id == e.value) {
        marketData = item;
      }
    });

    let marketDataId = -1;

    if (marketData) {
      marketDataId = marketData.id;
    }

    let dataSend = {
      originDataId: element.avelonData.id,
      marketDataId,
      type: "brand",
      marketId: 1,
      additionalMapInfo: "more info"
    };

    let update: boolean = false;
    let idToUpdate: number = 0;

    this.dataDBsave.forEach(item => {
      if (item.originDataId == element.avelonData.id && item.type == 'brand') {
        update = true;
        idToUpdate = item.id;
      }
    });

    if(marketDataId == -1) {
      this.marketplacesService.deleteMapDataRules(idToUpdate).subscribe(data => {
        this.updateDataSaved();
      });
    } else {
      if (update) {
        this.marketplacesService.updateMapDataRules(idToUpdate, dataSend).subscribe(data => {
          this.updateDataSaved();
        });
      } else {
        this.marketplacesService.postMapDataRules(dataSend).subscribe(data => {
          this.updateDataSaved();
        });
      }
    }
  }

  changeColorSelect(e, element) {
    let marketData = null;

    this.colorsList.forEach(item => {
      if (item.id == e.value) {
        marketData = item;
      }
    });

    let marketDataId = -1;

    if (marketData) {
      marketDataId = marketData.id;
    }

    let dataSend = {
      originDataId: element.avelonData.id,
      marketDataId,
      type: 'color',
      marketId: 1,
      additionalMapInfo: "more info"
    };

    let update: boolean = false;
    let idToUpdate: number = 0;

    this.dataDBsave.forEach(item => {
      if (item.originDataId == element.avelonData.id && item.type == 'color') {
        update = true;
        idToUpdate = item.id;
      }
    });

    if(marketDataId == -1) {
      this.marketplacesService.deleteMapDataRules(idToUpdate).subscribe(data => {
        this.updateDataSaved();
      });
    } else {
      if (update) {
        this.marketplacesService.updateMapDataRules(idToUpdate, dataSend).subscribe(data => {
          this.updateDataSaved();
        });
      } else {
        this.marketplacesService.postMapDataRules(dataSend).subscribe(data => {
          this.updateDataSaved();
        });
      }
    }
  }

  changeSizeSelect(e, element) {
    let marketData = null;

    this.sizesList.forEach(item => {
      if (item.id == e.value) {
        marketData = item;
      }
    });

    let marketDataId = -1;

    if (marketData) {
      marketDataId = marketData.id;
    }

    let dataSend = {
      originDataId: element.avelonData.id,
      marketDataId,
      type: 'size',
      marketId: 1,
      additionalMapInfo: "more info"
    };

    let update: boolean = false;
    let idToUpdate: number = 0;

    this.dataDBsave.forEach(item => {
      if (item.originDataId == element.avelonData.id && item.type == 'size') {
        update = true;
        idToUpdate = item.id;
      }
    });

    if(marketDataId == -1) {
      this.marketplacesService.deleteMapDataRules(idToUpdate).subscribe(data => {
        this.updateDataSaved();
      });
    } else {
      if (update) {
        this.marketplacesService.updateMapDataRules(idToUpdate, dataSend).subscribe(data => {
          this.updateDataSaved();
        });
      } else {
        this.marketplacesService.postMapDataRules(dataSend).subscribe(data => {
          this.updateDataSaved();
        });
      }
    }
  }

  changeFeatureSelect(e, element) {
    let marketData = null;

    this.featuresList.forEach(item => {
      if (item.id == e.value) {
        marketData = item;
      }
    });

    let marketDataId = -1;

    if (marketData) {
      marketDataId = marketData.id;
    }

    let dataSend = {
      originDataId: element.avelonData.id,
      marketDataId,
      type: 'feature',
      marketId: 1,
      additionalMapInfo: element.avelonData.group
    };

    let update: boolean = false;
    let idToUpdate: number = 0;

    this.dataDBsave.forEach(item => {
      if (item.originDataId == element.avelonData.id && item.type == 'feature' && item.additionalMapInfo == element.avelonData.group) {
        update = true;
        idToUpdate = item.id;
      }
    });

    if(marketDataId == -1) {
      this.marketplacesService.deleteMapDataRules(idToUpdate).subscribe(data => {
        this.updateDataSaved();
      });
    } else {
      if (update) {
        this.marketplacesService.updateMapDataRules(idToUpdate, dataSend).subscribe(data => {
          this.updateDataSaved();
        });
      } else {
        this.marketplacesService.postMapDataRules(dataSend).subscribe(data => {
          this.updateDataSaved();
        });
      }
    }
  }

  getGroupName(group) {
    switch (group) {
      case "2":
        return "FAMILIA: ";
        break;
      case "5":
        return "TACÓN: ";
        break;
      case "7":
        return "DESCRIPCIÓN: ";
        break;
      case "9":
        return "MAT. EXTERIOR: ";
        break;
      case "10":
        return "MAT. INTERIOR: ";
        break;
      default:
        return "";
        break;
    }
  }

  searchOnMappingList(type) {
    switch (type) {
      case 'brand':
        if (this.brandSearched && this.brandSearched.trim() != '') {
          let brands = [];
          for (let brand of this.dataSourceBrands) {
            if (brand.avelonData.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.brandSearched.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
              !== -1) {
              brands.push(brand);
            }
          }
          this.dataSourceMappingBrands.data = brands;
        } else {
          this.dataSourceMappingBrands.data = this.dataSourceBrands.slice();
        }

        if (this.dataSourceMappingBrands.data.length > 10) {
          let page = this.paginatorBrands.pageIndex;
          if (page == 0) {
            this.showingBrands = this.dataSourceMappingBrands.data.slice(0, 10);
          } else {
            this.showingBrands = this.dataSourceMappingBrands.data.slice(page * 10, page * 10 + 10);
          }
        } else {
          this.showingBrands = this.dataSourceMappingBrands.data.slice();
          this.paginatorBrands.firstPage();
        }

        break;
      case 'feature':
        if (this.featureSearched && this.featureSearched.trim() != '') {
          let features = [];
          for (let feature of this.dataSourceFeatures) {
            if (feature.avelonData.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.featureSearched.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
              !== -1) {
              features.push(feature);
            }
          }
          this.dataSourceMappingFeatures.data = features;
        } else {
          this.dataSourceMappingFeatures.data = this.dataSourceFeatures.slice();
        }

        if (this.dataSourceMappingFeatures.data.length > 10) {
          let page = this.paginatorFeatures.pageIndex;
          if (page == 0) {
            this.showingFeatures = this.dataSourceMappingFeatures.data.slice(0, 10);
          } else {
            this.showingFeatures = this.dataSourceMappingFeatures.data.slice(page * 10, page * 10 + 10);
          }
        } else {
          this.showingFeatures = this.dataSourceMappingFeatures.data.slice();
          this.paginatorFeatures.firstPage();
        }
        break;
      case 'color':
        if (this.colorSearched && this.colorSearched.trim() != '') {
          let colors = [];
          for (let color of this.dataSourceColors) {
            if (color.avelonData.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.colorSearched.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
              !== -1) {
              colors.push(color);
            }
          }
          this.dataSourceMappingColors.data = colors;
        } else {
          this.dataSourceMappingColors.data = this.dataSourceColors.slice();
        }

        if (this.dataSourceMappingColors.data.length > 10) {
          let page = this.paginatorColors.pageIndex;
          if (page == 0) {
            this.showingColors = this.dataSourceMappingColors.data.slice(0, 10);
          } else {
            this.showingColors = this.dataSourceMappingColors.data.slice(page * 10, page * 10 + 10);
          }
        } else {
          this.showingColors = this.dataSourceMappingColors.data.slice();
          this.paginatorColors.firstPage();
        }
        break;
      case 'size':
        if (this.sizeSearched && this.sizeSearched.trim() != '') {
          let sizes = [];
          for (let size of this.dataSourceSizes) {
            if (size.avelonData.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.sizeSearched.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
              !== -1) {
              sizes.push(size);
            }
          }
          this.dataSourceMappingSizes.data = sizes;
        } else {
          this.dataSourceMappingSizes.data = this.dataSourceSizes.slice();
        }

        if (this.dataSourceMappingSizes.data.length > 10) {
          let page = this.paginatorSizes.pageIndex;
          if (page == 0) {
            this.showingSizes = this.dataSourceMappingSizes.data.slice(0, 10);
          } else {
            this.showingSizes = this.dataSourceMappingSizes.data.slice(page * 10, page * 10 + 10);
          }
        } else {
          this.showingSizes = this.dataSourceMappingSizes.data.slice();
          this.paginatorSizes.firstPage();
        }
        break;
    }
  }

  expandPanel(type) {
    switch (type) {
      case 'brand':
        this.brandSearched = '';
        this.dataSourceMappingBrands.data = this.dataSourceBrands.slice();

        if (this.dataSourceMappingBrands.data.length > 10) {
          this.showingBrands = this.dataSourceMappingBrands.data.slice(0, 10);
        } else {
          this.showingBrands = this.dataSourceMappingBrands.data.slice();
        }
        this.paginatorBrands.firstPage();
        break;
      case 'feature':
        this.featureSearched = '';
        this.dataSourceMappingFeatures.data = this.dataSourceFeatures.slice();

        if (this.dataSourceMappingFeatures.data.length > 10) {
          this.showingFeatures = this.dataSourceMappingFeatures.data.slice(0, 10);
        } else {
          this.showingFeatures = this.dataSourceMappingFeatures.data.slice();
        }
        this.paginatorFeatures.firstPage();
        break;
      case 'color':
        this.colorSearched = '';
        this.dataSourceMappingColors.data = this.dataSourceColors.slice();

        if (this.dataSourceMappingColors.data.length > 10) {
          this.showingColors = this.dataSourceMappingColors.data.slice(0, 10);
        } else {
          this.showingColors = this.dataSourceMappingColors.data.slice();
        }
        this.paginatorColors.firstPage();
        break;
      case 'size':
        this.sizeSearched = '';
        this.dataSourceMappingSizes.data = this.dataSourceSizes.slice();

        if (this.dataSourceMappingSizes.data.length > 10) {
          this.showingSizes = this.dataSourceMappingSizes.data.slice(0, 10);
        } else {
          this.showingSizes = this.dataSourceMappingSizes.data.slice();
        }
        this.paginatorSizes.firstPage();
        break;
    }
  }

}
