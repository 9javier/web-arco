import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FilterPopoverProvider} from "../../../../services/src/providers/filter-popover/filter-popover.provider";
import {NavParams, PopoverController} from "@ionic/angular";

@Component({
  selector: 'suite-view-popover',
  templateUrl: './view-popover.component.html',
  styleUrls: ['./view-popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewPopoverComponent implements OnInit {

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
    private filterPopoverProvider: FilterPopoverProvider
  ) { }

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
    this.checkAllSelected();
  }

  ngOnInit() {
    this.filterType = this.filterPopoverProvider.filterType;
    this.title = this.filterPopoverProvider.title;
    this.listItems = this.filterPopoverProvider.listItems;
    this.checkAllSelected();
    this.listItemsFinal = this.filterPopoverProvider.listItems;
    this.itemsToRender = this.listItems.sort(function(a, b){return a.value - b.value}).filter(this.notHidden).slice(0,50);
    if (this.navParams.get('products')) {
      setTimeout(() => {
        this.listItems = this.navParams.get('products');
      }, 200);
    }
    if (this.navParams.get('typedValue')) {
      setTimeout(() => {
        this.typedFilter = this.navParams.get('typedValue');
        this.searchInFilterList(this.typedFilter);
      }, 500);
    }
  }

  searchInFilterList(textSearched: string) {
    this.itemsToRender = [];
    if (textSearched && textSearched != '') {
      let searchedStrings: string[] = textSearched.split(',');
      for(let i = 0; i < this.listItems.length; i++){
        let isBeingSearched: boolean = false;
        for(let iString of searchedStrings){
          if(iString != '' && this.listItems[i].value.toString().toUpperCase().includes(iString.toUpperCase())){
            isBeingSearched = true;
            break;
          }
        }
        if(isBeingSearched){
          this.itemsToRender.push(this.listItems[i]);
          this.listItems[i].checked = true;
          this.listItems[i].hide = false;
        }else{
          this.listItems[i].checked = false;
          this.listItems[i].hide = true;
        }
      }
      this.itemsToRender = this.itemsToRender.sort(function(a, b){return a.value - b.value}).filter(this.notHidden).slice(0,50);
    } else {
      for(let index in this.listItems){
        this.listItems[index].checked = true;
        this.listItems[index].hide = false;
      }
      this.itemsToRender = this.listItems.sort(function(a, b){return a.value - b.value}).filter(this.notHidden).slice(0,50);
    }
    this.checkAllSelected();
  }

  checkAllSelected() {
    let filtersSelected: number = 0;
    for (let iFilter in this.listItems) {
      if (this.listItems[iFilter].checked) {
        filtersSelected++;
      }
    }

    this.allSelected = filtersSelected == this.listItems.length;
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

  selectAll() {
    for (let iFilter in this.listItems) {
      this.listItems[iFilter].checked = this.allSelected;
    }
  }

  resetFilters() {
    this.typedFilter = null;
    this.searchInFilterList(this.typedFilter);

    for (let iFilter in this.listItems) {
      this.listItems[iFilter].checked = true;
    }
    this.checkAllSelected();
  }

  applyFilters() {
    if (this.listItemsFinal && this.listItemsFinal.length > 0) {
      this.popoverCtrl.dismiss({ filters: this.listItemsFinal, typedFilter: this.typedFilter });
    } else {
      this.popoverCtrl.dismiss();
    }
  }

}
