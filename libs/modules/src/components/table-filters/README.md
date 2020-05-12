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

 this.columnsData = [
    {
      name: 'name',
      title:'Nombre',
      field: ['name'],
      filters:true,
      type:'text'
    },
    {
      name: 'logistic_internal',
      title:'Logistica interna',
      field: ['logistic_internal'],
      filters:true,
      type: 'checkbox'
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
        this.createTransport();
        break;
      case TableEmitter.BtnSend:
        /**Send function */
        let selectSend = e.value;
        console.log(selectSend);
        break;
      case TableEmitter.BtnRefresh:
        /**Refresh funtion*/
        this.refresh();
        break;
      case TableEmitter.Filters:
        let entity = e.value.entityName;
        let filters = e.value.filters;
        this.form.get(entity).patchValue(filters);
        this.getList(this.form);
        break;
      case TableEmitter.OpenRow:
        let row = e.value;
        console.log(row);
        this.openRow(row);
        break;
      case TableEmitter.Pagination:
        let pagination = e.value;
        this.form.value.pagination = pagination;
        this.getList(this.form);
        break;
      case TableEmitter.Sorter:
        let orderby = e.value;
        this.form.value.orderby = orderby;
        this.getList(this.form);
        break;
      case TableEmitter.BtnDelete:
        let select = e.value;
        this.delete(select);
        break;
    }

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

