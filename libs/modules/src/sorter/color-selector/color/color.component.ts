import {Component, Input, OnInit} from '@angular/core';
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";
import {TemplateColorsModel} from "../../../../../services/src/models/endpoints/TemplateColors";
import {AuthenticationService} from "@suite/services";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sorter-color-item',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorItemSorterComponent implements OnInit {

  @Input() color: TemplateColorsModel.AvailableColorsByProcess = null;

  public userId: number = null;

  constructor(
    private authenticationService: AuthenticationService,
    public sorterProvider: SorterProvider
  ) { }
  
  async ngOnInit() {
    this.userId = await this.authenticationService.getCurrentUserId();
  }

  getColorClass() : string {
    if (this.sorterProvider.colorSelected) {
      if (this.sorterProvider.colorSelected.id === this.color.id) {
        return 'selected';
      } else {
        return 'no-selected';
      }
    } else {
      return '';
    }
  }
}
