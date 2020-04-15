import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'suite-filters-role-assignment',
  templateUrl: './filters-role-assignment.component.html',
  styleUrls: ['./filters-role-assignment.component.scss'],
})
export class FiltersRoleAssignmentComponent implements OnInit {
  filterType = '';
  title;
  listItems: any[] = [];
  listItemsFinal: any[] = [];
  itemsToRender: any[] = [];
  allSelected: boolean;
  typedFilter = '';

  constructor(
    private popoverCtrl: PopoverController,
  ) { }

  ngOnInit() {
    this.filterType = 'search';
      this.checkAllSelected();
    this.listItemsFinal = this.listItems;
    this.itemsToRender = this.listItems.sort((a, b) => {
      return a.value - b.value
    }).filter(this.notHidden).slice(0, 50);
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

  underTheLimit() {
    let checkedItems = 0;
    this.listItems.forEach((item) => {
      if (item.checked) {
        checkedItems++;
      }
    });

    return checkedItems < 100 || checkedItems === this.listItems.length;
  }

  notHidden(item){
    return !item.hide;
  }

  searchInFilterList(textSearched: string) {
    this.itemsToRender = [];
    if (textSearched && textSearched !== '') {
      let searchedStrings: string[] = textSearched.split(',');
      for(let i = 0; i < this.listItems.length; i++){
        let isBeingSearched = false;
        for(let iString of searchedStrings){
          if(iString !== '' && this.listItems[i].value.toString().toUpperCase().includes(iString.toUpperCase())){
            isBeingSearched = true;
            break;
          }
        }
        if (isBeingSearched) {
          this.itemsToRender.push(this.listItems[i]);
          this.listItems[i].checked = true;
          this.listItems[i].hide = false;
        } else{
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
    let filtersSelected = 0;
    for (let iFilter in this.listItems) {
      if (this.listItems[iFilter].checked) {
        filtersSelected++;
      }
    }

    this.allSelected = filtersSelected === this.listItems.length;
  }

  checkSelected(event, item) {
    this.listItems[this.listItems.indexOf(item)].checked = event.detail.checked;

    let filtersSelected = 0;
    for (let iFilter in this.listItems) {
      if (this.listItems[iFilter].checked) {
        filtersSelected++;
      }
    }
    this.allSelected = filtersSelected === this.listItems.length;
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

  async applyFilters() {
    if (this.listItemsFinal && this.listItemsFinal.length > 0) {
      await this.popoverCtrl.dismiss({ filters: this.listItemsFinal });
    } else {
      await this.popoverCtrl.dismiss();
    }
  }
}
