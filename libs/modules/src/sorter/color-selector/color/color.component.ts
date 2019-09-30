import {Component, Input, OnInit} from '@angular/core';
import {ColorSorterModel} from "../../../../../services/src/models/endpoints/ColorSorter";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";

@Component({
  selector: 'sorter-color-item',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorItemSorterComponent implements OnInit {

  @Input() color: ColorSorterModel.ColorSorter = null;

  constructor(
    public sorterProvider: SorterProvider
  ) {

  }
  
  ngOnInit() {

  }
}
