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
