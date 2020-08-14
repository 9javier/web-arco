import { Component, OnInit, Input, Output, EventEmitter, ViewChild, NgZone } from '@angular/core';
import { app, environment } from '../../../../services/src/environments/environment';
import { AuthenticationService, Oauth2Service, TariffService, WarehouseModel } from '@suite/services';
import { Router } from '@angular/router';



import { MenuController, PopoverController } from "@ionic/angular";

import { ToolbarProvider } from "../../../../services/src/providers/toolbar/toolbar.provider";
import { LoginComponent } from '../../login/login.page';

import { AlertPopoverComponent } from "../alert-popover/alert-popover.component";
import { WarehouseReceptionAlertService } from "../../../../services/src/lib/endpoint/warehouse-reception-alert/warehouse-reception-alert.service";
import Warehouse = WarehouseModel.Warehouse;
import { LocalStorageProvider } from "../../../../services/src/providers/local-storage/local-storage.provider";
import { PickingStoreService } from "../../../../services/src/lib/endpoint/picking-store/picking-store.service";

type MenuItemList = (MenuSectionGroupItem | MenuSectionItem)[];

interface MenuSectionGroupItem {
  title: string,
  open: boolean,
  type: 'wrapper',
  children: (MenuSectionGroupItem | MenuSectionItem)[],
  thirdLevel?: boolean
  tooltip?: string,
  amount?: number,
  id?: string
}

interface MenuSectionItem {
  title: string,
  id?: string,
  url: string,
  icon: string,
  notification?: boolean
  children?: (MenuSectionGroupItem | MenuSectionItem)[];
  header?: boolean
  tooltip?: string,
  amount?: number
}

@Component({
  selector: 'suite-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  project_selector: any;
  @Input() set alloweds(allowed) {
    this.filterPages(allowed || { logout: true });
  }

  isNewTariff: boolean;
  versionUpdate: any;

  private app = app;

  iconsDirection = 'start';
  displaySmallSidebar = false;
  currentRoute: string = "";

  pickingTasksStoresAmount: number = 0;
  reservedExpiredAmount: number = 0;

  
  onboarding: MenuItemList = [
    /*{
      title: 'Cuenta',
      open: true,
      type: 'wrapper',
      icon: 'people',
      children:[
        {
          title: 'Cuenta',
          id: 'arco-customer',
          url: '/arco-customer/:token',
          icon: 'people',
          tooltip: 'Cuenta'
        },
      ]
     },*/
  ];
  private menuPages = {
    sga: this.onboarding,
    onBoarding: this.onboarding,
  }

  menuPagesFiltered: MenuItemList = [];
  @Output() menuTitle = new EventEmitter();

  constructor(
    private loginService: Oauth2Service,
    private router: Router,
    private authenticationService: AuthenticationService,
    private menuController: MenuController,
    private toolbarProvider: ToolbarProvider,
    private tariffService: TariffService,
    private popoverController: PopoverController,
    private warehouseReceptionAlertService: WarehouseReceptionAlertService,
    private localStorageProvider: LocalStorageProvider,
    private zona: NgZone,
    private pickingStoreService: PickingStoreService
  ) {
    this.loginService.availableVersion.subscribe(res => {
      this.versionUpdate = res;
    })
  }

  initMenu(){
    this.onboarding.push({
          title: 'Cuenta',
          id: 'arco-customer',
          url: '/arco-customer/:token',
          icon: 'people',
          tooltip: 'Cuenta'
      
      
     },);

  }

  returnTitle(item: MenuSectionItem) {
    this.currentRoute = item.title
    this.toolbarProvider.currentPage.next(item.title);
    this.toolbarProvider.optionsActions.next([]);
    this.menuTitle.emit(item.title);
  }

  setTitle(title) {
    this.toolbarProvider.currentPage.next(title);
  }

  loadUpdate() {
    window.open(environment.urlDownloadApp, '_blank')
  }

  /**
   * Select the links that be shown depends of dictionary paramethers
   */
  filterPages(dictionary) {
    dictionary = JSON.parse(JSON.stringify(dictionary));
    if(app.name == 'al') {
      this.newTariffs();
      this.getPickingTasksStoresAmount();
      this.getReservesExpiredAmount();
      this.zona.run(() => {
        setInterval(() => {
          this.newTariffs();
          this.getPickingTasksStoresAmount();
          this.getReservesExpiredAmount();
        }, 5 * 60 * 1000);
      });
    }


    //this.initMenu();

    



    let logoutItem = ({
      title: 'Cuenta',
      id: 'logout',
      url: 'logout',
      icon: 'people'
    });


    if (!this.onboarding.find(item => (<any>item).id == "logout"))
      this.onboarding.push(logoutItem);
    else
      this.onboarding.forEach((item, i) => {
        if ((<any>item).id == "logout")
          this.onboarding[i] = logoutItem;
      });
    this.project_selector = app.name;
    if (!app || !app.name) {
      return false;
    }
    /**obtain the routes for the current application */
    let auxPages = this.menuPages[this.app.name];
    this.menuPagesFiltered = [];
    if (!auxPages) {
      return false;
    }
    /**iterate over all pages of the application */
    auxPages.forEach((page: any) => {
      /**to save the childrens of the actual page */
      let auxChildren = [];
      /**if the page is a wrapper then iterate over his childrens to get the alloweds */
      if (page.type == "wrapper") {
        page.children.forEach(children => {
          /**if the childen is allowed then add if */
          if (dictionary[children.id]) {
            auxChildren.push(children);
          }
        });
        /**if the page is a wrapper and have childrens then add it */
        let auxPage = JSON.parse(JSON.stringify(page));
        auxPage.children = auxChildren;
        /** */
        if (auxChildren.length) {
          this.menuPagesFiltered.push(auxPage);
        }
        /**if not is a wrapper then is a normal category the check if plus easy */
      } else {
        if (dictionary[page.id]) {
          this.menuPagesFiltered.push(page);
        }
      }
    });

    //this.currentRoute = this.menuPagesFiltered[0].children[0].title;
  }

  tapOption(p) {
    console.log("*****TAP OPTION",p);
    this.currentRoute = p.title;
    this.toolbarProvider.currentPage.next(p.title);
    this.toolbarProvider.optionsActions.next([]);
    this.menuTitle.emit(p.title);
    if(p.id == 'logout'){
      this.router.navigateByUrl(p.url);
    
    }

    /*if(p.id === 'logout'){
      this.router.navigateByUrl(p.url)
    }
    if (p.url === 'logout') {
      this.authenticationService.getCurrentToken().then(accessToken => {
        this.loginService
          .get_logout(accessToken)
          .subscribe((data) => {
            this.authenticationService.logout().then(success => {
              this.router.navigateByUrl('/login')
            });
          });
      });
    } else if (p.url === 'positioning') {
      
    } else if (p.url === 'reception') {
      
    } else if (p.url == 'reception/empty-carrier') {
      this.checkAlertsAndRedirect();
    } else if (p.url === 'audits/scan') {
      
    }*/
  }

  async checkAlertsAndRedirect() {
    const currentWarehouse: Warehouse = await this.authenticationService.getStoreCurrentUser();
    if (currentWarehouse) {
      this.warehouseReceptionAlertService.check({ warehouseId: currentWarehouse.id }).then(async response => {
        if (response.code == 200 && typeof response.data == 'boolean') {
          if (response.data) {
            await this.localStorageProvider.set('hideAlerts', false);
            const popover = await this.popoverController.create({
              component: AlertPopoverComponent
            });
            popover.onDidDismiss().then(async response => {
              if (typeof response.data == 'boolean' && response.data) {
                await this.localStorageProvider.set('hideAlerts', true);
              }
            });
            await popover.present();
          } else {

          }
        } else {
          console.error(response);
        }
      }, error => {
        console.error(error);
      });
    } else {
      console.error('Current warehouse not found.');
    }
  }

  tapOptionSubitem(p) {
    this.menuController.close();
    if (p.url === 'print/tag/ref') {

    } else if (p.url === 'print/tag/price') {
      
    } else if (p.url === 'packing/seal') {
      
    } else if (p.url === 'reception') {
      
    } else if (p.url == 'reception/empty-carrier') {
      this.checkAlertsAndRedirect();
    } else if (p.url == 'print/product/relabel') {
      
    } else if (p.url == 'products/info') {
      
    } else if (p.url === 'positioning') {
      
    } else if (p.url === 'defective-positioning'){
      
    } else if (p.url === 'audits/scan') {
      
    } else {
      this.returnTitle(p);
    }
    if (p.id === 'workwaves-scheduled-1') {
      this.router.navigate([p.url], { queryParams: { type: 1 } })
    }
  }

  tapOptionSubSubitem(menuItem) {
    this.menuController.close();
    this.menuTitle.emit(menuItem.title);

  }

  openSubMenuItem(menuItem) {
    console.log("******MENU ITEM**********",menuItem);
    menuItem.open = !menuItem.open;
  }

  toggleSidebar() {
    this.displaySmallSidebar = !this.displaySmallSidebar;
    this.displaySmallSidebar === true
      ? (this.iconsDirection = 'end')
      : (this.iconsDirection = 'start');

    for (let page of <MenuSectionGroupItem[]>(this.menuPagesFiltered)) {
      if (page.children && page.children.length > 0) {
        page.open = false;
      }
    }
  }

  ngOnInit() {
  }

  /**
   * Listen changes in form to resend the request for search
   */
  async newTariffs() {
    const currentWarehouse: Warehouse = await this.authenticationService.getStoreCurrentUser();
    if(currentWarehouse){
      this.tariffService
        .getNewTariff()
        .then(tariff => {
          if (tariff.code == 200) {
            let newTariff = tariff.data;
            /**save the data and format the dates */
            
          } else {
            console.error('Error to try check if exists new tariffs', tariff);
          }
        }, (error) => {
          console.error('Error to try check if exists new tariffs', error);
        })
    }
  }

  checkIfChildrenHasNewTariffs(element): boolean {
    return !!element.children.find(c => c.notification)
  }

  async getPickingTasksStoresAmount(){
    const currentWarehouse: Warehouse = await this.authenticationService.getStoreCurrentUser();
    if(currentWarehouse){
      this.pickingStoreService.getLineRequestsStoreOnlineAmount().then(response => {
        if(response.code == 200){
          
        }else{
          console.error(response);
        }
      },console.error).catch(console.error);
    }
  }

  async getReservesExpiredAmount(){
    const currentWarehouse: Warehouse = await this.authenticationService.getStoreCurrentUser();
    if(currentWarehouse){
      this.pickingStoreService.getReservesExpiredAmount().then(response => {
        if(response.code == 200){
         
        }else{
          console.error(response);
        }
      },console.error).catch(console.error);
    }
  }

  checkIfChildrenNotification(element): boolean {
    return !!element.children.find(c => c.notification || (c.amount && c.amount > 0));
  }

}
