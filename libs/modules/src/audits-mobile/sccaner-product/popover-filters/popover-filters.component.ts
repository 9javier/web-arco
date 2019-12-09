import {Component, OnInit} from '@angular/core';
import {PopoverController} from "@ionic/angular";
import {FiltersAuditProvider} from "../../../../../services/src/providers/filters-audit/filters-audit.provider";

@Component({
  selector: 'popover-filters',
  templateUrl: './popover-filters.component.html',
  styleUrls: ['./popover-filters.component.scss']
})
export class PopoverFiltersComponent implements OnInit {

  chipSelected: any = null;
  sortFields: any[] = [];
  sortFieldSelected: number = null;
  typeSort: string = 'ASC';

  constructor(
    private popoverController: PopoverController,
    private filtersAuditProvider: FiltersAuditProvider
  ) { }

  ngOnInit() {
    this.sortFields =  [{value: 1, viewValue: 'Talla'}, {value: 2, viewValue: 'Modelo'}, {value: 3, viewValue: 'Marca'}];
    this.chipSelected = this.filtersAuditProvider.filter;
    this.typeSort = this.filtersAuditProvider.sort.type;
    this.sortFieldSelected = this.filtersAuditProvider.sort.value;
  }

  applyFilters() {
    this.filtersAuditProvider.filter = this.chipSelected;
    this.filtersAuditProvider.sort = {
      type: this.typeSort,
      value: this.sortFieldSelected
    };
    this.popoverController.dismiss({
      filter: this.chipSelected,
      sort: {
        type: this.typeSort,
        value: this.sortFieldSelected
      }
    });
  }

  changeChip(selected) {
    this.chipSelected = selected;
  }

  changeSortType() {
    if (this.typeSort == 'ASC') {
      this.typeSort = 'DESC';
    } else {
      this.typeSort = 'ASC';
    }
  }

}
