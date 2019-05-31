export namespace Request{
    
    export interface Success {
        message: string;
        code: number;
        errors: any;
    }

    export interface Paginator{
        page: number,
        limit: number,
        totalResults: number
    }
    
      export interface Error {
        errors: string;
        message: string;
        code: number;
      }
}

