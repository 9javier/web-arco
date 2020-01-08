import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-mappings',
  templateUrl: './mappings.component.html',
  styleUrls: ['./mappings.component.scss']
})

export class MappingsComponent implements OnInit {

  // Brands
  brands_data = [
    {id: 1, origin: 'ADIDAS SL', destination: 'ADIDAS' },
    {id: 2, origin: 'AMANDA A.', destination: 'AMANDA' },
    {id: 3, origin: 'ASICS', destination: 'ASICS' },
  ];

  displayedBrandsColumns: string[] = ['id', 'origin', 'destination'];
  dataSourceBrands = this.brands_data;

  // Colors

  colors_data = [
    {id: 1, origin: 'AZUL', destination: 'AZUL' },
    {id: 2, origin: 'ROJO', destination: 'ROJO' },
    {id: 3, origin: 'VERDE', destination: 'VERDE' },
  ];

  displayedColorsColumns: string[] = ['id', 'origin', 'destination'];
  dataSourceColors = this.colors_data;

  // Sizes

  sizes_data = [
    {id: 1, origin: 'GRANDE', destination: 'GRANDE' },
    {id: 2, origin: 'MEDIANA', destination: 'MEDIANA' },
    {id: 3, origin: 'PEQUEÑA', destination: 'PEQUEÑA' },
  ];

  displayedSizesColumns: string[] = ['id', 'origin', 'destination'];
  dataSourceSizes = this.sizes_data;

  constructor(private route: ActivatedRoute) {
    console.log(this.route.snapshot.data['name']) 
  }

  ngOnInit() {
  }

}
