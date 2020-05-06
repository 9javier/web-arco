import { Component, OnInit } from '@angular/core';
import { ExpeditionService,IntermediaryService } from '@suite/services';
import { ModalController, NavParams} from "@ionic/angular";

@Component({
  selector: 'suite-internal-expedition-modal',
  templateUrl: './internal-expedition-modal.component.html',
  styleUrls: ['./internal-expedition-modal.component.scss']
})


export class InternalExpeditionModalComponent implements OnInit {

  idInternalExpedition = null;
  orderPackages = null;
  opProducts = null;

  section = "information";

  vars = {
    originShop:"",
    destinyShop:"",
    deliveryRequest:"",
    transport:"",
    status:""
  }


  public isProductRelocationEnabled: boolean = true;

  constructor(
    private expeditionService: ExpeditionService,
    private navParams: NavParams,
    private modalController: ModalController,
    private intermediaryService:IntermediaryService,
  ) {
  }

  async ngOnInit() {
    this.idInternalExpedition = this.navParams.get("internal-expedition");
    await this.getOrderExpediton();
  }


  async getOrderExpediton(){
    
    this.intermediaryService.presentLoading();
    await this.expeditionService.getExpeditionInfo(this.idInternalExpedition).subscribe(result => {
      

      if(result!= null || result!= undefined){
        this.vars.originShop = result.originShop.name;
        this.vars.destinyShop = result.destinationShop.name;
        this.vars.deliveryRequest = result.deliveryRequestExternalId;
        this.vars.transport = result.transport.name;
        this.vars.status = result.status;
        this.orderPackages = result.orderPackage;
        this.opProducts = result.opProducts;
        this.intermediaryService.dismissLoading();

        console.log(result);
      }else{
        this.intermediaryService.presentToastPrimary("Expedición no encontrada",3500,"bottom")
        this.intermediaryService.dismissLoading();
        this.modalController.dismiss();        
      }      
    });
  }

  close() {
    this.modalController.dismiss();
  }

}
