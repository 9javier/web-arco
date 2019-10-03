import {Component, Input, OnInit} from '@angular/core';
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";
import {TemplateColorsModel} from "../../../../../services/src/models/endpoints/TemplateColors";

@Component({
  selector: 'sorter-color-item',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorItemSorterComponent implements OnInit {

  @Input() color: TemplateColorsModel.AvailableColorsByProcess = null;

  constructor(
    public sorterProvider: SorterProvider
  ) {

  }
  
  ngOnInit() {

  }

  getColorClass() : string {
    if (this.color.available == '0') {
      return 'unavailable';
    } else {
      if (this.sorterProvider.colorSelected) {
        if (this.sorterProvider.colorSelected.id == this.color.id) {
          return 'selected';
        } else {
          return 'no-selected';
        }
      } else {
        return '';
      }
    }
  }
}
