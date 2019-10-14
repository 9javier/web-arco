import {Component, OnInit} from '@angular/core';
import {SorterProvider} from "../../../../services/src/providers/sorter/sorter.provider";
import {Router} from "@angular/router";
import {IntermediaryService} from "@suite/services";
import {TemplateColorsModel} from "../../../../services/src/models/endpoints/TemplateColors";

@Component({
  selector: 'sorter-output-al',
  templateUrl: './al-output.component.html',
  styleUrls: ['./al-output.component.scss']
})
export class AlOutputSorterComponent implements OnInit {

  public colorsSelectors: TemplateColorsModel.AvailableColorsByProcess[] = [];

  constructor(
    private router: Router,
    private intermediaryService: IntermediaryService,
    public sorterProvider: SorterProvider
  ) { }
  
  ngOnInit() {
    this.loadDefaultData();
  }

  loadDefaultData() {
    this.colorsSelectors = [
      {
        id: 1,
        name: "Yellow",
        hex: '#FFE600',
        available: '1'
      },
      {
        id: 2,
        name: "Green",
        hex: '#0C9D58',
        available: '1'
      },
      {
        id: 3,
        name: "Red",
        hex: '#DB4437',
        available: '1'
      },
      {
        id: 4,
        name: "Blue",
        hex: '#1B91FF',
        available: '1'
      }
    ];
  }

  colorSelected(data) {
    this.sorterProvider.colorSelected = data;
  }

  sorterOperationCancelled() {
    this.sorterProvider.colorSelected = null;
  }

  async sorterOperationStarted() {
    if (!this.sorterProvider.colorSelected) {
      await this.intermediaryService.presentToastError('Selecciona un color para comenzar.');
      return;
    }

    this.router.navigate(['sorter/output/scanner']);
  }
}
