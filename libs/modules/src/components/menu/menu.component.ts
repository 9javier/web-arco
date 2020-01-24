import { Component, OnInit, Input, Output, EventEmitter, ViewChild, NgZone } from '@angular/core';
import { app } from '../../../../services/src/environments/environment';
import { AuthenticationService, Oauth2Service, TariffService } from '@suite/services';
import { Router } from '@angular/router';
import { ScanditService } from "../../../../services/src/lib/scandit/scandit.service";
import { ReceptionScanditService } from "../../../../services/src/lib/scandit/reception/reception.service";
import { PrintTagsScanditService } from "../../../../services/src/lib/scandit/print-tags/print-tags.service";
import { MenuController } from "@ionic/angular";
import { SealScanditService } from "../../../../services/src/lib/scandit/seal/seal.service";
import { ProductInfoScanditService } from "../../../../services/src/lib/scandit/product-info/product-info.service";
import { ToolbarProvider } from "../../../../services/src/providers/toolbar/toolbar.provider";
import { LoginComponent } from '../../login/login.page';
import { AuditMultipleScanditService } from "../../../../services/src/lib/scandit/audit-multiple/audit-multiple.service";

type MenuItemList = (MenuSectionGroupItem | MenuSectionItem)[];

interface MenuSectionGroupItem {
  title: string,
  open: boolean,
  type: 'wrapper',
  children: MenuSectionItem[]
}

interface MenuSectionItem {
  title: string,
  id?: string,
  url: string,
  icon: string,
  notification?: boolean
  children?: MenuSectionItem[];
  header?: boolean
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
  sgaPages: MenuItemList = [
    {
      title: 'Registro horario',
      id: 'user-time',
      url: '/user-time',
      icon: 'time'
    },
    {
      title: 'Logística',
      open: true,
      type: 'wrapper',
      icon: 'filing',
      children: [
        {
          title: 'Productos',
          id: 'products',
          url: '/products',
          icon: 'basket'
        },
        /*{
          title:'Etiquetas',
          id:'labels',
          url:'/labels',
          icon:'basket'
        },*/
        {
          title: 'Gestión de almacén',
          id: 'warehouses-management',
          url: '/warehouse/manage',
          icon: 'apps'
        },
        {
          title: 'Incidencias',
          id: 'incidences',
          url: '/incidences',
          icon: 'notifications'
        }
      ]
    },
    {
      title: 'Olas de trabajo',
      open: true,
      type: 'wrapper',
      icon: 'hammer',
      children: [
        {
          title: 'Picking directo/consolidado',
          id: 'workwaves-scheduled-1',
          url: '/workwave-template-rebuild',
          icon: 'add-circle'
        },
        {
          title: 'Peticiones online/tienda',
          id: 'workwave-online-store',
          url: '/workwave/online-store',
          icon: 'add-circle-outline'
        },
        {
          title: 'Listado',
          id: 'workwaves-scheduled',
          url: '/workwaves-scheduled',
          icon: 'code'
        },
        {
          title: 'Historial',
          id: 'workwaves-history',
          url: '/workwaves-history',
          icon: 'code-download'
        },
        {
          title: 'Pickings en curso',
          id: 'pickings-execution',
          url: '/workwaves-scheduled/pickings',
          icon: 'code-working'
        }
      ]
    },
    {
      title: 'Gestión de usuarios',
      open: true,
      type: 'wrapper',
      icon: 'contacts',
      children: [
        {
          title: 'Gestión de usuarios',
          url: '/users/menu',
          id: 'user-management',
          icon: 'people'
        },
        {
          title: 'Parametrización de operarios',
          id: 'operator-parametrization',
          url: '/user-manager',
          icon: 'people'
        },
        {
          title: 'Roles',
          id: 'roles',
          url: '/roles/menu',
          icon: 'person'
        },
      ]
    },
    {
      title: 'Picking tiendas',
      open: true,
      type: 'wrapper',
      icon: 'cart',
      children: [
        {
          title: 'Calendario',
          id: 'calendar-sga',
          url: '/calendar-sga',
          icon: 'md-calendar'
        }
      ]
    },
    {
      title: 'Configuración',
      open: true,
      type: 'wrapper',
      icon: 'options',
      children: [
        {
          title: 'Variables globales',
          id: 'global-variables',
          url: '/global-variables',
          icon: 'cog'
        },
        {
          title: 'Almacenes',
          id: 'warehouses',
          url: '/warehouses',
          icon: 'filing'
        },
        {
          title: 'Grupos de almacenes',
          id: 'warehouses-group',
          url: '/groups/menu',
          icon: 'person'
        },
        {
          title: 'Asignar grupos de almacenes',
          id: 'group-to-warehouse',
          url: '/group-to-warehouse',
          icon: 'people'
        },
        {
          title: 'Grupos de tiendas para picking',
          id: 'group-warehouse-picking',
          url: '/group-warehouse-picking',
          icon: 'people'
        },
        {
          title: 'Agencias',
          id: 'agency',
          url: '/manage-agencies',
          icon: 'train'
        },
        {
          title: 'Edificios',
          id: 'building',
          url: '/building',
          icon: 'business'
        },
        {
          title: 'Embalajes',
          id: 'jails',
          url: '/jails/menu',
          icon: 'grid'
        },
        {
          title: 'Estado de expedición',
          id: 'state-expedition-avelon',
          url: '/state-expedition-avelon/menu',
          icon: 'apps'
        }
      ]
    },
    {
      title: 'Tarifas',
      id: 'tariff-sga',
      url: '/tariff',
      icon: 'logo-usd'
    },
    {
      title: 'Sorter',
      open: true,
      type: 'wrapper',
      icon: 'apps',
      children: [
        {
          title: 'Plantillas',
          id: 'sorter-sga',
          url: '/sorter/templates',
          icon: 'document'
        },
        {
          title: 'Estantería anexa',
          id: 'sorter-racks',
          url: '/sorter/racks',
          icon: 'grid'
        },
        {
          title: 'Selección de plantilla',
          id: 'sorter-template-selection',
          url: '/sorter/template/selection',
          icon: 'checkbox-outline'
        },
        {
          title: 'Vaciado de calles',
          id: 'sorter-ways-emptying',
          url: '/sorter/ways/emptying',
          icon: 'square-outline'
        }
      ]
    },
    {
      title: 'Auditorias',
      open: false,
      type: 'wrapper',
      icon: 'ribbon',
      children: [
        {
          title: 'Lista de auditorias',
          id: 'audit-sga',
          url: '/audits',
          icon: 'list-box'
        }
      ]
    },
    {
      title: 'Regiones',
      id: 'regions',
      url: '/regions',
      icon: 'map'
    },
    {
      title: 'Recepciones',
      id: 'receptions-avelon',
      url: '/receptions-avelon',
      icon: 'archive'
    },
    {
      title: 'Predistribuciones',
      id: 'predistributions',
      url: '/predistributions',
      icon: 'archive'
    },
    {
      title: 'Catálogos Marketplaces',
      id: 'catalogs-marketplaces',
      url: '/marketplaces/catalogs-marketplaces',
      icon: 'document'
    },
    {
      title: 'KrackOnline',
      open: true,
      type: 'wrapper',
      icon: 'apps',
      children: [ 
        {
          title: 'Catálogo',
          id: 'ko-catalog',
          url: '/marketplaces/krackonline/catalog',
          icon: 'document'
        },
        {
          title: 'Mapeos',
          id: 'ko-mapping',
          url: '/marketplaces/krackonline/mapping',
          icon: 'document'
        },{
          title: 'Reglas',
          id: 'ko-rules',
          url: '/marketplaces/krackonline/rules',
          icon: 'document'
        },{
          title: 'Stocks seguridad',
          id: 'ko-security-stocks',
          url: '/marketplaces/krackonline/security-stocks',
          icon: 'document'
        },
      ]
    },
    {
      title: 'Miniprecios',
      open: true,
      type: 'wrapper',
      icon: 'apps',
      children: [ 
        {
          title: 'Catálogo',
          id: 'mp-catalog',
          url: '/marketplaces/miniprecios/catalog',
          icon: 'document'
        },
        {
          title: 'Mapeos',
          id: 'mp-mapping',
          url: '/marketplaces/miniprecios/mapping',
          icon: 'document'
        },{
          title: 'Reglas',
          id: 'mp-rules',
          url: '/marketplaces/miniprecios/rules',
          icon: 'document'
        },{
          title: 'Stocks seguridad',
          id: 'mp-security-stocks',
          url: '/marketplaces/miniprecios/security-stocks',
          icon: 'document'
        },
      ]
    },
    {
      title: 'Prioridad de Tienda',
      id: 'store-priority',
      url: '/marketplaces/store-priority',
      icon: 'document'
    }
  ];

  alPages: MenuItemList = [
    {
      title: 'Registro horario',
      id: 'user-time',
      url: '/user-time',
      icon: 'time'
    },
    {
      title: 'Productos',
      open: true,
      type: 'wrapper',
      icon: 'basket',
      children: [
        {
          title: 'Productos',
          id: 'products',
          url: '/products',
          icon: 'basket'
        },
        {
          title: 'Consulta',
          id: 'products-info',
          url: 'products/info',
          icon: 'information-circle'
        },
        {
          title: 'Productos recibidos',
          id: 'print-products-received',
          url: '/print/product/received',
          icon: 'archive'
        },
        {
          title: 'Reetiquetado productos',
          id: 'print-product',
          url: 'print/product/relabel',
          icon: 'barcode'
        },
        {
          title: 'Reetiquetado productos manual',
          id: 'print-product-manual',
          url: '/print/product/relabel',
          icon: 'barcode'
        }
      ]
    },
    {
      title: 'Tarifas',
      id: 'tarifas',
      open: false,
      type: 'wrapper',
      icon: 'logo-usd',
      notification: this.isNewTariff,
      children: [
        {
          title: 'Tarifas',
          id: 'tariff-al',
          url: '/tariff',
          icon: 'logo-usd',
          notification: this.isNewTariff
        },
        {
          title: 'Código exposición',
          id: 'print-price-tag',
          url: 'print/tag/price',
          icon: 'pricetags'
        },
        {
          title: 'Código exposición manual',
          id: 'print-price-tag-manual',
          url: '/print-tag/manual/price',
          icon: 'pricetags'
        },
        {
          title: 'Nuevos Productos',
          id: 'new-products',
          url: '/new-products',
          icon: 'basket'
        }
      ]
    },
    {
      title: 'Logística',
      open: false,
      type: 'wrapper',
      icon: 'send',
      children: [
        {
          title: 'Ubicar/escanear',
          id: 'positioning',
          icon: 'locate',
          url: 'positioning'
        },
        {
          title: 'Ubicar/escanear manualmente',
          icon: 'locate',
          url: '/positioning/manual',
          id: 'positioning-manual'
        },
        {
          title: 'Traspasos',
          id: 'picking-task-store',
          icon: 'qr-scanner',
          url: '/picking-tasks'
        },
        {
          title: 'Tareas de Picking',
          id: 'picking-task',
          icon: 'qr-scanner',
          url: '/picking-tasks'
        },
        {
          title: 'Tareas de picking manualmente',
          icon: 'qr-scanner',
          url: '/picking-tasks/manual',
          id: 'picking-tasks-manual'
        },
        {
          title: 'Verificación de artículos',
          icon: 'checkmark-circle-outline',
          url: '/picking/online-store/verify',
          id: 'picking-tasks-manual'
        },
        {
          title: 'Gestión de almacén',
          id: 'warehouses-management',
          url: '/warehouse/manage',
          icon: 'apps'
        },
        {
          title: 'Recepcionar embalaje',
          id: 'reception',
          url: 'reception',
          icon: 'archive'
        },
        {
          title: 'Recepcionar par a par',
          id: 'empty-carrier',
          url: 'reception/empty-carrier',
          icon: 'square-outline'
        },
        {
          title: 'Embalajes',
          id: 'jails',
          url: '/jails/menu',
          icon: 'grid'
        },
        {
          title: 'Reetiquetado embalajes',
          id: 'print-packing',
          url: '/print/packing',
          icon: 'grid'
        },
        {
          title: 'Precintar embalaje',
          id: 'packing-seal',
          url: 'packing/seal',
          icon: 'paper-plane'
        },
        {
          title: 'Precintar embalaje manual',
          id: 'packing-seal-manual',
          url: '/packing/seal/manual',
          icon: 'paper-plane'
        },
        {
          title: 'Traspaso embalaje',
          id: 'packing-transfer',
          url: '/packing/transfer',
          icon: 'redo'
        },
        {
          title: 'Recepción de embalaje vacío',
          id: 'reception-empty-packing',
          url: '/packing/carrierEmptyPacking',
          icon: 'exit'
        },
        {
          title: 'Envío de embalaje vacío',
          id: 'send-empty-packing',
          url: '/sendEmptyPacking',
          icon: 'send'
        }
      ]
    },
    {
      title: 'Picking y Ventilación',
      open: false,
      type: 'wrapper',
      icon: 'grid',
      children: [
        {
          title: 'Ventilación de traspasos',
          id: 'ventilation-transfer',
          url: '/ventilation/transfer',
          icon: 'swap'
        },
        {
          title: 'Ventilación sin Sorter',
          id: 'ventilation-no-sorter',
          url: '/ventilation-no-sorter',
          icon: 'aperture'
        }
      ]
    },
    {
      title: 'Sorter',
      open: false,
      type: 'wrapper',
      icon: 'apps',
      children: [
        {
          title: 'Entrada',
          id: 'sorter-input',
          url: '/sorter/input',
          icon: 'log-in'
        },
        {
          title: 'Salida',
          id: 'sorter-output',
          url: '/sorter/output',
          icon: 'log-out'
        }
      ]
    },
    {
      title: 'Auditorias',
      open: false,
      type: 'wrapper',
      icon: 'ribbon',
      children: [
        {
          title: 'Lista de auditorias',
          id: 'audit-al',
          url: '/audits',
          icon: 'list-box'
        },
        {
          title: 'Revisiones Pendientes',
          id: 'audit-rv',
          url: '/audits/pending-revisions',
          icon: 'list-box'
        },
        {
          title: 'Escaneo total (láser)',
          id: 'add-audits',
          url: '/audits/add',
          icon: 'qr-scanner'
        },
        {
          title: 'Escaneo aleatorio (cámara)',
          id: 'audit-scan',
          url: 'audits/scan',
          icon: 'aperture'
        }
      ]
    },
    {
      title: 'Configuración',
      open: false,
      type: 'wrapper',
      icon: 'build',
      children: [
        {
          title: 'Ajustes',
          id: 'settings',
          url: '/settings',
          icon: 'cog'
        }
      ]
    },

  ];
  private menuPages = {
    sga: this.sgaPages,
    al: this.alPages
  }

  menuPagesFiltered: MenuItemList = [];
  @Output() menuTitle = new EventEmitter();

  constructor(
    private loginService: Oauth2Service,
    private router: Router,
    private authenticationService: AuthenticationService,
    private scanditService: ScanditService,
    private receptionScanditService: ReceptionScanditService,
    private printTagsScanditService: PrintTagsScanditService,
    private sealScanditService: SealScanditService,
    private productInfoScanditService: ProductInfoScanditService,
    private auditMultipleScanditService: AuditMultipleScanditService,
    private menuController: MenuController,
    private toolbarProvider: ToolbarProvider,
    private tariffService: TariffService,
    private zona: NgZone

  ) {
    this.loginService.availableVersion.subscribe(res => {
      this.versionUpdate = res;
    })
  }

  returnTitle(item: MenuSectionItem) {
    this.currentRoute = item.title
    this.toolbarProvider.currentPage.next(item.title);
    this.toolbarProvider.optionsActions.next([]);
    this.menuTitle.emit(item.title);
  }

  loadUpdate() {
    window.open('https://drive.google.com/open?id=1p8wdD1FpXD_aiUA5U6JsOENNt0Ocp3_o', '_blank')
  }

  /**
   * Select the links that be shown depends of dictionary paramethers
   */
  filterPages(dictionary) {
    dictionary = JSON.parse(JSON.stringify(dictionary));
    this.newTariffs();
    if(app.name == 'al') {
      this.zona.run(() => {
        setInterval(() => {
          this.newTariffs();
        }, 5 * 60 * 1000);
      });
    }
    let logoutItem = dictionary['user-time'] ? ({
      title: 'Cerrar sesión',
      id: 'logout',
      url: '/user-time/logout',
      icon: 'log-out'
    }) : ({
      title: 'Cerrar sesión',
      id: 'logout',
      url: '/logout',
      icon: 'log-out'
    });
    if (!this.alPages.find(item => (<any>item).id == "logout"))
      this.alPages.push(logoutItem);
    else
      this.alPages.forEach((item, i) => {
        if ((<any>item).id == "logout")
          this.alPages[i] = logoutItem;
      });
    if (!this.sgaPages.find(item => (<any>item).id == "logout"))
      this.sgaPages.push(logoutItem);
    else
      this.sgaPages.forEach((item, i) => {
        if ((<any>item).id == "logout")
          this.sgaPages[i] = logoutItem;
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
    this.currentRoute = p.title;
    this.toolbarProvider.currentPage.next(p.title);
    this.toolbarProvider.optionsActions.next([]);
    this.menuTitle.emit(p.title);
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
      this.scanditService.positioning();
    } else if (p.url === 'reception') {
      this.receptionScanditService.reception(1);
    } else if (p.url == 'reception/empty-carrier') {
      this.receptionScanditService.reception(2);
    } else if(p.url === 'audits/scan'){
      this.auditMultipleScanditService.init();
    }
  }

  tapOptionSubitem(p) {
    this.menuController.close();
    if (p.url === 'print/tag/ref') {
      this.printTagsScanditService.printTagsReferences();
    } else if (p.url === 'print/tag/price') {
      this.printTagsScanditService.printTagsPrices();
    } else if (p.url === 'packing/seal') {
      this.sealScanditService.seal();
    } else if (p.url === 'reception') {
      this.receptionScanditService.reception(1);
    } else if (p.url == 'reception/empty-carrier') {
      this.receptionScanditService.reception(2);
    } else if (p.url == 'print/product/relabel') {
      this.printTagsScanditService.printRelabelProducts();
    } else if (p.url == 'products/info') {
      this.productInfoScanditService.init();
    } else if (p.url === 'positioning') {
      this.scanditService.positioning();
    } else if (p.url === 'audits/scan') {
      this.auditMultipleScanditService.init();
    }else {
      this.returnTitle(p);
    }
    if (p.id === 'workwaves-scheduled-1') {
      this.router.navigate([p.url], { queryParams: { type: 1 } })
    }
  }

  openSubMenuItem(menuItem) {
    if (this.iconsDirection === 'end') {
      this.toggleSidebar();
    }

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
  newTariffs() {
    this.tariffService
      .getNewTariff()
      .then(tariff => {
        if (tariff.code == 200) {
          let newTariff = tariff.data;
          /**save the data and format the dates */
          this.alPages.forEach((item, i) => {
            if ((<any>item).id == "tarifas") {
              (<any>item).notification = newTariff;
              (<any>item).children.forEach((child, j) => {
                if ((<any>child).id == "tariff-al") {
                  (<any>child).notification = newTariff;
                }
              });
            }
          });
        } else {
          console.error('Error to try check if exists new tariffs', tariff);
        }
    }, (error) => {
        console.error('Error to try check if exists new tariffs', error);
    })
  }

  checkIfChildrenHasNewTariffs(element): boolean {
    return !!element.children.find(c => c.notification)
  }

}
