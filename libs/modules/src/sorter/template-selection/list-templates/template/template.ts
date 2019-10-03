import {Component, Input, OnInit} from '@angular/core';
import {TemplateSorterModel} from "../../../../../../services/src/models/endpoints/TemplateSorter";
import {SorterProvider} from "../../../../../../services/src/providers/sorter/sorter.provider";

@Component({
    selector: 'suite-sorter-new-template-selection',
  templateUrl: './template.html',
  styleUrls: ['./template.scss']
})
export class SorterTemplateSelectionComponent implements OnInit {

  @Input() template: TemplateSorterModel.Template = null;

  constructor(
    public sorterProvider: SorterProvider
  ) { }

  ngOnInit() {

  }

}
