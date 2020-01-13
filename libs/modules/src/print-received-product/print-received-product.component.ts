import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Platform, ToastController} from "@ionic/angular";
import {ReceptionScanditService} from "../../../services/src/lib/scandit/reception/reception.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-print-received-product',
  templateUrl: './print-received-product.component.html',
  styleUrls: ['./print-received-product.component.scss']
})

export class PrintReceivedProductComponent implements OnInit {

  private returnToScandit: boolean = false;
  private backButtonOverride: any = null;

  constructor(
    private route: ActivatedRoute,
    private platform: Platform,
    private location: Location,
    private router: Router,
    private toastCtrl: ToastController,
    private receptionScanditService: ReceptionScanditService,
  ) {}

  ngOnInit() {
    this.route.url.subscribe((url: any )=> {
      if (url && url.length > 0 && url[0].path == 'scandit') {
        if (url[1].path) {
          this.presentSnackbar('Nuevos productos para la tienda detectados.', 'VER');
        }

        this.returnToScandit = true;
      } else{
        this.returnToScandit = false;
      }
    });

    this.backButtonOverride = this.platform.backButton.subscribeWithPriority(9999, () => {
      if (this.returnToScandit) {
        this.returnToScandit = false;
        this.receptionScanditService.reception(1);
        this.location.back();
      }
    });
  }

  ngOnDestroy() {
    this.backButtonOverride.unsubscribe();
  }

  async presentSnackbar(message: string, closeBtn: string = 'CERRAR') {
    let toast = await this.toastCtrl.create({
      message: message,
      closeButtonText: closeBtn,
      color: 'dark',
      showCloseButton: true
    });

    toast.onDidDismiss().then(() => {
      this.router.navigate(['new-products']);
    });

    return toast.present();
  }

}
