import { Component, OnInit, ViewChild, 
  Input,Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LabelsService } from '@suite/services';
import { IntermediaryService } from '@suite/services';

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
  constructor(
    private labelsService: LabelsService,
    private router: Router,
    private intermediaryService: IntermediaryService
  ) { }

  ngOnInit() {
    this.init =true;
    console.log("entre");
    this.initNumsScanner();  
  }
initNumsScanner(){
  this.getNumScann();
  this.getAllNumScann();
  this.getScannerAlert();
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
      /*let status = expedition.status;
      this.dataSource= result
      this.numPackages = expedition.packages.length;
      this.numAllScanner = this.numPackages;
      this.numScanner = this.numPackages;*/
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

  showErrorExpedition(incidenceCode){
    this.close();
    this.PrintError =true;
    this.incidenceCode = incidenceCode;
  }

  scanner(){
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
    //console.log("alert");
    //if(this.init == true){
      this.init =false;
      this.labelsService.getScannerAlert().subscribe((id: any) => {
        console.log(id);
        let data ={ expeditionId: id,
        update: true
        };
        this.getExpeditionStatus(data);
      })
    //}
    this.init =false;
    
  }

  async printById(id){
    let body ={expeditionId: id, update: true};
    await this.intermediaryService.presentLoading("cargando expedición...");
    this.labelsService.getExpeditionByBarcode(body).subscribe(result =>{
      console.log(result);
      result
      let expedition = result;
      let status = expedition.status;
      this.dataSource=[result]
      this.numPackages = expedition.packages.length;
      this.numAllScanner = this.numPackages;
      this.numScanner = this.numPackages;
      this.labelsService.setNumAllScanner(this.numAllScanner);
      this.intermediaryService.dismissLoading();
      this.showExpedition();
      
         
      
      this.intermediaryService.dismissLoading();
    },
    async (err) => {
      await this.intermediaryService.dismissLoading();
      this.showBlockedOrder();
      console.log(err);
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
        this.showErrorExpedition(result.incidenceCode);
      }else{
        this.showExpedition();
      }
    },
    async (err) => {
      console.log(err);
    });
  }
  
  async getExpeditionStatus(body){
    this.labelsService.getTransportStatus(body).subscribe(result =>{
      let expedition = result;
      let status = expedition.status;
      this.dataSource=[result]
      this.numPackages = expedition.expedition.packages.length;
      this.numAllScanner = this.numPackages;
      this.numScanner = this.numPackages;
      //this.labelsService.setNumAllScanner(this.numAllScanner);
      this.intermediaryService.dismissLoading();
      this.showExpedition();
        //call endpoint to send expeditionId   
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
    this.init = false;
    this.router.navigate(['/transport-manifest']);
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
