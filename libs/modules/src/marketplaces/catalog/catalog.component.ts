import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  private catalogTableData = [
    {
      ref: 1,
      model: 'model1',
      brand: 'brand1',
      color: 'color1',
      family: 'family1',
      description: 'description1',
      pvp: 22.5,
      discount: 19.5,
      units: 5,
      active: false
    },
    {
      ref: 2,
      model: 'model2',
      brand: 'brand2',
      color: 'color2',
      family: 'family2',
      description: 'description2',
      pvp: 12.5,
      discount: 8.15,
      units: 8,
      active: false
    },
    {
      ref: 3,
      model: 'model3',
      brand: 'brand3',
      color: 'color3',
      family: 'family3',
      description: 'description3',
      pvp: 49.99,
      discount: 24.99,
      units: 13,
      active: true
    },
    {
      ref: 4,
      model: 'model4',
      brand: 'brand4',
      color: 'color4',
      family: 'family4',
      description: 'description4',
      pvp: 38.2,
      discount: 32.79,
      units: 5,
      active: false
    }
  ];
  private catalogTableHeader: string[] = ['select', 'ref', 'model', 'brand', 'color', 'family', 'description', 'pvp', 'discount', 'units', 'active'];
  //dataSourceCatalogData = this.catalogTableData;

  constructor(private route: ActivatedRoute) {
    console.log(this.route.snapshot.data['name'])
  }

  ngOnInit() {
  }

  selectProductRow(product) {
    console.log(product);
  }

  changeProductActive(product) {
    product.active = !product.active;
    console.log(product);
  }

}
