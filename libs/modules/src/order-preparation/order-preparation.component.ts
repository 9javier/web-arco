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
  nScanned:number;
  expeditionId:number = 0;
  constructor(
    private labelsService: LabelsService,
    private router: Router,
    private intermediaryService: IntermediaryService,
    private toolbarProvider: ToolbarProvider,
    private routeParams: ActivatedRoute
  ) { }

  ngOnInit() {
    this.toolbarProvider.currentPage.next("Generar etiquetas de envio"); 
    if(this.routeParams.snapshot.params.id != undefined){
      this.nScanned = this.routeParams.snapshot.params.id;
      console.log(this.nScanned);
      let data ={expeditionId:this.nScanned, update:true };
      this.getExpeditionStatus(data);
    }
    this.initNumsScanner();  
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
            this.intermediaryService.dismissLoading();
            let data = { expeditionId: expedition.id, update: true}; 
            this.getTransportStatus(data);
        }else{
            this.showExpeditionNull();
        }
      this.intermediaryService.dismissLoading();
    },
    async (err) => {
      await this.intermediaryService.dismissLoading();
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
      this.labelsService.numScanner(this.numScanner);
      this.router.navigateByUrl('/order-preparation/code/'+this.expeditionId);
    }
  }


  showBlockedOrder(){
    this.close();
    this.blockedOrder = true;
  }

  async getNumScann() {
    this.labelsService.getData().subscribe((resp: any) => {
      console.log(resp);
      this.numScanner = resp;
      if(resp == 0){
        console.log("finish scanner");
        this.expeditButton =true;
      }
    })
    
  }
  
  async getAllNumScann() {
    this.labelsService.getNumAllScanner().subscribe((resp: any) => {
      console.log(resp);
      this.numAllScanner = resp;
    })
    
  }

  async   getTransportStatus(body){
    this.labelsService.getTransportStatus(body).subscribe(result =>{
      let expedition = result;
      this.dataSource=[result];
      this.numPackages = expedition.expedition.packages.length;
      this.numAllScanner = this.numPackages;
      this.numScanner = this.numPackages;
      this.expeditionId = expedition.expedition.id;
      this.intermediaryService.dismissLoading();
      this.labelsService.setNumAllScanner(this.numAllScanner);
      if(result.incidence == true){
        this.showErrorExpedition();
      }else{
        this.showExpedition();
      }
      this.intermediaryService.dismissLoading();
      this.sendServicePrintPack(expedition.expedition.id);
    },
    async (err) => {
      console.log(err);
      this.intermediaryService.dismissLoading();
    });
  }
  
  async getExpeditionStatus(body){
   await this.labelsService.getTransportStatus(body).subscribe(result =>{
      let expedition = result;
      this.dataSource=[result]
      this.numPackages = expedition.expedition.packages.length;
      this.numAllScanner = this.numPackages;
      this.numScanner = this.numPackages;
      this.expeditionId = expedition.expedition.id;
      this.labelsService.setNumAllScanner(this.numAllScanner);
      this.intermediaryService.dismissLoading();
      this.showExpedition();
    this.sendServicePrintPack(expedition.expedition.id); 
    },
    async (err) => {
      console.log(err);
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
