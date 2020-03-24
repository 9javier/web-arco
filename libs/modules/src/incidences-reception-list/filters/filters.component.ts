import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TypeModel} from "@suite/services";
import {IncidenceModel} from "../../../../services/src/models/endpoints/Incidence";
import AttendedOption = IncidenceModel.AttendedOption;

@Component({
  selector: 'filters-incidences',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersIncidencesComponent implements OnInit {

  @Input() listIncidencesTypes: TypeModel.Type[];
  @Input() listAttendedOptions: AttendedOption[];
  @Input() attendedSelected: AttendedOption;
  @Input() typeSelected: TypeModel.Type;
  @Input() textToSearch: string;

  @Output() changeFilters = new EventEmitter<IncidenceModel.IncidenceFilters>();

  private actualFilters: IncidenceModel.IncidenceFilters;

  constructor() {}

  ngOnInit() {
    this.actualFilters = {
      attended: this.attendedSelected,
      type: this.typeSelected
    }
  }

  filterByText() {
    if ((this.textToSearch && this.textToSearch.length >= 3) || !this.textToSearch) {
      if (this.textToSearch) {
        this.actualFilters.text = this.textToSearch;
      } else {
        delete this.actualFilters.text;
      }
      this.changeFilters.next(this.actualFilters);
    }
  }

  filterByType() {
    this.actualFilters.type = this.typeSelected;
    this.changeFilters.next(this.actualFilters);
  }

  filterByStatus() {
    this.actualFilters.attended = this.attendedSelected;
    this.changeFilters.next(this.actualFilters);
  }

}
