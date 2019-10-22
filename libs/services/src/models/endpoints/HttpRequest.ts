export namespace HttpRequestModel {

  export interface Response {
    message?: string,
    code?: number,
    data?: any,
    error?: any,
    errors?: string
  }

  interface ApiError {
    code: number
    errors: string
    message: string
    result: any
    statusCode: number
    statusDescription: string
    statusMessage: string
  }

  export interface Error {
    error: ApiError
  }
}
