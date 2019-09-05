import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import {  app } from '../../../../services/src/environments/environment';
import { AuthenticationService, Oauth2Service } from '@suite/services';
import { Router } from '@angular/router';
import {ScanditService} from "../../../../services/src/lib/scandit/scandit.service";
import {ReceptionScanditService} from "../../../../services/src/lib/scandit/reception/reception.service";
import {PrintTagsScanditService} from "../../../../services/src/lib/scandit/print-tags/print-tags.service";
import {MenuController} from "@ionic/angular";
import {SealScanditService} from "../../../../services/src/lib/scandit/seal/seal.service";
import {ProductInfoScanditService} from "../../../../services/src/lib/scandit/product-info/product-info.service";

type MenuItemList = (MenuSectionGroupItem|MenuSectionItem)[];

interface MenuSectionGroupItem {
  title: string,
  open: boolean,
  type: 'wrapper',
  children: MenuSectionItem[]
}

interface MenuSectionItem {
  title: string,
  id: string,
  url: string,
  icon: string,
}

@Component({
  selector: 'suite-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() set alloweds(allowed){
    this.filterPages(allowed || {logout:true});
  }


  private app = app;

  iconsDirection = 'start';
  displaySmallSidebar = false;
  currentRoute:string = "";
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
          id:'products',
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
          id:'warehouses-management',
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
          title: 'Listado',
          id:'workwaves-scheduled',
          url: '/workwaves-scheduled',
          icon: 'code'
        },
        {
          title: 'Historial',
          id:'workwaves-history',
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
          id:'user-management',
          icon: 'people'
        },
        {
          title: 'Parametrización de operarios',
          id:'operator-parametrization',
          url: '/user-manager',
          icon: 'people'
        },
        {
          title: 'Roles',
          id:'roles',
          url: '/roles/menu',
          icon: 'person'
        },
      ]
    },
    {
      title: 'Picking Tiendas',
      open: true,
      type: 'wrapper',
      icon: 'cart',
      children: [
        {
          title: 'Calendario',
          id:'calendar',
          url: '/calendar',
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
          id:'warehouses',
          url: '/warehouses',
          icon: 'filing'
        },
        {
          title: 'Grupos de almacenes',
          id:'warehouses-group',
          url: '/groups/menu',
          icon: 'person'
        },
        {
          title: 'Asignar grupos de almacenes',
          id:'group-to-warehouse',
          url: '/group-to-warehouse',
          icon: 'people'
        },
        {
          title: 'Grupos de tiendas para picking',
          id:'group-warehouse-picking',
          url: '/group-warehouse-picking',
          icon: 'people'
        },
        {
          title:'Agencias',
          id:'agency',
          url:'/manage-agencies',
          icon:'train'
        },
        {
          title: 'Edificios',
          id:'building',
          url: '/building',
          icon: 'business'
        },
        {
          title: 'Embalajes',
          id:'jails',
          url: '/jails/menu',
          icon: 'grid'
        },
      ]
    },
    {
      title:'Tarifas',
      id:'tariff-sga',
      url:'/tariff',
      icon:'logo-usd'
    },
  ];

  alPages: MenuItemList = [
    {
      title: 'Registro horario',
      id:'user-time',
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
      open: false,
      type: 'wrapper',
      icon: 'logo-usd',
      children: [
        {
          title: 'Tarifas',
          id: 'tariff-al',
          url: '/tariff',
          icon: 'logo-usd'
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
          title: 'Gestión de almacén',
          id: 'warehouses-management',
          url: '/warehouse/manage',
          icon: 'apps'
        },
        {
          title: 'Recepcionar',
          id: 'reception',
          url: 'reception',
          icon: 'archive'
        },
        {
          title: 'Vaciar',
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
        },{
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
        },{
          title: 'Variables globales',
          id: 'global-variables',
          url: '/global-variables',
          icon: 'cog'
        }
      ]
    },

  ];
  private menuPages = {
    sga:this.sgaPages,
    al:this.alPages
  }

  menuPagesFiltered: MenuItemList = [];
@Output() menuTitle = new EventEmitter();


  constructor(
    private loginService:Oauth2Service,
    private router:Router,
    private authenticationService:AuthenticationService,
    private scanditService: ScanditService,
    private receptionScanditService: ReceptionScanditService,
    private printTagsScanditService: PrintTagsScanditService,
    private sealScanditService: SealScanditService,
    private productInfoScanditService: ProductInfoScanditService,
    private menuController: MenuController
  ) { }

  returnTitle(item:MenuSectionItem){
    this.currentRoute = item.title
    this.menuTitle.emit(item.title);
  }

  /**
   * Select the links that be shown depends of dictionary paramethers
   */
  filterPages(dictionary){
    console.log("dictionaryManagement", "filterpages", JSON.parse(JSON.stringify(dictionary)));
    dictionary = JSON.parse(JSON.stringify(dictionary));
    let logoutItem = dictionary['user-time']?({
      title: 'Cerrar sesión',
      id:'logout',
      url: '/user-time/logout',
      icon: 'log-out'
    }):(    {
      title: 'Cerrar sesión',
      id:'logout',
      url: '/logout',
      icon: 'log-out'
    });
    if(!this.alPages.find(item=>(<any>item).id=="logout"))
      this.alPages.push(logoutItem);
    else
      this.alPages.forEach((item,i)=>{
        if((<any>item).id == "logout")
          this.alPages[i] = logoutItem;
      });
    if(!this.sgaPages.find(item=>(<any>item).id=="logout"))  
      this.sgaPages.push(logoutItem);
      else
      this.sgaPages.forEach((item,i)=>{
        if((<any>item).id == "logout")
          this.sgaPages[i] = logoutItem;
      });
    console.log("diccionario",app,dictionary);
    if(!app || !app.name) {
      return false;
    }
    /**obtain the routes for the current application */
    let auxPages = this.menuPages[this.app.name];
    console.log(auxPages)
    this.menuPagesFiltered = [];
    if(!auxPages) {
      return false;
    }
    /**iterate over all pages of the application */
    auxPages.forEach((page:any)=>{
      /**to save the childrens of the actual page */
      let auxChildren = [];
      /**if the page is a wrapper then iterate over his childrens to get the alloweds */
      if(page.type == "wrapper"){
        page.children.forEach(children => {
          console.log(dictionary[children.id],children.id)
          /**if the childen is allowed then add if */
          if(dictionary[children.id]) {
            auxChildren.push(children);
          }
        });
        /**if the page is a wrapper and have childrens then add it */
        let auxPage = JSON.parse(JSON.stringify(page));
        auxPage.children = auxChildren;
        /** */
        if(auxChildren.length) {
          this.menuPagesFiltered.push(auxPage);
        }
      /**if not is a wrapper then is a normal category the check if plus easy */
      }else{
        console.log(dictionary[page.id],page.id)
        if(dictionary[page.id]) {
          this.menuPagesFiltered.push(page);
        }
      }
    });

   //this.currentRoute = this.menuPagesFiltered[0].children[0].title;
  }

  tapOption(p) {
    console.log(p);
    this.currentRoute = p.title;
    this.menuTitle.emit(p.title);
    if (p.url === 'logout') {
      this.authenticationService.getCurrentToken().then(accessToken => {
        this.loginService
          .get_logout(accessToken)
          .subscribe((data) => {
            this.authenticationService.logout().then(success => {
              this.router.navigateByUrl('/login')
            });
            console.log(data);
          });
      });
    } else if(p.url === 'positioning'){
      this.scanditService.positioning();
    } else if(p.url === 'reception') {
      this.receptionScanditService.reception(1);
    } else if (p.url == 'reception/empty-carrier') {
      this.receptionScanditService.reception(2);
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
    } else if(p.url === 'reception') {
      this.receptionScanditService.reception(1);
    } else if (p.url == 'reception/empty-carrier') {
      this.receptionScanditService.reception(2);
    } else if (p.url == 'print/product/relabel') {
      this.printTagsScanditService.printRelabelProducts();
    } else if (p.url == 'products/info') {
      this.productInfoScanditService.init();
    } else if(p.url === 'positioning'){
      this.scanditService.positioning();
    } else {
      this.returnTitle(p);
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

}
