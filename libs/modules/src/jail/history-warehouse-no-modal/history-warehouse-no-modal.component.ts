import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarrierService, IntermediaryService, WarehouseService } from '@suite/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import {DateTimeParserService} from "../../../../services/src/lib/date-time-parser/date-time-parser.service";

export interface CallToService{
  warehouse:number,
  startDate:string,
  endDate:string,
}

@Component({
  selector: 'history-warehouse-nm',
  templateUrl: './history-warehouse-no-modal.component.html',
  styleUrls: ['./history-warehouse-no-modal.component.scss']
})

export class HistoryWarehouseNMComponent implements OnInit {
  title = 'Destinos';
  redirectTo = '/jails';

  displayedColumns: string[] = ['type', 'dateSend', 'dateReceive', 'reference'];
  pagerValues = [50, 100, 500];

  public datemin = "";
  public datemax = "";
  public whsCode = 0;
  public whs: any;
  public results:any;
  public typeMovement:any = [];
  validateDates = false;

  valueWarehouse;
  valueStarDate;
  valueEndDate;

  dataSource = new MatTableDataSource<any>();
  nStore:string;
  jOnStore:string;
  jOnTI:string;
  jOnTV:string;
  formVar: FormGroup;
  endMinDate;

  constructor(
    private route: ActivatedRoute,
    private carrierService: CarrierService,
    private warehouseService:WarehouseService,
    private intermediaryService: IntermediaryService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {
    this.valueStarDate = new Date(this.dateTimeParserService.firstDayOfMonth());
    this.valueEndDate = new Date(this.dateTimeParserService.lastDayOfMonth());
    this.getCarriers();
    this.setForms();
    this.getMovementTypeFromService();
  }

  getCarriers(): void {
    this.intermediaryService.presentLoading();
    this.warehouseService.getIndex().then(observable=>{
      observable.subscribe(carriers => {
        this.whs = (<any>carriers.body).data;
        this.intermediaryService.dismissLoading();
      })
    })
  }

  getAllInfo():void{
    this.getParamsFromForm();
    let body: CallToService={
      warehouse:this.whsCode,
      startDate:this.datemin.toString(),
      endDate:this.datemax.toString(),
    };
    this.carrierService.postMovementsHistory(body).subscribe(sql_result => {
      this.results = sql_result;
      this.dataSource = this.results['historyList'];
      this.nStore = `${this.results['warehouse']['reference']} - ${this.results['warehouse']['name']}`;
      this.jOnStore = this.results['carriesInWarehouse'];
      this.jOnTI = this.results['goingCarries'];
      this.jOnTV = this.results['returnCarries'];
    });
  }

  getMovementTypeFromService():void{
    this.carrierService.getMovementType().subscribe(result => {
      this.typeMovement = result;
    });
  }

  public setMovementType(type:any):string{
    let name = '';
    let typesMov = (this.typeMovement);
    typesMov.forEach(function(v){
      if(type === v['id'])
        name = v['name'];
    });
    return name;
  }

  getParamsFromForm(){
    this.whsCode = this.formVar.value['warehouse'];
    this.datemin = this.datePipe.transform(this.formVar.value['beginDate'],"yyyy-MM-dd");
    this.datemax = this.datePipe.transform(this.formVar.value['endDate'],"yyyy-MM-dd");
  }

  setForms():void{
    this.formVar = this.fb.group({
      warehouse: this.whsCode,
      beginDate: this.datemin,
      endDate: this.datemax
    });
  }

  onDate(type, event) {
    this.validateRangeDate();
    if (type === 'start') {
      this.endMinDate = new Date(event.value);
    }
  }

  validateRangeDate() {
    if (this.valueStarDate && this.valueEndDate && this.valueWarehouse) {
      return this.validateDates = this.valueStarDate.getTime() <= this.valueEndDate.getTime();
    }

    return this.validateDates = false;
  }
}
