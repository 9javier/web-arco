import { Component, OnInit,Input } from '@angular/core';
import {  app } from '../../../../services/src/environments/environment';
import { AuthenticationService, Oauth2Service } from '@suite/services';
import { Router } from '@angular/router';
import {ScanditService} from "../../../../services/src/lib/scandit/scandit.service";

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
  sgaPages:Array<any> = [
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
        },{
          title:'Etiquetas',
          id:'labels',
          url:'/labels',
          icon:'basket'
        },
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
      title:'Tarifa',
      id:'tariff-sga',
      url:'/tariff',
      icon:'logo-usd'
    },
    {
      title: 'Cerrar sesión',
      id:'logout',
      url: 'logout',
      icon: 'log-out'
    }
  ];

  alPages:Array<any> = [
    {
      title: 'Productos',
      id:'products',
      url: '/products',
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
    {
      title: 'Almacenes',
      url: '/warehouses',
      icon: 'filing',
      id:'warehouses'
    },
    {
      title: 'Ajustes',
      id:'settings',
      url: '/settings',
      icon: 'cog'
    },
    {
      title:'Tarifa',
      id:'tariff-al',
      url:'/tariff',
      icon:'logo-usd'
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

  menuPagesFiltered:Array<any> = [];



  constructor(private loginService:Oauth2Service,private router:Router,private authenticationService:AuthenticationService,
              private scanditService: ScanditService) { }

  /**
   * Select the links that be shown depends of dictionary paramethers
   */
  filterPages(dictionary){
    dictionary = JSON.parse(JSON.stringify(dictionary));
    console.log("diccionario",app,dictionary);
    if(!app || !app.name)
      return false;
    /**obtain the routes for the current application */
    let auxPages = this.menuPages[this.app.name];
    console.log(auxPages)
    this.menuPagesFiltered = [];
    if(!auxPages)
      return false;
    /**iterate over all pages of the application */
    auxPages.forEach((page:any)=>{
      /**to save the childrens of the actual page */
      let auxChildren = [];
      /**if the page is a wrapper then iterate over his childrens to get the alloweds */
      if(page.type == "wrapper"){
        page.children.forEach(children => {
          console.log(dictionary[children.id],children.id)
          /**if the childen is allowed then add if */
          if(dictionary[children.id])
            auxChildren.push(children)
        });
        /**if the page is a wrapper and have childrens then add it */
        let auxPage = JSON.parse(JSON.stringify(page));
        auxPage.childen = auxChildren;
        /** */
        if(auxChildren.length)
          this.menuPagesFiltered.push(auxPage);
      /**if not is a wrapper then is a normal category the check if plus easy */
      }else{
        console.log(dictionary[page.id],page.id)
        if(dictionary[page.id])
          this.menuPagesFiltered.push(page);
      }
    });
  
   //this.currentRoute = this.menuPagesFiltered[0].children[0].title;
  }

  tapOption(p) {
    console.log(p);
    this.currentRoute = p.title;
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
    }
  }

  openSubMenuItem(menuItem) {
    if (this.iconsDirection === 'end') this.toggleSidebar();

    menuItem.open = !menuItem.open;
  }

  toggleSidebar() {
    this.displaySmallSidebar = !this.displaySmallSidebar;
    this.displaySmallSidebar === true
      ? (this.iconsDirection = 'end')
      : (this.iconsDirection = 'start');

    for (let page of this.menuPagesFiltered) {
      if (page.children && page.children.length > 0) {
        page.open = false;
      }
    }
  }

  ngOnInit() {
  }

}
