import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import {  app } from '../../../../services/src/environments/environment';
import { AuthenticationService, Oauth2Service } from '@suite/services';
import { Router } from '@angular/router';
import {ScanditService} from "../../../../services/src/lib/scandit/scandit.service";
import {ReceptionScanditService} from "../../../../services/src/lib/scandit/reception/reception.service";
import {PrintTagsScanditService} from "../../../../services/src/lib/scandit/print-tags/print-tags.service";
import {MenuController} from "@ionic/angular";
import {SealScanditService} from "../../../../services/src/lib/scandit/seal/seal.service";

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
      title: 'Logística',
      open: true,
      type:'wrapper',
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
      type:'wrapper',
      children: [
        {
          title: 'Programadas',
          id:'workwaves-scheduled',
          url: '/workwaves-scheduled',
          icon: 'code'
        },
        {
          title: 'Plantillas',
          id:'workwaves-templates',
          url: '/workwaves-templates',
          icon: 'code-working'
        },
        {
          title: 'Historial',
          id:'workwaves-history',
          url: '/workwaves-history',
          icon: 'code-download'
        }
      ]
    },
    {
      title: 'Gestión de usuarios',
      open: true,
      type:'wrapper',
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
      title: 'Configuración',
      open: true,
      type:'wrapper',
      children: [
        {
          title: 'Almacenes',
          id:'warehouses',
          url: '/warehouses',
          icon: 'filing'
        },
        {
          title: 'Grupos de tiendas',
          id:'warehouses-group',
          url: '/groups/menu',
          icon: 'person'
        },
        {
          title: 'Asignar grupos de tiendas',
          id:'group-to-warehouse',
          url: '/group-to-warehouse',
          icon: 'people'
        },
        {
          title: 'Jaulas',
          id:'jails',
          url: '/jails/menu',
          icon: 'grid'
        },
        {
          title: 'Palets',
          id:'pallets',
          url: '/pallets/menu',
          icon: 'cube'
        },
      ]
    },
    
    {
      title: 'Calendar',
      id:'calendar',
      url: '/calendar',
      icon: 'md-calendar'
    },{
      title: 'Group warehouse picking',
      id:'group-warehouse-picking',
      url: '/group-warehouse-picking',
      icon: 'md-calendar'
    },
    {
      title:'Tarifa',
      id:'tariff-sga',
      url:'/tariff',
      icon:'logo-usd'
    },{
      title: 'Building',
      id:'building',
      url: '/building',
      icon: 'basket'
    },
    {
      title: 'Cerrar sesión',
      id:'logout',
      url: 'logout',
      icon: 'log-out'
    },
  ];

  alPages: MenuItemList = [
    {
      title: 'Productos',
      id:'products',
      url: '/products',
      icon: 'basket'
    },
    {
      title: 'Building',
      id:'building',
      url: '/building',
      icon: 'basket'
    },
    {
      title: 'Gestión de almacén',
      id:'warehouses-management',
      url: '/warehouse/manage',
      icon: 'apps'
    },
    {
      title: 'Ubicar/Escanear',
      id:'positioning',
      icon: 'qr-scanner',
      url: 'positioning'
    },
    {
      title: 'Ubicar/Escanear Manualmente',
      icon: 'qr-scanner',
      url: '/positioning/manual',
      id:'positioning-manual'
    },
    {
      title: 'Tareas de Picking',
      id:"picking-task",
      icon: 'qr-scanner',
      url: '/picking-tasks'
    },
    {
      title: 'Tareas de Picking Manualmente',
      icon: 'qr-scanner',
      url: '/picking-tasks/manual',
      id:'picking-tasks-manual'
    },
    {
      title: 'Recipientes',
      open: false,
      type: 'wrapper',
      children: [
        {
          title: 'Precintar',
          id: 'packing-seal',
          url: 'packing/seal',
          icon: 'qr-scanner'
        },
        {
          title: 'Precintar',
          id: 'packing-seal-manual',
          url: '/packing/seal/manual',
          icon: 'create'
        },
        {
          title: 'Recepcionar',
          id: 'reception',
          url: 'reception',
          icon: 'qr-scanner'
        },
        {
          title: 'Vaciar',
          id: 'empty-carrier',
          url: 'reception/empty-carrier',
          icon: 'qr-scanner'
        }
      ]
    },
    {
      title: 'Etiquetado',
      id: 'print-tags',
      open: false,
      type: 'wrapper',
      children: [
        {
          title: 'Reetiquetado Recipiente',
          id: 'print-packing',
          url: '/print/packing',
          icon: 'pricetags'
        },
        {
          title: 'Código Caja',
          id: 'print-ref-tag',
          url: 'print/tag/ref',
          icon: 'qr-scanner'
        },
        {
          title: 'Código Caja',
          id: 'print-ref-tag-manual',
          url: '/print-tag/manual/box',
          icon: 'create'
        },
        {
          title: 'Código Exposición',
          id: 'print-price-tag',
          url: 'print/tag/price',
          icon: 'qr-scanner'
        },
        {
          title: 'Código Exposición',
          id: 'print-price-tag-manual',
          url: '/print-tag/manual/price',
          icon: 'create'
        }
      ]
    },
    {
      title: 'Configuración',
      open: false,
      type: 'wrapper',
      children: [
        {
          title: 'Jaulas',
          id:'jails',
          url: '/jails/menu',
          icon: 'grid'
        },
        {
          title: 'Almacenes',
          url: '/warehouses',
          icon: 'filing',
          id:'warehouses'
        },
        {
          title:'Tarifa',
          id:'tariff-al',
          url:'/tariff',
          icon:'logo-usd'
        }
      ]
    },
    {
      title: 'Ajustes',
      id:'settings',
      url: '/settings',
      icon: 'cog'
    },
    {
      title: 'Cerrar sesión',
      id:'logout',
      url: 'logout',
      icon: 'log-out'
    }
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
