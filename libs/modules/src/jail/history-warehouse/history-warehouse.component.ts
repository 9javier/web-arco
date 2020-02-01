



import { Component, OnInit, Input} from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import {Router, ActivatedRoute} from '@angular/router';
import {HistoryWarehouseModalComponent} from './history-warehouse-modal/history_whs_modal.component';
import { CarrierService, WarehouseModel, IntermediaryService } from '@suite/services';
import { Validators, FormBuilder, FormGroup, FormArray,  FormControl, } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface callToService{
  warehouse:number,
  startDate:string,
  endDate:string,
}

@Component({
  selector: 'history-warehouse',
  templateUrl: './history-warehouse.component.html',
  styleUrls: ['./history-warehouse.component.scss']
})

export class HistoryWarehouseComponent implements OnInit {
  title = 'Destinos';
  redirectTo = '/jails';
  destinations;
  jail;


  displayedColumns: string[] = ['type', 'dateSend', 'dateReceive', 'reference'];
  pagerValues = [50, 100, 500];

  private datemin = "2020-01-01";
  private datemax = "2020-02-27";
  private whsCode = 6;
  public whs: any;
  public results:any;
  public typeMovement:any = [];


  nStore:string;
  jOnStore:string;
  jOnTI:string;
  jOnTV:string;
  nBulto:string;

  formVar: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: HistoryWarehouseModalComponent,
    private carrierService: CarrierService,
    private intermediaryService: IntermediaryService,
    private fb: FormBuilder,
  ) {

  }

  // -----------

  getCarriers(): void {
    this.intermediaryService.presentLoading();
    this.carrierService.getAllWhs().subscribe(carriers => {
      this.whs = carriers;
      this.intermediaryService.dismissLoading();
    })
  }

  dataSource = new MatTableDataSource<any>();


  getAllInfo(){
    let body:callToService={
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


  getMovementTypeFromService(){
    this.carrierService.getMovementType().subscribe(result => {
      this.typeMovement = result;
    });
  }

  public setMovementType(type:any):string{
    let name;
    let typesMov = (this.typeMovement);

    typesMov.forEach(function(v){
      if(type==v['id'])
        name = v['name'];
    });

    return name;
  }

  // ----------------

  ngOnInit() {
    this.getCarriers();
    this.formVar = this.fb.group({
      warehouse: '',
      beginDate: '',
      endDate: ''
    });
    this.getAllInfo();
    this.getMovementTypeFromService();
  }



}
