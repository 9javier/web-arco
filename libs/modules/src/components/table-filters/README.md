# Table Component Documentation

Table Component with filters and dynamic functions.
------------------------------------------------------
# Usage
=> HTLM
<suite-table-filters

[columnsData]="columnsData" 
[dataSource]="dataSource" 
[filters]="true"
[filtersData]="filtersData"
(emitMain)="emitMain($event)">

 </suite-table-filters>

# ----------------------------------------------------
 => Component.TS
  **Example**

 this.columnsData =[
    {
      name: 'name',
      title:'Nombre',
      field: 'name',
      filters:true
    },
    {
      name: 'product',
      title:'Nombre',
      field: 'name',
      filters:false
    }
    ];
    this.filtersData[
      {
        name:[{id:1,name: "DHL"},{id:2, name:"SEUR"}],
        product:[{id:1,name: "Book"},{id:2, name:"Pencil"}],
      }
    ];
    /*You must need add dataSource to componente*/
    this.dataSource =[];
# ----------------------------------------------------
# COMPONENT.TS
emitMain(e) {
    switch (e.event) {
      case TableEmitter.BtnAdd:
        /**Add function*/
        console.log("Agregar");
        break;
      case TableEmitter.BtnExcell:
        /** Excell download Function*/
        break;
      case TableEmitter.BtnSend:
        /**Send function */
        let selectSend = e.value;
        
        break;
      case TableEmitter.BtnRefresh:
        /**Refresh funtion*/
        break;
      case TableEmitter.BtnDelete:
        /**Delete funtion */
        let selecDelete = e.value;
        break;
      case TableEmitter.Checkbox:
        let selectCheckbox = e.value;
        break;
        case TableEmitter.OpenRow:
        let row = e.value;
        console.log(row);
        break;
      case TableEmitter.Filters:
        let entity = e.value.entityName;
        let filters = e.value.filters;
        break;
      case TableEmitter.Pagination:
        let pagination = e.value;
        break;
      case TableEmitter.Sorter:
        let orderby = e.value;
        break;
    }
## Properties
  **HTML**  
  -> Button refresh.
  <suite-table-filters [btnRefresh] ="true"></suite-table-filters>
   
  -> Button add.
   <suite-table-filters [btnAdd]="true"></suite-table-filters>

  -> Button delete.
   <suite-table-filters [btnDelete]="true"></suite-table-filters>

  **Component.TS**

-------------------------------------------------------

