import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Platform, ToastController} from "@ionic/angular";
import {ReceptionScanditService} from "../../../services/src/lib/scandit/reception/reception.service";
import {Location} from "@angular/common";
import {PickingNewProductsService} from "../../../services/src/lib/endpoint/picking-new-products/picking-new-products.service";
import {AuthenticationService} from "@suite/services";

@Component({
  selector: 'app-print-received-product',
  templateUrl: './print-received-product.component.html',
  styleUrls: ['./print-received-product.component.scss']
})

export class PrintReceivedProductComponent implements OnInit {

  private returnToScandit: boolean = false;
  private backButtonOverride: any = null;

  private snackbarItem: HTMLIonToastElement = null;

  constructor(
    private route: ActivatedRoute,
    private platform: Platform,
    private location: Location,
    private router: Router,
    private toastCtrl: ToastController,
    private receptionScanditService: ReceptionScanditService,
    private pickingNewProductsService: PickingNewProductsService,
    private authenticationService: AuthenticationService
  ) {}

  async ngOnInit() {
    if (await this.authenticationService.isStoreUser()) {
      const storeId = (await this.authenticationService.getStoreCurrentUser()).id;

      this.pickingNewProductsService
        .getCheckReceivedInfo(storeId)
        .subscribe(async res => {
          if (res.receiveRequestedProducts) {
            this.presentSnackbar('Se han recibido productos que habías solicitado a otras tiendas.', 'VER', 'requested');
          } else if (res.hasNewProducts) {
            this.presentSnackbar('Nuevos productos para la tienda detectados.', 'VER', 'news');
          }
        }, error => console.error('Error to check info of received products'));
    }

    this.route.url.subscribe((url: any )=> {
      if (url && url.length > 0 && url[0].path == 'scandit') {
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
    if (this.snackbarItem) {
      this.snackbarItem.dismiss();
      this.snackbarItem = null;
    }
  }

  async presentSnackbar(message: string, closeBtn: string = 'CERRAR', redirectPage: 'news'|'requested') {
    if (!this.snackbarItem) {
      this.snackbarItem = await this.toastCtrl.create({
        message: message,
        closeButtonText: closeBtn,
        color: 'dark',
        showCloseButton: true
      });

      this.snackbarItem.onDidDismiss().then(() => {
        this.snackbarItem = null;
        if (redirectPage == "news") {
          this.router.navigate(['new-products']);
        } else {
          this.router.navigate(['requested-products']);
        }
      });

      return this.snackbarItem.present();
    }
  }

}
