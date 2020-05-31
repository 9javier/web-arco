import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MarketplacesService } from 'libs/services/src/lib/endpoint/marketplaces/marketplaces.service';

@Component({
  selector: 'suite-create-mapping',
  templateUrl: './create-mapping.component.html',
  styleUrls: ['./create-mapping.component.scss']
})
export class CreateMappingComponent implements OnInit {

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  constructor(
    private router : Router,
    private marketplacesService: MarketplacesService
  ) { }

  ngOnInit() {
    this.getMap();
  }

  create() {
    this.router.navigate(['/marketplaces/krackonline/mapping']);
  }

  getMap() {
    this.marketplacesService.getMapDataRules().subscribe(data => {
      if(data) {
        console.log(data)
      } else {
        console.log('error')
      }
    })
  }

}
