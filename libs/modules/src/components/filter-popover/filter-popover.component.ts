import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FilterPopoverProvider} from "../../../../services/src/providers/filter-popover/filter-popover.provider";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'suite-filter-popover',
  templateUrl: './filter-popover.component.html',
  styleUrls: ['./filter-popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterPopoverComponent implements OnInit {

  public filterType: string = '';
  public title: string = '';
  public listItems: Array<any> = new Array<any>();
  private listItemsFinal: Array<any> = new Array<any>();
  public typedFilter: string = "";
  public allSelected: boolean = true;

  constructor(
    private popoverCtrl: PopoverController,
    private filterPopoverProvider: FilterPopoverProvider
  ) { }

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
      console.log(currentMax);
      return currentMax;
    }
  }

  updateSelection(event){
    let currentMinValue = event.target.value['lower'];
    let currentMaxValue = event.target.value['upper'];
    for (let item in this.listItems) {
      if (this.listItems[item].value >= currentMinValue && this.listItems[item].value <= currentMaxValue) {
        this.listItems[item].checked = true;
      }else{
        this.listItems[item].checked = false;
      }
    }
  }

  getOrderedList(){
    return this.listItems.sort(function(a, b){return a.value - b.value});
  }

  ngOnInit() {
    this.filterType = this.filterPopoverProvider.filterType;
    this.title = this.filterPopoverProvider.title;
    this.listItems = this.filterPopoverProvider.listItems;
    this.checkAllSelected();
    this.listItemsFinal = this.filterPopoverProvider.listItems;
  }

  searchInFilterList(event: any) {
    let textSearched = event;
    if (textSearched && textSearched != '') {
      let arrayToFilter = this.listItemsFinal;
      this.listItems = arrayToFilter.filter((item) => {
        if (typeof item.value == 'string') {
          if (item.value.toLowerCase().indexOf(textSearched.toLowerCase()) != -1) {
            item.checked = true;
            item.hide = false;
          } else {
            item.checked = false;
            item.hide = true;
          }
        } else {
          if (item.value.toString().toLowerCase().indexOf(textSearched.toLowerCase()) != -1) {
            item.checked = true;
            item.hide = false;
          } else {
            item.checked = false;
            item.hide = true;
          }
        }
        return true;
      });
    } else {
      this.listItems = this.listItems.filter((item) => {
        item.checked = true;
        item.hide = false;
        return true;
      });
      this.checkAllSelected();
    }
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

  selectAll() {
    for (let iFilter in this.listItems) {
      this.listItems[iFilter].checked = this.allSelected;
    }
  }

  resetFilters() {
    for (let iFilter in this.listItems) {
      this.listItems[iFilter].checked = true;
    }
    this.checkAllSelected();
  }

  applyFilters() {
    if (this.listItemsFinal && this.listItemsFinal.length > 0) {
      this.popoverCtrl.dismiss({ filters: this.listItemsFinal });
    } else {
      this.popoverCtrl.dismiss();
    }
  }

}
