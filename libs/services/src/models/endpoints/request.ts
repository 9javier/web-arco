export namespace Request{
    
    export interface Success {
        message: string;
        code: number;
        errors: any;
    }
    
      export interface Error {
        errors: string;
        message: string;
        code: number;
      }
}

