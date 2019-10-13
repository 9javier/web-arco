import {Component, OnInit} from '@angular/core';
import {ToolbarProvider} from "../../../../services/src/providers/toolbar/toolbar.provider";
import {ActionToolbarModel} from "../../../../services/src/models/endpoints/ActionToolbar";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'popover-menu-toolbar',
  templateUrl: './popover-menu-toolbar.component.html',
  styleUrls: ['./popover-menu-toolbar.component.scss']
})
export class PopoverMenuToolbarComponent implements OnInit {

  public optionsMenu: ActionToolbarModel.ActionToolbar[] = [];

  constructor(
    private popoverController: PopoverController,
    private toolbarProvider: ToolbarProvider
  ) { }

  ngOnInit() {
    this.optionsMenu = this.toolbarProvider.currentOptionsActions.filter((option, index) => {
      return index >= 2;
    });
  }

  actionOption(option: ActionToolbarModel.ActionToolbar) {
    this.popoverController.dismiss();
    option.action();
  }
}
