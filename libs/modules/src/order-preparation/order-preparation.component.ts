import { Component, OnInit, ViewChild, 
  Input,Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LabelsService, environment } from '@suite/services';
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
  expeditButton:boolean = false;
  numPackages:number = 0; 
  expeditionNull: boolean = false;
  nScanned:number =0;
  expeditionId:number = 0;
  avelonFailed:boolean = false;
  expeId:number =0;
  viewInput:boolean = false;
  id=0;
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
      this.expeId =this.routeParams.snapshot.params.id;
      let data ={expeditionId:this.nScanned, update:true };
      this.showExpedition();
      this.getExpeditionStatus(data);
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
            this.expeId = expedition.id;
            let data = { expeditionId: expedition.id, update: true}; 
            this.getTransportStatus(data);
        }else{
            this.intermediaryService.dismissLoading();
            this.showExpeditionNull();
        }
    },
    async (err) => {
      this.intermediaryService.dismissLoading();
      if(err.error.errors == "Expeditions Locked"){
        this.showBlockedOrder();
      }else{
        this.showAvelonFail();
      }
    });
  }

  showAvelonFail(){
    this.close();
    this.avelonFailed =true;
    
  }

  showErrorExpedition(){
    this.close();
    this.PrintError =true;
    
  }

  scanner(){
    if(this.numScanner != 0){
      if(this.nScanned != 0){
        this.id = this.expeId;
        this.labelsService.numScanner(this.numScanner);
        this.showInputScanner();
      }else{
        this.id = this.expeId;
        this.labelsService.numScanner(this.numScanner);
        this.showInputScanner();
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
      this.numAllScanner = resp;
     
    })
    
  }

  async getTransportStatus(body){
    let This = this;
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
      This.intermediaryService.dismissLoading();
      this.intermediaryService.dismissLoading();
      this.sendServicePrintPack(this.expeId);
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
      this.sendServicePrintPack(this.expeId); 
    },
    async (err) => {
      this.intermediaryService.dismissLoading();
      this.sendServicePrintPack(this.expeId);
    });
    
  }

 async sendServicePrintPack(id){
   let body = {expeditionId:id }
  this.labelsService.postServicePrintPack(body).subscribe(result =>{
    console.log(result);
    
    const url = `${environment.downloadFiles}/${result.pdf}`
    const archor = document.createElement('a');
    archor.href= url;
    archor.target= '_blank'
    archor.download;
    console.log(archor);
    archor.click()
  },
  async (err) => {
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
    this.close();
    this.initPage = true;
    this.cleanAll();
    this.router.navigateByUrl('/list-alerts');
  }

  close(){
    this.StatusPrint = false;
    this.initPage = false;
    this.PrintError =false;
    this.blockedOrder = false;
    this.expeditButton = false;
    this.expeditionNull = false;
    this.avelonFailed = false;
    this.viewInput = false;
  }

  cleanAll(){
    this.dataSource = null;
    this.expeId=0;
    this.numScanner= 0;
    this.numAllScanner=0;
    this.expeditionId = 0;
    this.numPackages=0;
  }

  return(){
    this.close();
    this.initPage = true;
    this.cleanAll();
  }

  returnToExpedition(){
    this.close();
    this.initPage = true;
    this.cleanAll();
    this.router.navigateByUrl('/order-preparation');
  }

  ngOnDestroy(){
    this.close();
    this.cleanAll();
  }

  showInputScanner(){
    this.close();
    this.viewInput = true;
  }

  showExpe(event){
    this.showExpedition();
  }

}
