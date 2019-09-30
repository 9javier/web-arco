import {Component, Input, OnInit} from '@angular/core';
import {MatrixSorterModel} from "../../../../services/src/models/endpoints/MatrixSorter";
import {SorterProvider} from "../../../../services/src/providers/sorter/sorter.provider";

@Component({
  selector: 'sorter-matrix-input',
  templateUrl: './matrix-input.component.html',
  styleUrls: ['./matrix-input.component.scss']
})
export class MatrixInputSorterComponent implements OnInit {

  @Input() sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[] = [];

  constructor(
    private sorterProvider: SorterProvider
  ) {

  }
  
  ngOnInit() {

  }

  getBackgroundForSelected(column: MatrixSorterModel.Column) {
    if (this.sorterProvider.colorSelected && column.way && column.way.templateZone){
      if (column.way.templateZone.zones.color.id == this.sorterProvider.colorSelected.id) {
        return this.sorterProvider.colorSelected.hex + '50';
      }
    }
    return '#ffffff09';
  }
}
