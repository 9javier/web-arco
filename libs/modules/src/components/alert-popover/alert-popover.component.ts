import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'suite-alert-popover',
  templateUrl: './alert-popover.component.html',
  styleUrls: ['./alert-popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlertPopoverComponent implements OnInit {

  constructor(
    private popoverController: PopoverController
  ) {}

  ngOnInit() {}

  async buttonClick(response: boolean) {
    await this.popoverController.dismiss(response)
  }

}
