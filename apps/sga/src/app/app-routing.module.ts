import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RemoteTokenResolver } from './guards/auth.remove-token-resolver';
//import { UsersModule } from '../../../../libs/modules/src/users/users.module'

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/home/home.module#HomePageModule',
    data: {
      name: 'Principal'
    }
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/users/users.module#UsersModule',
    data: {
      name: 'Usuarios'
    }
  },
  {
    path: 'calendar',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/calendar-picking//calendar-picking.module#CalendarPickingModule',
    data: {
      name: 'Calendario'
    }
  },  {
    path: 'calendar-sga',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/calendar-sga//calendar-sga.module#CalendarSgaModule',
    data:{
      name: 'Calendario SGA'
    }
  },
  {
    path: 'roles',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/roles/roles.module#RolesModule',
    data: {
      name: 'Roles'
    }
  },
  {
    path: 'group-to-warehouse',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/group-to-warehouse/group-to-warehouse.module#GroupToWarehouseModule',
    data: {
      name: 'Asignar grupos de tiendas'
    }
  },
  {
    path: 'assign',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/assign/assign.module#AssignModule',
    data: {
      name: 'Asignar'
    }
  },
  {
    path: 'login',
    resolve: {
      token: RemoteTokenResolver
    },
    loadChildren: '../../../../libs/modules/src/login/login.module#LoginPageModule',
    data: {
      name: 'Login'
    }
  },
  {
    path: 'user-time/:redirect',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/user-time/user-time.module#UserTimeModule',
    data: {
      name: 'Registro horario'
    }
  },
  {
    path: 'user-time',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/user-time/user-time.module#UserTimeModule',
    data: {
      name: 'Registro horario'
    }
  },
  {
    path: 'group-warehouse-picking',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/group-warehouse-picking/group-warehouse-picking.module#GroupWarehousePickingModule',
    data: {
      name: 'Grupos de almacenes para picking'
    }
  },
  {
    path: 'jails',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/jail/jail.module#JailModule',
    data: {
      name: 'Jaulas'
    }
  },
  {
    path: 'state-expedition-avelon',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/state-expedition-avelon/state-expedition-avelon.module#StateExpeditionAvelonModule',
    data: {
      name: 'Estados'
    }
  },
  {
    path: 'pallets',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/pallets/pallets.module#PalletsModule',
    data: {
      name: 'Paletas'
    }
  },
  {
    path: 'permissions',
    loadChildren: '../../../../libs/modules/src/permissions/permissions.module#PermissionsPageModule',
    data: {
      name: 'Permisos'
    }
  },
  {
    path: 'warehouses',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/warehouses/warehouses.module#WarehousesModule',
    data: {
      name: 'Almacenes'
    }
  },
  {
    path: 'groups',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/groups/groups.module#GroupsModule',
    data: {
      name: 'Grupo de tiendas'
    }
  },
  {
    path: 'user-manager',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/user-manager/user-manager.module#UserManagerModule',
    data: {
      name: 'Parametrización de operarios'
    }
  },
  {
    path: 'warehouses/halls',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/halls/halls.module#HallsModule',
    data: {
      name: 'Pasillos'
    }
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/products/products.module#ProductsModule',
    data: {
      name: 'Productos'
    }
  },
  {
    path: 'audits',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/audits/audits.module#AuditsModule',
    data: {
      name: 'Auditorias'
    }
  },
  {
    path: 'warehouses/locations',
    canActivate: [AuthGuard],
    loadChildren: '@suite/common-modules#LocationsModule',
    data: {
      name: 'Ubicaciones'
    }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'logout',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'warehouse',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/locations/locations.module#LocationsModule',
    data: {
      name: 'Almacenes'
    }
  },
  {
    path: 'manage-agencies',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/agency/agency.module#AgencyModule',
    data: {
      name: 'Agencias'
    }
  },
  {
    path: 'global-variables',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/global-variables/global-variables.module#GlobalVariablesModule',
    data: {
      name: 'Variables globales'
    }
  },
  {
    path: 'workwaves-scheduled',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwaves-schedule/workwaves-schedule.module#WorkwavesScheduleModule',
    data: {
      name: 'Programadas'
    }
  },
  {
    path: 'workwave-template-rebuild',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwave-template-rebuild/workwave-template-rebuild.module#WorkwaveTemplateRebuildModule',
    data: {
      name: 'Plantilla'
    }
  },
  {
    path: 'workwave/online-store',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwave-template-online-store/workwave-template-online-store.module#WorkwaveTemplateOnlineStoreModule',
    data: {
      name: 'Plantilla'
    }
  },
  {
    path: 'workwaves-history',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/workwaves-history/workwaves-history.module#WorkwavesHistoryModule',
    data: {
      name: 'Historial'
    }
  },
  {
    path: 'assign/user/picking',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/user-assignment-picking/user-assignment-picking.module#UserAssignmentPickingModule',
    data: {
      name: ''
    }
  },
  {
    path: 'labels',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/labels/labels.module#LabelsModule',
    data: {
      name: 'Etiquetas'
    }
  },
  {
    path: 'tariff',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/tariffSGA/tariffSGA.module#TariffSGAModule',
    data: {
      name: 'Tarifas'
    }
  },
  {
    path: 'incidences',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/incidences-list/incidences-list.module#IncidencesListModule',
    data: {
      name: 'Notificaciones'
    }
  },
  {
    path: 'prices',
    redirectTo: 'products',
    data: {
      name: 'Precios'
    }
  },
  {
    path: 'prices/:tariffId',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/prices/prices.module#PricesModule',
    data: {
      name: 'Prices'
    }
  },
  {
    path: 'building',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/building/building.module#BuildingModule',
    data: {
      name: 'Edificios'
    }
  },
  {
    path: 'sorter',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/sorter/sorter.module#SorterModule',
    data: {
      name: 'Plantillas'
    }
  },
  {
    path: 'sorter-new',
    canActivate: [AuthGuard],
    loadChildren: '../../../../libs/modules/src/sorter-create/sorter-create.module#SorterCreateModule',
    data: {
      name: 'Crear Sorter'
    }
  },
  {
    path:'regions',
    canActivate:[AuthGuard],
    loadChildren: '../../../../libs/modules/src/regions/regions.module#RegionsModule',
    data: {
      name: 'Regiones'
    }
  },
  {
    path:'receptions-avelon',
    canActivate:[AuthGuard],
    loadChildren: '../../../../libs/modules/src/receptions-avelon/receptions-avelon.module#ReceptionsAvelonModule',
    data: {
      name: 'Recepciones'
    }
  },
  {
    path:'predistributions',
    canActivate:[AuthGuard],
    loadChildren: '../../../../libs/modules/src/predistributions/predistributions.module#PredistributionsModule',
    data: {
      name: 'Predistribuciones'
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [RemoteTokenResolver]
})
export class AppRoutingModule { }
