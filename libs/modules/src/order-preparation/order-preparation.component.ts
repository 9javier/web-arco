import { Component, OnInit, ViewChild, 
  Input,Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LabelsService } from '@suite/services';
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
  numLabels:number=2;
  blockedOrder: boolean = false;
  statusLabels: number = 2;
  numScanner:number = 0;
  numAllScanner: number =0
  constructor(
    private labelsService: LabelsService,
    private router: Router
  ) { }

  ngOnInit() {
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
    this.StatusPrint=true;
    this.initPage = false;
  }


  async print(){
    this.labelsService.getIndexLabels().subscribe(result =>{
      console.log(result[0].status);
      let status = result[0].status;
      let blocked = result[0].blocked;
      this.numAllScanner = 4;
      this.numScanner = 4;
      this.labelsService.setNumAllScanner(this.numAllScanner);
      if(blocked == false){
        if(status == true){
          this.showExpedition();
        }else{
          this.showErrorExpedition();
        }
      }else{
        this.showBlockedOrder();
      }

    });
  }

  showErrorExpedition(){
    this.StatusPrint=false;
    this.initPage = false;
    this.PrintError =true;
  }

  scanner(){

    if(this.numScanner != 0){
      this.labelsService.numScanner(this.numScanner);
      this.router.navigate(['/order-preparation/code']);
    }else{
      //finish scanner process
    }
    
  }

  close(){
    this.StatusPrint = false;
    this.initPage = false;
    this.PrintError =false;
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
      }
    })
    
  }
  
  async getAllNumScann() {
    this.labelsService.getNumAllScanner().subscribe((resp: any) => {
      console.log(resp);
      this.numAllScanner = resp;
    })
    
  }

  statusScanner(){
    let numScanned = (this.numAllScanner - this.numScanner)
    let status =numScanned +" de "+this.numAllScanner
    
    return status ;

  }

}
