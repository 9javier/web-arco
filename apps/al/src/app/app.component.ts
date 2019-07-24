import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {ResponseLogout, Oauth2Service, TypeModel, TypesService} from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { AuthenticationService } from '@suite/services';
import {ScannerConfigurationService} from "../../../../libs/services/src/lib/scanner-configuration/scanner-configuration.service";
import {WarehouseService} from "../../../../libs/services/src/lib/endpoint/warehouse/warehouse.service";
import {ScanditService} from "../../../../libs/services/src/lib/scandit/scandit.service";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {app} from "@suite/services";
import {DateAdapter} from "@angular/material";

interface MenuItem {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'suite-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public appPages: MenuItem[] = [
    {
      title: 'Productos',
      url: '/products',
      icon: 'basket'
    },
    {
      title: 'Gestión de almacén',
      url: '/warehouse/manage',
      icon: 'apps'
    },
    {
      title: 'Ubicar/Escanear',
      icon: 'qr-scanner',
      url: 'positioning'
    },
    {
      title: 'Ubicar/Escanear Manualmente',
      icon: 'qr-scanner',
      url: '/positioning/manual'
    },
    {
      title: 'Tareas de Picking',
      icon: 'qr-scanner',
      url: '/picking-tasks'
    },
    {
      title: 'Tareas de Picking Manualmente',
      icon: 'qr-scanner',
      url: '/picking-tasks/manual'
    },
    {
      title: 'Jaulas',
      url: '/jails/menu',
      icon: 'grid'
    },
    {
      title: 'Palets',
      url: '/pallets/menu',
      icon: 'cube'
    },
    {
      title: 'Almacenes',
      url: '/warehouses',
      icon: 'filing'
    },
    {
      title: 'Ajustes',
      url: '/settings',
      icon: 'cog'
    },
    {
      title: 'Cerrar sesión',
      url: 'logout',
      icon: 'log-out'
    },
  ];

  dictionary = {

  }


  displaySmallSidebar = false;
  showMainHeader = false;
  deploySidebarSmallDevices = false;
  iconsDirection = 'start';
  currentRoute: string = this.appPages[0].title;

  constructor(
    private platform: Platform,
    private dateAdapter: DateAdapter<any>,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menu: MenuController,
    private loginService: Oauth2Service,
    private authenticationService: AuthenticationService,
    private warehouseService: WarehouseService,
    private scannerConfigurationService: ScannerConfigurationService,
    private scanditService: ScanditService,
    private typesService: TypesService
  ) {
    this.initializeApp();
    this.menu.enable(false, 'sidebar');
    this.dateAdapter.setLocale('es');
  }

  changeMenutTitle(title:string){
    this.currentRoute = title;
  }

  initializeApp() {
    this.mainHeaderShowHide(false);
    this.displaySmallSidebar = false;
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.statusBar.styleLightContent();
      } else {
        this.statusBar.styleDefault();
      }
      this.splashScreen.hide();

      // Initialization of Scandit settings that app will display
      this.scannerConfigurationService.init();

      // Load in arrays and objects all the warehouses data (warehouses with racks with rows and columns)
      this.warehouseService.loadWarehousesData();

      // Load all types from backend
      let typesToLoad: TypeModel.TypeLoad = {
        packing: true
      };
      this.typesService.init(typesToLoad);

      window.innerWidth < 992
        ? (this.deploySidebarSmallDevices = true)
        : (this.deploySidebarSmallDevices = false);

      /* Check for Authenticated user */
      this.authenticationService.authenticationState.subscribe(state => {
        if (state) {
          // Load in arrays and objects all the warehouses data (warehouses with racks with rows and columns)
          this.warehouseService.loadWarehousesData();

          this.warehouseService
            .init()
            .then((data: Observable<HttpResponse<any>>) =>
              new Promise((resolve, reject) => {
                data.subscribe((res: HttpResponse<any>) => {
                  // Load of main warehouse in memory
                  this.warehouseService.idWarehouseMain = res.body.data.id;
                  resolve();
                }, reject);
              })
            )
            .catch((possibleMainWarehouse404Error) => {})
            .then(() => this.router.navigate(['products'])
              .then(success => {
                this.mainHeaderShowHide(true);
                this.menu.enable(true, 'sidebar');
                if (this.platform.is('android')) {
                  this.scanditService.setApiKey(environment.scandit_api_key);
                }
              })
          );
        } else {
          this.router.navigate(['login']);
          this.mainHeaderShowHide(false);
          this.menu.enable(false, 'sidebar');
        }
      });
    });
  }

  ngOnInit() {
    app.name = "al";
    /**Set the dictionary access to menu */
    this.authenticationService.dictionaryAcessState.subscribe(state=>{
      console.log("dictionaryManagement", "ngOnInit: dictionaryAcessState.subscribe", JSON.parse(JSON.stringify(state)));
      this.dictionary = state;
    });
  }

  tapOption(p: MenuItem) {
    this.currentRoute = p.title;
    if (p.url === 'logout') {
      this.authenticationService.getCurrentToken().then(accessToken => {
        this.loginService
          .get_logout(accessToken)
          .subscribe((data: HttpResponse<ResponseLogout>) => {
            this.authenticationService.logout().then(success => {
              this.router.navigate(['login']);
            });
          });
      });
    } else if(p.url === 'positioning'){
      this.scanditService.positioning();
    }
  }

  mainHeaderShowHide(show: boolean) {
    this.showMainHeader = show;
    if (show) {
      /* The BlueBird device Krack is using has a bug on the DOM renderer which makes the header to show blank. This
       * ugly trick solves it. BTW, the interval and attempt limit is totally random and empyrical. */
      let giveUpCount = 10;
      const redrawHeaderInterval = setInterval(() => {
        document.querySelectorAll("ion-app > ion-header > ion-toolbar, ion-app > ion-header > ion-toolbar *")
          .forEach((el: HTMLElement) => {el.style.zIndex = "auto"})
        giveUpCount--;
        if (giveUpCount <= 0) {
          clearInterval(redrawHeaderInterval);
        }
      }, 500);
    }
  }

  toggleSidebar() {
    this.displaySmallSidebar = !this.displaySmallSidebar;
    this.displaySmallSidebar === true
      ? (this.iconsDirection = 'end')
      : (this.iconsDirection = 'start');
  }

  onResize(event) {
    if (event.target.innerWidth < 992) {
      this.deploySidebarSmallDevices = true;
      this.displaySmallSidebar = true;
      this.iconsDirection = 'start';
    } else {
      this.deploySidebarSmallDevices = false;
      this.displaySmallSidebar = true;
      this.iconsDirection = 'end';
    }
  }

  toggleSidebarSmallDevices() {
    this.menu.toggle('sidebar');
  }
}
