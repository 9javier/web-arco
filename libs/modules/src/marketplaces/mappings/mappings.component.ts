import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.scss']
})

export class MappingsComponent implements OnInit {

  // Brands
  private dataSourceBrands = [
    {id: 1, origin: 'ADIDAS SL', destination: 'ADIDAS' },
    {id: 2, origin: 'AMANDA A.', destination: 'AMANDA' },
    {id: 3, origin: 'ASICS', destination: 'ASICS' },
  ];

  displayedBrandsColumns: string[] = ['blank', 'id', 'origin', 'destination'];

  // Colors

  private dataSourceColors = [
    {id: 1, origin: 'AZUL', destination: 'AZUL' },
    {id: 2, origin: 'ROJO', destination: 'ROJO' },
    {id: 3, origin: 'VERDE', destination: 'VERDE' },
  ];

  displayedColorsColumns: string[] = ['blank', 'id', 'origin', 'destination'];

  // Sizes

  private dataSourceSizes = [
    {id: 1, origin: 'GRANDE', destination: 'GRANDE' },
    {id: 2, origin: 'MEDIANA', destination: 'MEDIANA' },
    {id: 3, origin: 'PEQUEÑA', destination: 'PEQUEÑA' },
  ];

  displayedSizesColumns: string[] = ['blank', 'id', 'origin', 'destination'];

  constructor(private route: ActivatedRoute) {
    console.log(this.route.snapshot.data['name']) 
  }

  ngOnInit() {
  }

  brandsFilter(e) {
    console.log(e)
  }

  colorsFilter(e) {
    console.log(e)
  }

  sizesFilter(e) {
    console.log(e)
  }

}
