import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from "@angular/router";
import { ToolbarProvider } from "../../../../services/src/providers/toolbar/toolbar.provider";
import { ActionToolbarModel } from "../../../../services/src/models/endpoints/ActionToolbar";
import { PopoverController, Platform } from "@ionic/angular";
import { PopoverMenuToolbarComponent } from "../popover-menu-toolbar/popover-menu-toolbar.component";
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
  state: boolean;
  showKeyboard: boolean
  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private toolbarProvider: ToolbarProvider,
    private keyboard: KeyboardService,
    private plt: Platform
  ) { }

  ngOnInit() {

    this.color = 'danger'
    if (this.plt.is('android')) {
      //this.keyboard.disabled()
      this.state = this.state = false
    }

    this.isAndroid = this.plt.is('android');

    this.toolbarProvider.currentPage.subscribe((page) => {
      this.currentPage = page;
      // muesta el boton del teclado en los titulos que tengan la ocurrencia "manual" en su cadena
      if (this.currentPage.includes('manual') || this.currentPage.includes('Manual') || this.currentPage.includes('Verificación de artículos') || this.currentPage.includes('Entrada') || this.currentPage.includes('Lista de auditorias') || this.currentPage.includes('Salida') || this.currentPage.includes('Auditorías')) {
        if(this.currentPage.includes('Código exposición manual') || this.currentPage.includes('Reetiquetado productos manual')){
          this.showKeyboard = false;
        } else {
          this.showKeyboard = true;
        }
      }
      else {
        this.showKeyboard = false
      }
    });
    this.toolbarProvider.showAlMenu.subscribe((show) => {
      this.showAlMenu = show;
    });
    this.toolbarProvider.optionsActions.subscribe((options) => {
      this.optionsActions = options;
      this.toolbarProvider.currentOptionsActions = options;
    });
  }

  hideByUrl(): boolean {
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
    this.state = state
    if (state === true) {
      this.keyboard.disabled();
      this.state = false;
      this.color = 'danger';
    } else {
      this.keyboard.eneabled();
      this.state = true;
      this.color = 'success'
    }
  }
}
