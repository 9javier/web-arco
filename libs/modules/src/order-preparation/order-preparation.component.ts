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
  init:boolean = false;
  dataSource;
  PrintError: boolean = false;
  numLabels:number=2;
  blockedOrder: boolean = false;
  statusLabels: number = 2;
  numScanner:number = 0;
  numAllScanner: number =0;
  goScanner:boolean = false;
  expeditButton:boolean = false;
  numPackages:number = 0; 
  expeditionNull: boolean = false;
  incidenceCode: string;
  barcodeError:string;
  nScanner = "hola";
  scann: boolean = false;
  nScanned:number;
  constructor(
    private labelsService: LabelsService,
    private router: Router,
    private intermediaryService: IntermediaryService,
    private toolbarProvider: ToolbarProvider,
    private routeParams: ActivatedRoute
  ) { }

//   ionViewWillEnter() {
//     //this._someListener = this.labelsService.getScannerAlert().subscribe();
//     console.log("view enter");
//     }

//   ionViewWillLeave(){
    
//     console.log("sali");
//     //this.labelsService.getScannerAlert().subscribe().unsubscribe();

//     /*console.log("ujuuuu!");
//     //this.labelsService.getScannerAlert().subscribe().unsubscribe();
//     this._someListener.unsubscribe();*/
// //    this.labelsService.getScannerAlert().subscribe().closed;

//   }

  ngOnInit() {
    if(this.routeParams.snapshot.params.id != undefined){
      this.nScanned = this.routeParams.snapshot.params.id;
      console.log(this.nScanned);
      let data ={expeditionId:this.nScanned, update:true };
      this.getExpeditionStatus(data);
    }
    this.toolbarProvider.currentPage.next("Generar etiquetas de envio"); 
    this.initNumsScanner();  
  }

initNumsScanner(){
    this.getNumScann();
    this.getAllNumScann();
    //this.getScannerAlert(); 
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
      let result1 = [];
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
    //this.close();
    //this.router.navigate(['/order-preparation/code/'+this.numAllScanner]);
    //this.scann == true;
    if(this.numScanner != 0){
      this.labelsService.numScanner(this.numScanner);
      this.router.navigate(['/order-preparation/code']);
    }else{
      //finish scanner process
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

  async getScannerAlert() {
      console.log("entre al scanner");
      await this.labelsService.getScannerAlert().subscribe((id: any) => {
          console.log(id);
          let data ={ expeditionId: id,
          update: true
          };
          this.getExpeditionStatus(data);
        });
    
  }

  
  async getTransportStatus(body){
    this.labelsService.getTransportStatus(body).subscribe(result =>{
      let expedition = result;
      let status = expedition.status;
      this.dataSource=[result]
      this.numPackages = expedition.expedition.packages.length;
      this.numAllScanner = this.numPackages;
      this.numScanner = this.numPackages;
      this.labelsService.setNumAllScanner(this.numAllScanner);
      if(result.incidence == true){
        this.showErrorExpedition();
      }else{
        this.showExpedition();
      }
      this.sendServicePrintPack(expedition.expedition.id);
    },
    async (err) => {
      console.log(err);
    });
  }
  
  async getExpeditionStatus(body){
   await this.labelsService.getTransportStatus(body).subscribe(result =>{
      let expedition = result;
      let status = expedition.status;
      this.dataSource=[result]
      this.numPackages = expedition.expedition.packages.length;
      this.numAllScanner = this.numPackages;
      this.numScanner = this.numPackages;
      this.labelsService.setNumAllScanner(this.numAllScanner);
      this.intermediaryService.dismissLoading();
      this.showExpedition();
    //call endpoint to send expeditionId
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

  ngOnDestroy() {
   // this.labelsService.getScannerAlert().subscribe().unsubscribe();
   //this.labelsService.getScannerAlert().subscribe().closed;

  }

}
