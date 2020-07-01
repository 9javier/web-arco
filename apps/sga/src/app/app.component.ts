import {Component, OnInit, ViewChild} from '@angular/core';
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
import {app} from '@suite/services'
import {DateAdapter} from "@angular/material";
import {MenuComponent} from "@suite/common-modules";

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

  @ViewChild(MenuComponent) menuComponent: MenuComponent;

  public appPages = [
    {
      title: 'Logística',
      open: true,
      children: [
        {
          title: 'Productos',
          url: '/products',
          icon: 'basket'
        },{
          title:'Etiquetas',
          url:'/labels',
          icon:'basket'
        },
        {
          title: 'Gestión de almacén',
          url: '/warehouse/manage',
          icon: 'apps'
        }
      ]
    },
    {
      title: 'Olas de trabajo',
      open: true,
      children: [
        {
          title: 'Listado',
          url: '/workwaves-scheduled',
          icon: 'code'
        },
        {
          title: 'Historial',
          url: '/workwaves-history',
          icon: 'code-download'
        }
      ]
    },
    {
      title: 'Gestión de usuarios',
      open: true,
      children: [
        {
          title: 'Gestión de usuarios',
          url: '/users/menu',
          icon: 'people'
        },
        {
          title: 'Parametrización de operarios',
          url: '/user-manager',
          icon: 'people'
        },
        {
          title: 'Asignación de roles',
          url: '/role-assignment',
          icon: 'key'
        },
        {
          title: 'Roles',
          url: '/roles/menu',
          icon: 'person'
        },
      ]
    },
    {
      title: 'Configuración',
      open: true,
      children: [
        {
          title: 'Almacenes',
          url: '/warehouses',
          icon: 'filing'
        },
        {
          title: 'Grupos de tiendas',
          url: '/groups/menu',
          icon: 'person'
        },
        {
          title: 'Asignar grupos de tiendas',
          url: '/group-to-warehouse',
          icon: 'people'
        },
        {
          title: 'Jaulas',
          url: '/jails/menu',
          icon: 'grid'
        },
        {
          title: 'Estados',
          url: '/state-expedition-avelon/menu',
          icon: 'grid'
        },
        {
          title: 'Palets',
          url: '/pallets/menu',
          icon: 'cube'
        },
      ]
    },
    {
      title:'Sorter',
      id:'sorter-sga',
      url:'/sorter',
      icon:'logo-usd'
    },
    {
      title: 'Cerrar sesión',
      url: 'logout',
      icon: 'log-out'
    }


  ];

  // Presentation layer
  showMainHeader = false;
  showSidebar = true;
  displaySmallSidebar = false;
  iconsDirection = 'start';
  currentRoute: string = "Inicio";
  deploySidebarSmallDevices = false;



  dictionary = {
  }



  /**timeout to prevent avoid login page */
  private loginTimeout;

  constructor(
    private platform: Platform,
    private dateAdapter: DateAdapter<any>,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
    private menu: MenuController,
    private loginService: Oauth2Service,
    private authenticationService: AuthenticationService,
    private warehouseService: WarehouseService,
    private scannerConfigurationService: ScannerConfigurationService,
    private typesService: TypesService
  ) {
    this.menu.enable(false, 'sidebar');
    this.dateAdapter.setLocale('es');
  }

  changeMenutTitle(title:string){
    this.currentRoute = title != 'Cerrar sesión' ? title : 'Inicio';
  }

  initializeApp() {
    this.mainHeaderShowHide(true);
    this.displaySmallSidebar = false;
    this.showSidebar = true;
    // TODO ERROR EN ESTA FUNCTION
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.menu.enable(true, 'sidebar');

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
        clearTimeout(this.loginTimeout);
        this.loginTimeout = setTimeout(()=>{
          if (state) {
            // Load of main warehouse in memory
            this.warehouseService
              .init()
              .then((data: Observable<HttpResponse<any>>) =>
                new Promise((resolve, reject) => {
                  data.subscribe((res: HttpResponse<any>) => {
                    // Load of main warehouse in memory
                    this.warehouseService.idWarehouseMain = res.body.data.id;
                    // Load in arrays and objects all the warehouses data (warehouses with racks with rows and columns)
                    this.warehouseService.loadWarehousesData();
                    // Load in array only warehouses with racks
                    this.warehouseService.loadWarehousesWithRacks();
                    resolve();
                  }, reject);
                })
              )
              .catch((possibleMainWarehouse404Error) => {})
              .then(() => this.router.navigate(
                [this.dictionary['welcome']?'/welcome':'/welcome']
                ).then(sucess => {
                  this.mainHeaderShowHide(true);
                  this.menu.enable(true, 'sidebar');
                })
              );
          } else {
            this.menu.enable(false, 'sidebar');
            this.mainHeaderShowHide(false);
            this.router.navigateByUrl('/login');
          }
        },10);

      });

      /* Update to display current route on Access Denied from Server */
      // this.router.events.subscribe(ev => {
      //   if (ev instanceof NavigationEnd) {
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
    app.name = "sga";
    /**Set the dictionary of access to menu */
    this.authenticationService.dictionaryAcessState.subscribe(state=>{
      this.dictionary = state;
    },e =>console.log(e)
    );
    // TODO ERROR LOGIN ESTA EN ESTA FUNCION
  this.initializeApp()
  }

  tapOption(p: MenuItem) {
    this.currentRoute = p.title;
    if (p.title === 'Logout') {
      this.authenticationService.getCurrentToken().then(accessToken => {
        this.loginService
          .get_logout(accessToken)
          .subscribe((data: HttpResponse<ResponseLogout>) => {
            this.authenticationService.logout().then(success => {
              this.router.navigateByUrl('/login')
            });
          });
      });
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
    if (this.displaySmallSidebar === true) {
      this.iconsDirection = 'end';
      this.menuComponent.iconsDirection = 'end';
    } else {
      this.iconsDirection = 'start'
      this.menuComponent.iconsDirection = 'start';
    }

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
      this.menuComponent.iconsDirection = 'start';
    } else {
      this.deploySidebarSmallDevices = false;
      this.displaySmallSidebar = true;
      this.iconsDirection = 'end';
      this.menuComponent.iconsDirection = 'end';
    }
  }

  toggleSidebarSmallDevices() {
    this.menu.toggle('sidebar');
  }

  openSubMenuItem(menuItem) {
    if (this.iconsDirection === 'end') this.toggleSidebar();

    menuItem.open = !menuItem.open;
  }
}
