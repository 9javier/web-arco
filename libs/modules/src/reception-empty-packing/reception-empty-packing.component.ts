import { IntermediaryService } from './../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { CarrierService } from '@suite/services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'suite-reception-empty-packing',
  templateUrl: './reception-empty-packing.component.html',
  styleUrls: ['./reception-empty-packing.component.scss']
})
export class ReceptionEmptyPackingComponent implements OnInit, OnDestroy {
  empty$: Subscription;
  reception$: Subscription;
  items: any;
  receptions: any
  constructor(
    private carrierService:CarrierService,
    private intermediaryService: IntermediaryService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.empty$ = this.carrierService.getCarriesEmptyPacking().subscribe(list => this.items = list )
  }
  ngOnDestroy() {
    if (this.empty$) {
        this.empty$.unsubscribe();
    }
    if (this.reception$) {
      this.reception$.unsubscribe();
  }
  }

  onClick(item) {
    this.presentAlertConfirm(item)
  }

  async presentAlertConfirm(item) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: `Se recibio una jaula vacia con referencia ${item.reference}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            this.sendReference(item.reference)
          }
        }
      ]
    });
  
    await alert.present();
  }

  sendReference(reference) {
     const body =  {
      packingReference: reference
     }
    this.reception$ = this.carrierService.getReceptions(body).subscribe(
      receptions => this.intermediaryService.presentToastSuccess('Paquqete recepcionado exitosmente'),
      e => this.intermediaryService.presentToastError('Paquete enviado no encontrado')
    )
  }

}
