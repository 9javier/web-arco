import { Component, OnInit, Input, Output, EventEmitter, ViewChild, NgZone } from '@angular/core';
import { app, environment } from '../../../../services/src/environments/environment';
import { AuthenticationService, Oauth2Service, TariffService, WarehouseModel } from '@suite/services';
import { Router } from '@angular/router';
import { ScanditService } from "../../../../services/src/lib/scandit/scandit.service";
import { ReceptionScanditService } from "../../../../services/src/lib/scandit/reception/reception.service";
import { PrintTagsScanditService } from "../../../../services/src/lib/scandit/print-tags/print-tags.service";
import { MenuController, PopoverController } from "@ionic/angular";
import { SealScanditService } from "../../../../services/src/lib/scandit/seal/seal.service";
import { ProductInfoScanditService } from "../../../../services/src/lib/scandit/product-info/product-info.service";
import { ToolbarProvider } from "../../../../services/src/providers/toolbar/toolbar.provider";
import { LoginComponent } from '../../login/login.page';
import { AuditMultipleScanditService } from "../../../../services/src/lib/scandit/audit-multiple/audit-multiple.service";
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
  children: MenuSectionItem[],
  tooltip?: string
}

interface MenuSectionItem {
  title: string,
  id?: string,
  url: string,
  icon: string,
  notification?: boolean,
  children?: MenuSectionItem[],
  header?: boolean,
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

  sgaPages: MenuItemList = [
/*    {
      title: 'Registro horario',
      id: 'user-time',
      url: '/user-time',
      icon: 'time'
    },*/
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
          title: 'Asignación de roles',
          id: 'role-assignment',
          url: '/role-assignment',
          icon: 'key'
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
      title: 'Control de exposición',
      open: true,
      type: 'wrapper',
      icon: 'cart',
      children: [
        {
          title: 'Productos sin imprimir',
          id: 'list-new-products',
          url: '/list-new-products',
          icon: 'basket',
          tooltip: 'Listado de nuevos productos recibidos que aún no han sido impresos'
        },
        {
          title: 'Ocultar alertas de recepción',
          id: 'reception-hide-alert',
          url: '/reception-hide-alert',
          icon: 'alert',
          tooltip: 'Listado de qué almacenes pueden ocultar las alertas de nuevas recepciones'
        }
      ]
    },
    {
      title: 'Defectuosos',
      open: true,
      type: 'wrapper',
      icon: 'paper',
      children: [
        {
          title: 'Registro',
          id: 'defective-registry',
          url: '/defective-registry',
          icon: 'list-box',
          tooltip: 'Listado de registro de defectusosos'
        },
        {
          title: 'Histórico',
          id: 'defective-historic',
          url: '/defective-historic',
          icon: 'filing',
          tooltip: 'Listado de registro histórico de defectuosos'
        },
        {
          title: 'Parametrización',
          id: 'damaged-shoes',
          url: '/damaged-shoes',
          icon: 'options',
          tooltip: 'Parametrización de estados'
        },
        {
          title: 'Tipos de daños',
          id: 'defective-management',
          url: '/defective-management',
          icon: 'flag',
          tooltip: 'Tipos de daños'
        },
        {
          title: 'Zonas',
          id: 'defective-zones',
          url: '/defective-zones',
          icon: 'flag',
          tooltip: 'Zonas'
        },
      ]
    },
    {
      title: 'Devoluciones fábrica',
      open: true,
      type: 'wrapper',
      icon: 'return-left',
      children: [
        {
          title: 'Lista',
          id: 'returns-list',
          url: '/returns-list',
          icon: 'list-box',
          tooltip: 'Listado de registro de devoluciones'
        },
        {
          title: 'Listado Históricos',
          id: 'returns-historic',
          url: '/returns-historic',
          icon: 'list-box',
          tooltip: 'Listado de históricos de devoluciones'
        },
        {
          title: 'Listado Seguimiento Devoluciones',
          id: 'return-tracking-list',
          url: '/return-tracking-list',
          icon: 'list',
          tooltip: 'Listado de seguimiento de devoluciones'
        },
        {
          title: 'Condiciones proveedores',
          id: 'supplier-conditions',
          url: '/supplier-conditions',
          icon: 'list-box',
          tooltip: 'Listado de condiciones de proveedores'
        },
        {
          title: 'Tipos de devoluciones',
          id: 'return-types',
          url: '/return-types',
          icon: 'list-box',
          tooltip: 'Listado de tipos de devoluciones'
        }
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
          title: 'Recepcion Final',
          id: 'reception-final',
          url: '/reception-final',
          icon: 'pricetags'
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
      title: 'Control de embalajes',
      open: false,
      type: 'wrapper',
      icon: 'ribbon',
      children: [
        {
          title: 'Lista Control Embalajes',
          id: 'audit-sga',
          url: '/audits',
          icon: 'list-box'
        }
      ]
    },
    {
      title: 'Recepción de fábrica',
      open: true,
      type: 'wrapper',
      icon: 'archive',
      children: [
        {
          title: 'Proceso recepción',
          id: 'receptions-avelon',
          url: '/receptions-avelon',
          icon: 'pricetags'
        },
        {
          title: 'Recepción sin pedido',
          id: 'receptions-avelon-free',
          url: '/receptions-avelon/free',
          icon: 'pricetags'
        },
        {
          title: 'Predistribuciones',
          id: 'predistributions',
          url: '/predistributions',
          icon: 'options'
        },
        {
          title: 'Stock Reservado',
          id: 'receptions',
          url: '/receptions',
          icon: 'hand'
        },
        {
          title: 'Pendiente notificar Avelon',
          id: 'products-table-seconds-avelon',
          url: '/pr-ta-se-av',
          icon: 'cloud-upload'
        },
        {
          title: 'Estados de expediciones',
          id: 'state-expedition-avelon',
          url: '/state-expedition-avelon/menu',
          icon: 'cog'
        },
        {
          title: 'Temporadas habilitadas',
          id: 'seasons-enabled',
          url: '/seasons-enabled',
          icon: 'cog'
        },
        {
          title: 'Habilitar campos comerciales',
          id: 'commercial-fields',
          url: '/commercial-fields',
          icon: 'cog'
        },
        {
          title: 'Marcas habilitadas recepción sin pedido',
          id: 'brands-enabled-reception',
          url: '/brands-enabled-reception',
          icon: 'cog'
        },
        {
          title: 'Incidencias',
          id: 'incidences-reception',
          url: '/incidences-reception',
          icon: 'notifications'
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
      title: 'Drop Files',
      id: 'drop-file',
      url: '/drop-files',
      icon: 'folder'
    },
    {
      title: 'Pedidos Online',
      open: false,
      type: 'wrapper',
      icon: 'build',
      children: [
        {
          title: 'Incidencias',
          id: 'expedition-manual',
          url: '/expedition-manual',
          icon: 'cog',
          tooltip: 'Lista de incidencias'
        },
        {
          title: 'Expediciones por recoger',
          id: 'expedition-collected',
          url: '/expedition-collected',
          icon: 'cog',
          tooltip: 'Lista de expediciones por recoger'
        },
        {
          title: 'Desbloquear expediciones',
          id: 'unlock-expeditions',
          url: '/unlock-expeditions',
          icon: 'unlock',
          tooltip: 'Desbloquear expediciones'
        },
        {
          title: 'Ordenes de transportes',
          id: 'package',
          url: '/transport-orders',
          icon: 'car',
          tooltip: 'Ordenes'
        },
        {
          title: 'Transportes de expediciones',
          id: 'transports',
          url: '/transports',
          icon: 'bus',
          tooltip: 'Transportes de expediciones'
        },
        {
          title: 'Pedidos Internos',
          id: 'expedition-inside',
          url: '/expedition-inside',
          icon: 'folder'
        },
      ]
    },
  ];

  alPages: MenuItemList = [
/*    {
      title: 'Registro horario',
      id: 'user-time',
      url: '/user-time',
      icon: 'time',
      tooltip: 'Registrar hora de entrada y salida'
    },*/
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
          icon: 'basket',
          tooltip: 'Listado de productos'
        },
        {
          title: 'Consulta',
          id: 'products-info',
          url: 'products/info',
          icon: 'information-circle',
          tooltip: 'Consulta Stock de artículos mediante el escáner'
        },
        {
          title: 'Productos recibidos',
          id: 'print-products-received',
          url: '/print/product/received',
          icon: 'archive',
          tooltip: 'Listado de todos los productos recibidos'
        },
        {
          title: 'Productos solicitados',
          id: 'received-products-requested',
          url: '/requested-products',
          icon: 'archive',
          tooltip: 'Listado de todos los productos solicitados que se han recibido'
        },
        {
          title: 'Productos no aptos online',
          id: 'unfit-online-products',
          url: '/unfit-online-products',
          icon: 'archive',
          tooltip: 'Listado de productos no aptos online'
        },
        {
          title: 'Reetiquetado productos',
          id: 'print-product',
          url: 'print/product/relabel',
          icon: 'barcode',
          tooltip: 'Imprimir nuevas etiquetas de productos con cámara'
        },
        {
          title: 'Reetiquetado productos manual',
          id: 'print-product-manual',
          url: '/print/product/relabel',
          icon: 'barcode',
          tooltip: 'Imprimir nuevas etiquetas de productos introduciendo el código manualmente'
        }
      ]
    },
    {
      title: 'Pedidos online',
      icon: 'basket',
      type: 'wrapper',
      open: true,
      children: [
        {
          title: 'Generar etiquetas de envio',
          id: 'order-preparation',
          url: '/order-preparation',
          icon: 'basket',
          tooltip: 'Imprimir etiquetas de contenedores'
        },
        {
          title: 'Incidencias',
          id: 'order-preparation',
          url: '/list-alerts',
          icon: 'notifications',
          tooltip: 'listado de incidencias'
        },
        {
          title: 'Órdenes no procesadas',
          id: 'order-no-processed',
          url: '/order-no-processed',
          icon: 'barcode',
          tooltip: 'Órdenes no procesadas'
        },

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
          notification: this.isNewTariff,
          tooltip: 'Listado de tarifas habilitadas'
        },
        {
          title: 'Código exposición',
          id: 'print-price-tag',
          url: 'print/tag/price',
          icon: 'pricetags',
          tooltip: 'Imprimir etiquetas de exposición escaneando los productos con cámara'
        },
        {
          title: 'Código exposición manual',
          id: 'print-price-tag-manual',
          url: '/print-tag/manual/price',
          icon: 'pricetags',
          tooltip: 'Impresión de códigos de exposición indicando manualmente el código de los productos y el motivo si fuese necesario'
        },
        {
          title: 'Nuevos Productos',
          id: 'new-products',
          url: '/new-products',
          icon: 'basket',
          tooltip: 'Listado de nuevos productos recibidos que aún no han sido impresos'
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
          title: 'Ubicar/escanear con cámara',
          id: 'positioning',
          icon: 'locate',
          url: 'positioning',
          tooltip: 'Escanear artículos mediante cámara para ubicar'
        },
        {
          title: 'Ubicar/escanear con láser',
          icon: 'locate',
          url: '/positioning/manual',
          id: 'positioning-manual',
          tooltip: 'Escanear artículos mediante láser para ubicar'
        },
/*        {
          title: 'Ubicar no aptos online',
          icon: 'locate',
          url: '/positioning/manual-online',
          id: 'positioning-manual-online',
          tooltip: 'Ubicar productos no aptos online'
        },*/
        {
          title: 'Traspasos',
          id: 'picking-task-store',
          icon: 'qr-scanner',
          url: '/picking-tasks',
          tooltip: 'Traspasos pendientes de realizar'
        },
        {
          title: 'Listado de peticiones',
          id: 'picking-tasks-stores',
          icon: 'qr-scanner',
          url: '/picking-tasks-stores',
          tooltip: 'Listado de peticiones pendientes de realizar',
          amount: this.pickingTasksStoresAmount
        },
        {
          title: 'Asociar pares a embalajes',
          id: 'picking-scan-packing',
          icon: 'qr-scanner',
          url: '/picking-scan-packing',
          tooltip: 'Asociar pares procesados para traspasos a embalajes y precintarlos'
        },
        {
          title: 'Ubicar defectuosos',
          id: 'defective-positioning',
          icon: 'warning',
          url: 'defective-positioning',
          tooltip: 'Escanear artículos defectuosos mediante cámara para ubicar'
        },
        {
          title: 'Tareas de Picking',
          id: 'picking-task',
          icon: 'qr-scanner',
          url: '/picking-tasks',
          tooltip: 'Tareas de picking asignadas'
        },
        {
          title: 'Verificación de artículos',
          icon: 'checkmark-circle-outline',
          url: '/picking/online-store/verify',
          id: 'verification-products-online',
          tooltip: 'Sección para verificar los artículos aptos online'
        },
        {
          title: 'Gestión de almacén',
          id: 'warehouses-management',
          url: '/warehouse/manage',
          icon: 'apps',
          tooltip: ''
        },
        {
          title: 'Recepcionar embalaje',
          id: 'reception',
          url: 'reception',
          icon: 'archive',
          tooltip: 'Recepcionar embalaje completo escaneando la etiqueta con cámara'
        },
        {
          title: 'Recepcionar par a par',
          id: 'empty-carrier',
          url: 'reception/empty-carrier',
          icon: 'square-outline',
          tooltip: 'Recepcionar par a par los artículos recibidos escanéandolos con la cámara'
        },
        {
          title: 'Embalajes',
          id: 'jails',
          url: '/jails/menu',
          icon: 'grid',
          tooltip: 'Listado de embalajes'
        },
        {
          title: 'Reetiquetado embalajes',
          id: 'print-packing',
          url: '/print/packing',
          icon: 'grid',
          tooltip: 'Imprimir nuevas etiquetas de embalajes'
        },
        {
          title: 'Precintar embalaje con cámara',
          id: 'packing-seal',
          url: 'packing/seal',
          icon: 'paper-plane',
          tooltip: 'Precintar embalaje para enviar desde el escáner de la cámara'
        },
        {
          title: 'Precintar embalaje con láser',
          id: 'packing-seal-manual',
          url: '/packing/seal/manual',
          icon: 'paper-plane',
          tooltip: 'Precintar embalaje para enviar desde el láser'
        },
        {
          title: 'Traspaso contenido embalaje',
          id: 'packing-transfer',
          url: '/packing/transfer',
          icon: 'redo',
          tooltip: 'Traspasar toda la mercancía de un embalaje a otro'
        },
        {
          title: 'Recepción de embalaje vacío',
          id: 'reception-empty-packing',
          url: '/packing/carrierEmptyPacking',
          icon: 'exit',
          tooltip: 'Recibir embalajes que han sido enviados vacíos'
        },
        {
          title: 'Envío de embalaje vacío',
          id: 'send-empty-packing',
          url: '/sendEmptyPacking',
          icon: 'send',
          tooltip: 'Enviar embalajes vacíos a otro destino'
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
          icon: 'swap',
          tooltip: 'Escanear embalaje para obtener información sobre el traspaso y seleccionar la opción a realizar'
        },
        {
          title: 'Ventilación sin Sorter',
          id: 'ventilation-no-sorter',
          url: '/ventilation-no-sorter',
          icon: 'aperture',
          tooltip: 'Realizar ventilación asignando a embalajes'
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
          icon: 'log-in',
          tooltip: 'Escanear artículos con entrada en sorter'
        },
        {
          title: 'Salida',
          id: 'sorter-output',
          url: '/sorter/output',
          icon: 'log-out',
          tooltip: 'Vaciado de calles'
        }
      ]
    },
    {
      title: 'Control de embalajes',
      open: false,
      type: 'wrapper',
      icon: 'ribbon',
      children: [
        {
          title: 'Lista Control Embalajes',
          id: 'audit-al',
          url: '/audits',
          icon: 'list-box',
          tooltip: 'Listado de controles de embalajes realizados'
        },
        {
          title: 'Revisiones Pendientes',
          id: 'audit-rv',
          url: '/audits/pending-revisions',
          icon: 'list-box',
          tooltip: 'Listado de revisiones de embalajes pendientes de realizar'
        },
        {
          title: 'Escaneo total (láser)',
          id: 'add-audits',
          url: '/audits/add',
          icon: 'qr-scanner',
          tooltip: 'Auditoría de embalaje mediante láser escaeando todos los productos'
        },
        {
          title: 'Escaneo aleatorio (cámara)',
          id: 'audit-scan',
          url: 'audits/scan',
          icon: 'aperture',
          tooltip: 'Auditoría mediante escáner de la cámara sin necesidad de escaner todos los productos'
        }
      ]
    },
    {
      title: 'Recepción de fábrica',
      open: false,
      type: 'wrapper',
      icon: 'archive',
      children: [
        {
          title: 'Recepción de mercancía',
          id: 'expeditions-pending',
          url: '/expeditions/pending/app',
          icon: 'pricetags',
          tooltip: 'Realiza la recepción de mercancía recibida de fábrica mediante una expedición o proveedor.'
        },
        {
          title: 'Recepción sin pedido',
          id: 'receptions-avelon-free',
          url: '/expeditions/pending/app/free',
          icon: 'pricetags',
          tooltip: 'Realiza la recepción de mercancía recibida de fábrica mediante una expedición o proveedor sin necesidad de que esta mercancía esté asignada a un pedido.'
        }
      ]
    },
    {
      id: 'incidents',
      title: 'Defectuosos',
      icon: 'warning',
      url: '/defect-handler'
    },
    {
      title: 'Configuración',
      open: false,
      type: 'wrapper',
      icon: 'build',
      children: [
        {
          title: 'Código impresora',
          id: 'settings',
          url: '/settings',
          icon: 'cog',
          tooltip: 'Mac de la impresora'
        }
      ]
    }


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
      this.zona.run(() => {
        setInterval(() => {
          this.newTariffs();
          this.getPickingTasksStoresAmount();
        }, 5 * 60 * 1000);
      });
    }
    let logoutItem = ({
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
      this.checkAlertsAndRedirect();
    } else if (p.url === 'audits/scan') {
      this.auditMultipleScanditService.init();
    }
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
              this.receptionScanditService.reception(2);
            });
            await popover.present();
          } else {
            this.receptionScanditService.reception(2);
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
      this.printTagsScanditService.printTagsReferences();
    } else if (p.url === 'print/tag/price') {
      this.printTagsScanditService.printTagsPrices();
    } else if (p.url === 'packing/seal') {
      this.sealScanditService.seal();
    } else if (p.url === 'reception') {
      this.receptionScanditService.reception(1);
    } else if (p.url == 'reception/empty-carrier') {
      this.checkAlertsAndRedirect();
    } else if (p.url == 'print/product/relabel') {
      this.printTagsScanditService.printRelabelProducts();
    } else if (p.url == 'products/info') {
      this.productInfoScanditService.init();
    } else if (p.url === 'positioning') {
      this.scanditService.positioning();
    } else if (p.url === 'defective-positioning'){
      this.scanditService.defectivePositioning();
    } else if (p.url === 'audits/scan') {
      this.auditMultipleScanditService.init();
    } else {
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
  async newTariffs() {
    const currentWarehouse: Warehouse = await this.authenticationService.getStoreCurrentUser();
    if(currentWarehouse){
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
  }

  async getPickingTasksStoresAmount(){
    const currentWarehouse: Warehouse = await this.authenticationService.getStoreCurrentUser();
    if(currentWarehouse){
      this.pickingStoreService.getLineRequestsStoreOnlineAmount().then(response => {
        if(response.code == 200){
          for(let page of this.alPages){
            if(page.children){
              for(let child of page.children){
                if(child.amount || child.amount == 0){
                  child.amount = response.data;
                  return;
                }
              }
            }
          }
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
