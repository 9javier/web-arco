import { Component, OnInit, ViewChild, 
  Input,Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LabelsService } from '@suite/services';
import { IntermediaryService } from '@suite/services';
import { ToolbarProvider } from "../../../services/src/providers/toolbar/toolbar.provider";
import {Subscription} from "rxjs";
import { Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'order-preparation',
  templateUrl: './order-preparation.component.html',
  styleUrls: ['./order-preparation.component.scss'],
})
export class OrderPreparationComponent implements OnInit {

  StatusPrint: boolean = false;
  initPage: boolean = true;
  dataSource;
  PrintError: boolean = false;
  blockedOrder: boolean = false;
  numScanner:number = 0;
  numAllScanner: number =0;
  goScanner:boolean = false;
  expeditButton:boolean = false;
  numPackages:number = 0; 
  expeditionNull: boolean = false;
  nScanned:number =0;
  expeditionId:number = 0;
  expeAlert:number = 0;
  constructor(
    private labelsService: LabelsService,
    private router: Router,
    private intermediaryService: IntermediaryService,
    private toolbarProvider: ToolbarProvider,
    private routeParams: ActivatedRoute
  ) { }

  ngOnInit() {
    this.toolbarProvider.currentPage.next("Generar etiquetas de envio");
    this.initViews();
    this.initNumsScanner();  
    
  }

  initViews(){
    if(this.routeParams.snapshot.params.id != undefined){
      this.nScanned = this.routeParams.snapshot.params.id;
      console.log(this.nScanned);
      let data ={expeditionId:this.nScanned, update:true };
      this.showExpedition();
      this.getExpeditionStatus(data);
    }else if(this.routeParams.snapshot.params.id_alert != undefined){
        let expeId = this.routeParams.snapshot.params.id_alert;
        let data ={expeditionId:expeId, update:true };
        this.getExpeState(data);
    }
  }

  initNumsScanner(){
      this.getNumScann();
      this.getAllNumScann();
  }
  
  printLabels(){
    this.print();
  }

  showExpedition(){
    this.close();
    this.StatusPrint=true;
  }

  async print(){
    await this.intermediaryService.presentLoading("cargando expedición...");
     this.labelsService.getIndexLabels().subscribe(result =>{
     let expedition = result[0];
        if(result.length >0){
           // this.intermediaryService.dismissLoading();
            let data = { expeditionId: expedition.id, update: true}; 
            this.getTransportStatus(data);
        }else{
            this.showExpeditionNull();
        }
      
      //  this.intermediaryService.dismissLoading();
    },
    async (err) => {
      this.intermediaryService.dismissLoading();
      this.showBlockedOrder();
      console.log(err);
    });
  }

  showErrorExpedition(){
    this.close();
    this.PrintError =true;
    
  }

  scanner(){
    if(this.numScanner != 0){
      if(this.nScanned != 0){
        this.labelsService.numScanner(this.numScanner);
        this.showExpedition();
        this.router.navigateByUrl('/order-preparation/code/alert/'+this.expeditionId);
      }else{
        this.labelsService.numScanner(this.numScanner);
        this.showExpedition();
        this.router.navigateByUrl('/order-preparation/code/'+this.expeditionId);
      }
      
    }
  }


  showBlockedOrder(){
    this.close();
    this.blockedOrder = true;
  }

  async getNumScann() {
    this.labelsService.getData().subscribe((resp: any) => {
      this.numScanner = resp;
      if(resp == 0){
        this.expeditButton = true;
      }
    })
    
  }
  
  async getAllNumScann() {
    this.labelsService.getNumAllScanner().subscribe((resp: any) => {
      console.log(resp);
      this.numAllScanner = resp;
     
    })
    
  }

  async getTransportStatus(body){
    let This = this;
    //This.intermediaryService.presentLoading("cargando expedición...");
    await this.labelsService.getTransportStatus(body).subscribe(result =>{
      let expedition = result;
      this.dataSource=[result];
      this.numPackages = expedition.expedition.packages.length;
      this.numAllScanner = this.numPackages;
      this.numScanner = this.numPackages;
      this.expeditionId = expedition.expedition.id;
      This.intermediaryService.dismissLoading();
      this.labelsService.setNumAllScanner(this.numAllScanner);
      if(result.incidence == true){
        this.showErrorExpedition();
      }else{
        this.showExpedition();
      }
      This.intermediaryService.dismissLoading();
      this.sendServicePrintPack(expedition.expedition.id);
    },
    async (err) => {
      console.log(err);
      This.intermediaryService.dismissLoading();
    });
  }
  
  async getExpeditionStatus(body){
    this.intermediaryService.presentLoading("cargando expedición...");
   await this.labelsService.getTransportStatus(body).subscribe(result =>{
    this.intermediaryService.dismissLoading();
      let expedition = result;
      this.dataSource=[result]
      this.numPackages = expedition.expedition.packages.length;
      this.numAllScanner = this.numPackages;
      this.numScanner = this.numPackages;
      this.expeditionId = expedition.expedition.id;
      this.labelsService.setNumAllScanner(this.numAllScanner);
      this.showExpedition();
      this.sendServicePrintPack(expedition.expedition.id); 
    },
    async (err) => {
      console.log(err);
      this.intermediaryService.dismissLoading();
    });
    
  }

  async getExpeState(body){
    this.intermediaryService.presentLoading("cargando expedición...");
    await this.labelsService.getTransportStatus(body).subscribe(result =>{
       this.intermediaryService.dismissLoading();
       let expedition = result;
       this.dataSource=[result];
       console.log(this.numAllScanner);
       this.expeditionId = expedition.expedition.id;
       this.showExpedition();
       this.getNumScann();
     },
     async (err) => {
       console.log(err);
       this.intermediaryService.dismissLoading();
     });
     
   }
  
 async sendServicePrintPack(id){
   let body = {expeditionId:id }
  this.labelsService.postServicePrintPack(body).subscribe(result =>{
  },
  async (err) => {
    console.log(err);
  });
  }

  statusScanner(){
    let numScanned = (this.numAllScanner - this.numScanner)
    let status =numScanned +" de "+this.numAllScanner
    
    return status ;
  }

  showExpeditionNull(){
    this.close();
    this.expeditionNull = true;
  }

  showAlerts(){
    this.showExpedition();
    this.router.navigateByUrl('/list-alerts');
  }

  close(){
    this.StatusPrint = false;
    this.initPage = false;
    this.PrintError =false;
    this.blockedOrder = false;
    this.expeditButton = false;
    this.expeditionNull = false;
  }

  return(){
    this.close();
    this.initPage = true;
  }


}
