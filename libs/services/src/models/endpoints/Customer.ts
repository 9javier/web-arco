export namespace CustomerModel {

  export interface Customer {
    customerId: number,
    uuid: string,
    firstName: String,
    middleName: String,
    surname: String,
    secondSurname:String,
    companyName:String,
    identityDocument: String,
    gender: String,
    birthday: null,
    languagePreferenceIsoCode:String,
  }

  export interface CustomerAddress{
    id: number,
    kind: String,
    addressAlias?: String,
    firstName: String,
    middleName: String,
    surname: String,
    secondSurname: String,
    companyName?: String,
    identityDocument: String,
    addressLine: String,
    addressExtraLine: String,
    postCode: String,
    city: String,
    state: String,
    countryOriginalName: String,
    countryIsoCode?: String
  }
  export interface CustomerEmail{
    id: number
    uuid: String,
    address: String,
  }
  export interface CreateCustomerEmail{
    address: String,
    kind: String,
    alias: any
  }
  
}
