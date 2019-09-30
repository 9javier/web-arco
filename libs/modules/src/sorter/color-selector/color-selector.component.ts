import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ColorSorterModel} from "../../../../services/src/models/endpoints/ColorSorter";
import {SorterProvider} from "../../../../services/src/providers/sorter/sorter.provider";

@Component({
  selector: 'sorter-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorSorterComponent implements OnInit {

  @Input() colors: ColorSorterModel.ColorSorter[] = [];
  @Output() colorSelected = new EventEmitter();

  constructor(
    private sorterProvider: SorterProvider
  ) {
    this.sorterProvider.colorSelected = null;
  }
  
  ngOnInit() {

  }

  selectColor(colorSelected: ColorSorterModel.ColorSorter) {
    this.colorSelected.next(colorSelected);
  }
}
