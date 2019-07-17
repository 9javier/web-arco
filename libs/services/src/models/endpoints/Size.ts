export namespace SizeModel {
  export interface Size{
    id?: number,
    reference: number|string,
    number: number|string,
    name: number|string,
    description?: string,
    datasetHash?: string,
    createdAt?: string,
    updatedAt?: string
  }

  export interface ResponseIndex {
    data: Size[];
  }

  export interface ErrorResponseIndex {
    statusCode: number;
    status: number;
    code: number;
    message: string;
    name: string;
  }
}
