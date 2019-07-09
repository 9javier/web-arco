import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource, MatPaginator} from '@angular/material';


import {
  IntermediaryService,
  LabelsService,
  TariffService,
  TariffModel

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

    /**Quantity of items for show in any page */
    pagerValues = [20, 30, 40];

    private page:number = 0;
    private limit:number = this.pagerValues[0];

    @ViewChild(MatPaginator) paginator: MatPaginator;


    displayedColumns: string[] = ['name', 'initDate', 'endDate'];
    dataSource: any;

  constructor(    
    private intermediaryService:IntermediaryService,
    private formBuilder:FormBuilder,
    private tariffService:TariffService,
    private router:Router) { }

  ngOnInit() {
    this.getTariffs(this.page,this.limit);
    this.listenChanges();
  }

  listenChanges():void{
    let previousPageSize = this.limit
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page=>{
      /**true if only change the number of results */
      let flag = previousPageSize == page.pageSize;
      previousPageSize = page.pageSize;
      this.limit = page.pageSize;
      this.page = flag?page.pageIndex+1:1;
      this.getTariffs(this.page,this.limit);
    });
  }

  /**
   * Go to product view
   * @param id - the id of the selected tariff
   */
  goPrices(id:number):void{
    let a:TariffModel.Tariff;
    this.router.navigate(['prices',id]);
  }

  /**
   * Get labels to show
   */
  getTariffs(page:number,limit:number):void{
    this.intermediaryService.presentLoading();
    this.tariffService.getIndex(page, limit).subscribe(tariffs=>{
      this.intermediaryService.dismissLoading();
      /**save the data and format the dates */
      this.tariffs = tariffs.results.map(result=>{
        result.activeFrom = new Date(result.activeFrom).toLocaleDateString();
        result.activeTill = new Date(result.activeTill).toLocaleDateString();
        return result;
      });
      this.dataSource = new MatTableDataSource<any>(this.tariffs);
      let paginator = tariffs.pagination;
      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.page - 1;
    })
  }


}
