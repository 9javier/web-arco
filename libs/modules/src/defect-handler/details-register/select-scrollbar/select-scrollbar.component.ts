import { Component, ViewChild, Input, Output, EventEmitter, OnInit, ViewContainerRef, TemplateRef, NgZone, ViewEncapsulation } from '@angular/core';
import {SelectScrollbarProvider} from "../../../../../services/src/providers/select-scrollbar/select-scrollbar.provider";
import {NavParams, PopoverController} from "@ionic/angular";
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'suite-select-scrollbar',
  templateUrl: './select-scrollbar.component.html',
  styleUrls: ['./select-scrollbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectScrollbarComponent implements OnInit{
  @Input() allOptions;
  @Output() selectChange = new EventEmitter();
  view: any;

  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private selectScrollbarProvider: SelectScrollbarProvider,
    private vcr: ViewContainerRef,
  ) { }

  select(option) {
    this.popoverCtrl.dismiss(option);
  }

  ngOnInit() {
    this.allOptions = this.selectScrollbarProvider.allOptions;
  }
}
