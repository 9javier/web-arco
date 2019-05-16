import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ResponseLogout, Oauth2Service } from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { AuthenticationService } from '@suite/services';
import {ScannerConfigurationService} from "../../../../libs/services/src/lib/scanner-configuration/scanner-configuration.service";
import {WarehouseService} from "../../../../libs/services/src/lib/endpoint/warehouse/warehouse.service";
import {ScanditService} from "../../../../libs/services/src/lib/scandit/scandit.service";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";

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
      title: 'Gestión Almacén',
      url: '/warehouse/manage',
      icon: 'apps'
    },
    {
      title: 'Ubicar/Escanear',
      icon: 'qr-scanner',
      url: 'positioning'
    },
    {
      title: 'Logout',
      url: '/home',
      icon: 'log-out'
    }
  ];

  displaySmallSidebar = false;
  showMainHeader = false;
  deploySidebarSmallDevices = false;
  iconsDirection = 'start';
  currentRoute: string = this.appPages[0].title;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menu: MenuController,
    private loginService: Oauth2Service,
    private authenticationService: AuthenticationService,
    private warehouseService: WarehouseService,
    private scannerConfigurationService: ScannerConfigurationService,
    private scanditService: ScanditService
  ) {
    this.initializeApp();
    this.menu.enable(false, 'sidebar');
  }

  initializeApp() {
    this.showMainHeader = false;
    this.displaySmallSidebar = false;
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Initialization of Scandit settings that app will display
      this.scannerConfigurationService.init();

      // Load in arrays and objects all the warehouses data (warehouses with racks with rows and columns)
      this.warehouseService.loadWarehousesData();

      window.innerWidth < 992
        ? (this.deploySidebarSmallDevices = true)
        : (this.deploySidebarSmallDevices = false);

      /* Check for Authenticated user */
      this.authenticationService.authenticationState.subscribe(state => {
        if (state) {
          this.warehouseService
            .init()
            .then((data: Observable<HttpResponse<any>>) => {
              data.subscribe((res: HttpResponse<any>) => {
                // Load of main warehouse in memory
                this.warehouseService.idWarehouseMain = res.body.data.id;
                this.router.navigate(['warehouse/manage']).then(success => {
                  this.showMainHeader = true;
                  this.menu.enable(true, 'sidebar');
                  if (this.platform.is('android')) {
                    this.scanditService.setApiKey(environment.scandit_api_key);
                  }
                });
              });
            });
        } else {
          this.router.navigate(['login']);
          this.showMainHeader = false;
          this.menu.enable(false, 'sidebar');
        }
      });
    });
  }

  ngOnInit() {}

  tapOption(p: MenuItem) {
    this.currentRoute = p.title;
    if (p.title === 'Logout') {
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
