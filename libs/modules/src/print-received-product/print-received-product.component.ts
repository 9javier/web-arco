import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Platform} from "@ionic/angular";
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
    private receptionScanditService: ReceptionScanditService
  ) {}

  ngOnInit() {
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
  }

}
