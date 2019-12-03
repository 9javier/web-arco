import { Router } from '@angular/router';
import { IntermediaryService } from './../../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { CarrierService } from '@suite/services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { KeyboardService } from 'libs/services/src/lib/keyboard/keyboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'suite-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  reference: string
  empty$: Subscription;
  reception$: Subscription;
  constructor(
    private keyboardService: KeyboardService,
    private carrierService: CarrierService,
    private intermediaryService: IntermediaryService,
    private router: Router,
    public alertController: AlertController
  ) { 
    
   }

  ngOnInit() {
  }
  ngOnDestroy() {
    if (this.empty$) {
        this.empty$.unsubscribe();
    }
    if (this.reception$) {
      this.reception$.unsubscribe();
  }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    }, 500);
  }
  close() {
    this.router.navigate(['/packing/carrierEmptyPacking']);
  }

  keyUpInput(e) {
    if (e.keyCode == 13) {
      this.sendReference(this.reference)
    }
  }
  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }
  sendReference(reference) {
    const body =  {
     packingReference: reference
    }
   this.reception$ = this.carrierService.getReceptions(body).subscribe(
     receptions => {
       this.intermediaryService.presentToastSuccess('Paquete recepcionado exitosmente')
       this.close()
      },
     e => this.presentAlertConfirm(reference)
   )
 }

 async presentAlertConfirm(reference) {
   const alert = await this.alertController.create({
     header: 'Confirma!',
     message: `La jaula ${reference} no tiene asignado este destino para ser recibida. Desea continuar escaneado otra jaula o salir     `,
     buttons: [
       {
         text: 'No',
         role: 'cancel',
         cssClass: 'secondary',
         handler: () => {
           this.close()
         }
       }, {
         text: 'Si',
         handler: () => {
         }
       }
     ]
   });
 
   await alert.present();
 }

}

