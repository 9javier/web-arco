export namespace OplTransportsModel {
    export interface OrderExpeditionFilters {
        orders: Array<ItemFilter>;
        warehouses: Array<ItemFilter>;
        expeditions: Array<ItemFilter>;
        transports: Array<ItemFilter>;
        orderTypes: Array<ItemFilter>;
    }
    export interface OrderExpeditionTransportsFilters {
        transports: Array<ItemFilter>;
    }
    export interface OrderExpeditionFilterRequest {
        expeditions: Array<number>;
        orders: Array<number>;
        date: Array<number>;
        warehouses: Array<number>;
        transports: Array<number>;
        orderby: {
            type: number,
            order: string
        },
        pagination: {
            page: number,
            limit: number
        }
    }
    export interface OrderExpeditionFilterResponse {
        filters: Array<ItemFilter>
        results: any
    }

    export interface ItemFilter {
        id: number;
        name: number | string
    }
}