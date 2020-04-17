import { Component, ViewChild, Input, Output, EventEmitter, OnInit, ViewContainerRef, TemplateRef, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';
import { AlertController } from "@ionic/angular";
import { PrinterService } from "../../../../../services/src/lib/printer/printer.service";
import {ItemReferencesProvider} from "../../../../../services/src/providers/item-references/item-references.provider";
import { IntermediaryService, PriceModel, PriceService } from '@suite/services';
import { PrintModel } from "../../../../../services/src/models/endpoints/Print";
import { environment as al_environment } from "../../../../../../apps/al/src/environments/environment";
import { AudioProvider } from "../../../../../services/src/providers/audio-provider/audio-provider.provider";
import { KeyboardService } from "../../../../../services/src/lib/keyboard/keyboard.service";
import { PositionsToast } from '../../../../../services/src/models/positionsToast.type';
import {SelectScrollbarProvider} from "../../../../../services/src/providers/select-scrollbar/select-scrollbar.provider";
import {NavParams, PopoverController} from "@ionic/angular";
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'suite-select-scrollbar',
  templateUrl: './select-scrollbar.component.html',
  styleUrls: ['./select-scrollbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectScrollbarComponent implements OnInit{
  @Input() labelKey = 'label';
  @Input() idKey = 'id';
  @Input() allDefectType;
  @Input() model;
  @Output() selectChange = new EventEmitter();
  searchControl = new FormControl();
  visibleOptions = 4;
  originalOptions: any[];
  view: any;
  popperRef: any;
  closed: any;

  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  public filterType: string = '';
  public title: string = '';
  public listItems: Array<any> = new Array<any>();
  private listItemsFinal: Array<any> = new Array<any>();
  public typedFilter: string = "";
  public allSelected: boolean = true;
  public itemsToRender: Array<any> = new Array<any>();

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private selectScrollbarProvider: SelectScrollbarProvider,
    private vcr: ViewContainerRef,
    private zone: NgZone
  ) { }

  open(dropdownTpl: TemplateRef<any>, origin: HTMLElement) {
    this.view = this.vcr.createEmbeddedView(dropdownTpl);
    const dropdown = this.view.rootNodes[0];

    document.body.appendChild(dropdown);
    dropdown.style.width = `${origin.offsetWidth}px`;

/*    this.zone.runOutsideAngular(() => {
      this.popperRef = new Popper(origin, dropdown, {
        removeOnDestroy: true
      });
    });*/
  }

  get label() {
    return this.model ? this.model[this.labelKey] : 'Select...';
  }

  select(option) {
    console.log("select");
    this.model = option;
    this.selectChange.emit(option);
  }

  isActive(option) {
    if (!this.model) {
      return false;
    }

    return option[this.idKey] === this.model[this.idKey];
  }

  showAllItems(){
    for(let index in this.listItems){
      this.listItems[index].hide = false;
    }
    this.itemsToRender = this.listItems.sort(function(a, b){return a.value - b.value}).filter(this.notHidden).slice(0,50);;
  }

  hiddenItems(): boolean{
    for(let item of this.listItems) {
      if (item.hide) return true;
    }
    return false;
  }

  underTheLimit(): boolean{
    let checkedItems: number = 0;
    for(let item of this.listItems){
      if(item.checked) checkedItems++;
    }
    return checkedItems < 1000 || checkedItems == this.listItems.length;
  }

  getMax(){
    let values: Array<number> = new Array<number>();
    for (let item of this.listItems){
      values.push(item.value);
    }
    return Math.max.apply(null, values);
  }

  getMin(){
    let values: Array<number> = new Array<number>();
    for (let item of this.listItems){
      values.push(item.value);
    }
    return Math.min.apply(null, values);
  }

  getCurrentMin(slider){
    let currentMin = slider.value['lower'];
    if(currentMin == null){
      return this.getMin();
    }else{
      return currentMin;
    }
  }

  getCurrentMax(slider){
    let currentMax = slider.value['upper'];
    if(currentMax == null){
      return this.getMax();
    }else{
      return currentMax;
    }
  }

  private notHidden(item){
    return !item.hide;
  }

  updateSelection(event){
    let currentMinValue = event.target.value['lower'];
    let currentMaxValue = event.target.value['upper'];
    this.itemsToRender = [];
    for (let item in this.listItems) {
      if (this.listItems[item].value >= currentMinValue && this.listItems[item].value <= currentMaxValue){
        this.itemsToRender.push(this.listItems[item]);
        this.listItems[item].checked = true;
        this.listItems[item].hide = false;
      }else{
        this.listItems[item].checked = false;
        this.listItems[item].hide = true;
      }
    }
    this.itemsToRender = this.itemsToRender.sort(function(a, b){return a.value - b.value}).filter(this.notHidden).slice(0,50);
  }

  ngOnInit() {

    this.filterType = this.selectScrollbarProvider.filterType;
    this.title = this.selectScrollbarProvider.title;
    this.listItems = this.selectScrollbarProvider.listItems;
    this.allDefectType = this.selectScrollbarProvider.allDefectType;
    this.listItemsFinal = this.selectScrollbarProvider.listItems;
    this.itemsToRender = this.listItems.sort(function(a, b){return a.value - b.value}).filter(this.notHidden).slice(0,50);
    this.originalOptions = [...this.allDefectType];
    if (this.model !== undefined) {
      this.model = this.allDefectType.find(
        currentOption => currentOption[this.idKey] === this.model
      );
    }
  }

  checkSelected(event, item) {
    this.listItems[this.listItems.indexOf(item)].checked = event.detail.checked;

    let filtersSelected: number = 0;
    for (let iFilter in this.listItems) {
      if (this.listItems[iFilter].checked) {
        filtersSelected++;
      }
    }
    this.allSelected = filtersSelected == this.listItems.length;
  }
}
