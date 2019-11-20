import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {ToolbarProvider} from "../../../../services/src/providers/toolbar/toolbar.provider";
import {ActionToolbarModel} from "../../../../services/src/models/endpoints/ActionToolbar";
import {PopoverController, Platform} from "@ionic/angular";
import {PopoverMenuToolbarComponent} from "../popover-menu-toolbar/popover-menu-toolbar.component";
import { KeyboardService } from '../../../../services/src/lib/keyboard/keyboard.service';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar-al.component.html',
  styleUrls: ['./toolbar-al.component.scss']
})
export class ToolbarAlComponent implements OnInit {

  @Input() showAlMenu: boolean = false;
  @Output() windowResize = new EventEmitter();
  @Output() toggleSideMenuSga = new EventEmitter();
  @Output() toggleSideMenuAl = new EventEmitter();
  
  public currentPage: string = 'Registro horario';
  public optionsActions: ActionToolbarModel.ActionToolbar[] = [];
  color: string
  isAndroid: boolean;
  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private toolbarProvider: ToolbarProvider,
    private keyboard: KeyboardService,
    private plt: Platform
  ) { }

  ngOnInit() {
    this.color = 'danger'
    this.keyboard.disabled()

    this.isAndroid = this.plt.is('android');

    this.toolbarProvider.currentPage.subscribe((page) => {
      this.currentPage = page;
    });
    this.toolbarProvider.showAlMenu.subscribe((show) => {
      this.showAlMenu = show;
    });
    this.toolbarProvider.optionsActions.subscribe((options) => {
      this.optionsActions = options;
      this.toolbarProvider.currentOptionsActions = options;
    });
  }

  hideByUrl() : boolean {
    return this.router.url == '/login';
  }

  onResize($event) {
    this.windowResize.next($event);
  }

  toggleSideMenu(smallScreen: boolean) {
    if (smallScreen) {
      this.toggleSideMenuAl.next();
    } else {
      this.toggleSideMenuSga.next();
    }
  }

  actionFromToolbar(optionAction: ActionToolbarModel.ActionToolbar) {
    optionAction.action();
  }

  async actionMoreFromToolbar(ev) {
    const popover = await this.popoverController.create({
      component: PopoverMenuToolbarComponent,
      event: ev
    });

    await popover.present();
  }


  onActiveKeyboard() {
    const state = this.keyboard.isEneabled();
    console.log(state)
    if (state === true) {
      this.keyboard.disabled()
      this.color = 'danger'
    } else {
      this.keyboard.eneabled()
      this.color = 'success'
    }
  }
}
