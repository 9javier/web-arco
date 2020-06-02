export * from './lib/services.module';

/** Authentication */
export * from './lib/endpoint/authentication/authentication.service';
/** OAuth */
export * from './models/endpoints/OAuth2';
export * from './lib/endpoint/oauth2/oauth2.service';
/** Permissions */
export * from './models/endpoints/Permissions';
export * from './lib/endpoint/permissions/permissions.service';

/**User processes */
export * from './models/endpoints/UsersProcesses';
export * from './lib/endpoint/user-processes/user-processes.service';

/**Interceptor token */
export * from './lib/interceptors/addTokenToRequestInterceptor';

/**Warehouse maps */
export * from './models/endpoints/warehouse-maps';
export * from './lib/endpoint/warehouse-maps/warehouse-maps.service';

/**Warehouse group */
export * from './models/endpoints/warehouse-group';
export * from './lib/endpoint/warehouse-group/warehouse-group.service';

/**Types service */
export * from './models/endpoints/Type';
export * from './lib/endpoint/types/types.service';

/** Users */
export * from './models/endpoints/User';
export * from './lib/endpoint/users/users.service';

/** Group */
export * from './models/endpoints/Group';
export * from './lib/endpoint/groups/groups.service';

/** Warehouse */
export * from './models/endpoints/Warehouse';
export * from './lib/endpoint/warehouse/warehouse.service';
export * from './lib/endpoint/warehouses/warehouses.service';

/** Roles */
export * from './models/endpoints/Rol';
export * from './lib/endpoint/roles/roles.service';

/** Jail */
export * from './models/endpoints/Jail';

/** Product */
export * from './models/endpoints/Product';
export * from './lib/endpoint/products/products.service';

/** Model */
export * from './models/endpoints/Model';

/** Size */
export * from './models/endpoints/Size';

/** Process */
export * from './models/endpoints/Process';
export * from './lib/endpoint/processes/processes.service';

/** ACL */
export * from './models/endpoints/ACL';
export * from './lib/endpoint/acl/acl.service';

/** UserProcesses*/
export * from './models/endpoints/UserProcesses';

/** Filters */
export * from './models/endpoints/filters';
export * from './lib/endpoint/inventory/filters/filters.service';

/** Inventory */
export * from './models/endpoints/Inventory';
export * from './lib/endpoint/inventory/inventory.service';

/**Intermediary */
export * from './lib/endpoint/intermediary/intermediary.service';

/**Labels */
export * from './lib/endpoint/labels/labels.service';

/**environments */
export * from './environments/environment';

/**Tariff */
export * from './models/endpoints/Tariff';
export * from './lib/endpoint/tariff/tariff.service';

/**Prices */
export * from './models/endpoints/Price';
export * from './lib/endpoint/price/price.service';

/**New Product */
export * from './models/endpoints/NewProduct';
export * from './lib/endpoint/new-products/new-products.service';

/**Enum */
export * from './models/enum.model';

/**Building */
export * from './models/endpoints/building.model';
export * from './lib/endpoint/building/building.service';

/**Calendar */
export * from './models/endpoints/calendar.model';
export * from './lib/endpoint/calendar/calendar.service';

/**Group warehouse picking */
export * from './lib/endpoint/group-warehouse-picking/group-warehouse-picking.service';
export * from './models/endpoints/group-warehouse-model';

/**Carrier */
export * from './lib/endpoint/carrier/carrier.service';
export * from './models/endpoints/calendar.model';

/**User time */
export * from './lib/endpoint/user-time/user-time.service';
export * from './models/endpoints/user-time.model';

/**Agency */
export * from './lib/endpoint/agency/agency.service';
export * from './models/endpoints/agency.model';

/**Auditorias */
export * from './lib/endpoint/audits/audits.service';
//export * from './models/endpoints/audits.model';

/**Global variables */
 export * from './lib/endpoint/global-variable/global-variable.service';
 export * from './models/endpoints/global-variable.model';

 /**Postal Codes */
// export * from './lib/endpoint/postal-code/postal-code.service';
export * from './models/endpoints/postal-code.model';

 /**Province  */
 export * from './lib/endpoint/province/province.service';
 export * from './models/endpoints/province.model';

  /**Countries */
export * from './lib/endpoint/country/country.service';
export * from './models/endpoints/country.model';

 /**Regions */
 export * from './lib/endpoint/region/region.service';
 export * from './models/endpoints/regions.model';

/**Reception avelon */
  export * from './lib/endpoint/receptions-avelon/receptions-avelon.service';
  export * from './models/endpoints/receptions-avelon.model';

//incidents
export * from './models/endpoints/incidents.model'
export * from './lib/endpoint/incidents/incidents.service';

// uploas file
export * from './lib/endpoint/ulpload-files/upload-files.service';

// opl-transports

export * from  './lib/endpoint/opl-transports/opl-transports.service'
export * from './models/endpoints/opl-transports.model'


//opl-expeditions
export * from './lib/endpoint/expedition/expedition.service'

//package-received
export * from './lib/endpoint/package-received/package-received.service'

//package-history
export * from './lib/endpoint/package-history/package-history.service'


