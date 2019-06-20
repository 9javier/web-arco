import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource} from '@angular/material';


import {
  IntermediaryService,
  LabelsService,
  TariffService

} from '@suite/services';


import { FormBuilder,FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'suite-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss']
})
export class TariffComponent implements OnInit {


    /**Arrays to be shown */
    tariffs:Array<any> = [];

    displayedColumns: string[] = ['name', 'initDate', 'endDate'];
    dataSource: any;

  constructor(    
    private intermediaryService:IntermediaryService,
    private formBuilder:FormBuilder,
    private tariffService:TariffService,
    private router:Router) { }

  ngOnInit() {
    this.getTariffs();
  }

  /**
   * Go to product view
   */
  goToProducts():void{
    this.router.navigate(['products']);
  }

  /**
   * Get labels to show
   */
  getTariffs():void{
    this.tariffService.getIndex().subscribe(tariffs=>{
      this.tariffs = tariffs;
      this.dataSource = new MatTableDataSource<any>(this.tariffs);
    })
  }


}
