import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SorterProvider} from "../../../../services/src/providers/sorter/sorter.provider";
import {TemplateColorsModel} from "../../../../services/src/models/endpoints/TemplateColors";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sorter-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss']
})
export class ColorSelectorSorterComponent implements OnInit {

  @Input() colors: TemplateColorsModel.AvailableColorsByProcess[] = [];
  @Input() title: string = null;
  @Output() colorSelected = new EventEmitter();

  constructor(
    private sorterProvider: SorterProvider
  ) {
    this.sorterProvider.colorSelected = null;
  }
  
  ngOnInit() {

  }

  selectColor(colorSelected: TemplateColorsModel.AvailableColorsByProcess) {
    this.colorSelected.next({ color: colorSelected, userId: colorSelected.userId });
  }
}
