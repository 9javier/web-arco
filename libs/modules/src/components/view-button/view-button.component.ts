import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PopoverController} from "@ionic/angular";
import {ViewPopoverComponent} from "../view-popover/view-popover.component";

@Component({
  selector: 'suite-view-button',
  templateUrl: './view-button.component.html',
  styleUrls: ['./view-button.component.scss']
})
export class ViewButtonComponent implements OnInit {

  @Input() title: string;
  @Input() listItems: Array<any> = [];
  @Input() isFiltering: boolean;
  @Input() filterType: string = 'search';
  @Input() customFiltersLoad: boolean = false;
  @Output() applyFilters = new EventEmitter();
  @Output() clickedToOpenPopover = new EventEmitter();

  tooltipHaveValues: string = null;

  constructor(
    private popoverController: PopoverController
  ) { }

  ngOnInit() {}

  clickViewPopover(ev: any) {
    ev.stopPropagation();
    ev.preventDefault();
    if (this.customFiltersLoad) {
      this.clickedToOpenPopover.next(ev);
    } else {
      this.openViewPopover(ev, null);
    }
  }

  public async openViewPopover(ev: any, typedValue) {

    const popover = await this.popoverController.create({
      cssClass: 'popover-view',
      component: ViewPopoverComponent,
      event: ev,
      componentProps: { typedValue, products: this.listItems }
    });

    await popover.present();
  }

}
