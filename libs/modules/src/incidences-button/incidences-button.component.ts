import { Component, OnInit } from '@angular/core';
import { IncidencesPopoverComponent } from "../incidences-popover/incidences-popover.component";
import { PopoverController } from "@ionic/angular";
import { IncidencesService } from "../../../services/src/lib/endpoint/incidences/incidences.service";
import {Router} from "@angular/router";

@Component({
  selector: 'button-incidences',
  templateUrl: './incidences-button.component.html',
  styleUrls: ['./incidences-button.component.scss']
})
export class IncidencesButtonComponent implements OnInit {

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    public incidencesService: IncidencesService
  ) { }

  ngOnInit() {
    // Get all incidences to app start
    this.incidencesService.init();

    // Reload incidences each 15 seconds
    setInterval(() => {
      this.incidencesService.init();
    }, 30 * 1000);
  }

  async showIncidences(ev: any) {
    if (this.incidencesService.incidencesQuantity > 0) {
      const popover = await this.popoverController.create({
        component: IncidencesPopoverComponent,
        event: ev,
        cssClass: 'popover-incidences'
      });

      popover.onDidDismiss().then((data) => {
        if (data && data.data && data.data.showMore) {
          this.router.navigate(['incidences']);
        }
      });

      return await popover.present();
    }
  }

}
