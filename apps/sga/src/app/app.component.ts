import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {Platform, MenuController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ResponseLogout, Oauth2Service } from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { AuthenticationService } from '@suite/services';
import { WarehouseService } from "../../../../libs/services/src/lib/endpoint/warehouse/warehouse.service";
import { ScannerConfigurationService } from "../../../../libs/services/src/lib/scanner-configuration/scanner-configuration.service";
import {Observable} from "rxjs";
import {TypesService} from "../../../../libs/services/src/lib/endpoint/types/types.service";
import {TypeModel} from "../../../../libs/services/src/models/endpoints/Type";

interface MenuItem {
  title: string;
  url?: string;
  icon: string;
}

@Component({
  selector: 'suite-root',
  templateUrl: 'app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Gestión Almacén',
      url: '/warehouse/manage',
      icon: 'apps'
    },
    {
      title: 'Usuarios',
      url: '/users/menu',
      icon: 'people'
    },
    {
      title: 'Asignar Grupo a Tienda',
      url: '/group-to-warehouse',
      icon: 'people'
    },
    {
      title: 'Roles',
      url: '/roles/menu',
      icon: 'person'
    },
    {
      title: 'Grupos de tiendas',
      url: '/groups/menu',
      icon: 'person'
    },
    {
      title: 'Asignar Rol a Usuario',
      url: '/assign/rol/user',
      icon: 'person'
    },
    {
      title: 'Jaulas',
      url: '/jails/menu',
      icon: 'grid'
    },
    {
      title: 'Almacenes',
      url: '/warehouses',
      icon: 'filing'
    },
    {
      title: 'Palets',
      url: '/pallets/menu',
      icon: 'cube'
    },
    {
      title: 'Productos',
      url: '/products',
      icon: 'basket'
    },
    {
      title: 'Olas de trabajo',
      open: false,
      children: [
        {
          title: 'Programadas',
          icon: 'logo-ionic',
          url: '/workwaves-scheduled'
        },
        {
          title: 'Plantillas',
          icon: 'logo-google',
          url: '/workwaves-templates'
        }
      ]
    },
    {
      title: 'Logout',
      icon: 'log-out'
    }
  ];

  // Presentation layer
  showMainHeader = false;
  showSidebar = false;
  displaySmallSidebar = false;
  iconsDirection = 'start';
  currentRoute: string = this.appPages[0].title;
  deploySidebarSmallDevices = false;

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
    private typesService: TypesService
  ) {
    this.menu.enable(false, 'sidebar');
  }

  initializeApp() {
    this.showMainHeader = false;
    this.displaySmallSidebar = false;
    this.showSidebar = false;
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.menu.enable(false, 'sidebar');

      // Initialization of Scandit settings that app will display
      this.scannerConfigurationService.init();

      // Load in arrays and objects all the warehouses data (warehouses with racks with rows and columns)
      this.warehouseService.loadWarehousesData();
      // Load in array only warehouses with racks
      this.warehouseService.loadWarehousesWithRacks();

      // Load all types from backend
      let typesToLoad: TypeModel.TypeLoad = {
        all: true
      };
      this.typesService.init(typesToLoad);

      // Display button for small device to toggle sidemenu from main-header
      window.innerWidth < 992
        ? (this.deploySidebarSmallDevices = true)
        : (this.deploySidebarSmallDevices = false);

      /* Check for Authenticated user */
      await this.authenticationService.checkToken();
      this.authenticationService.authenticationState.subscribe(state => {
        if (state) {
          // Load of main warehouse in memory
          this.warehouseService
            .init()
            .then((data: Observable<HttpResponse<any>>) => {
              data.subscribe((res: HttpResponse<any>) => {
                // Load of main warehouse in memory
                this.warehouseService.idWarehouseMain = res.body.data.id;
                this.router.navigate(['warehouse/manage']).then(sucess => {
                  this.showMainHeader = true;
                  this.menu.enable(true, 'sidebar');
                });
              });
            });
        } else {
          this.menu.enable(false, 'sidebar');
          this.showMainHeader = false;
          this.router.navigate(['login']);
        }
      });

      /* Update to display current route on Access Denied from Server */
      // this.router.events.subscribe(ev => {
      //   if (ev instanceof NavigationEnd) {
      //     console.log(ev.url);
      //     this.appPages.map((page, i) =>
      //       page.url === ev.url
      //         ? (this.currentRoute = this.appPages[i].title)
      //         : null
      //     );
      //   }
      // });
    });
  }

  ngOnInit() {
    this.initializeApp();
  }

  tapOption(p: MenuItem) {
    console.log(p);
    this.currentRoute = p.title;
    if (p.title === 'Logout') {
      this.authenticationService.getCurrentToken().then(accessToken => {
        this.loginService
          .get_logout(accessToken)
          .subscribe((data: HttpResponse<ResponseLogout>) => {
            this.authenticationService.logout().then(success => {
              this.router.navigate(['login']);
            });
            console.log(data);
          });
      });
    }
  }

  toggleSidebar() {
    this.displaySmallSidebar = !this.displaySmallSidebar;
    this.displaySmallSidebar === true
      ? (this.iconsDirection = 'end')
      : (this.iconsDirection = 'start');

    for (let page of this.appPages) {
      if (page.children && page.children.length > 0) {
        page.open = false;
      }
    }
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

  hideSidebarRight() {
    this.menu.enable(false, 'sidebarRight');
  }

  openSubMenuItem(menuItem) {
    if (this.iconsDirection === 'end') this.toggleSidebar();

    menuItem.open = !menuItem.open;
  }
}
