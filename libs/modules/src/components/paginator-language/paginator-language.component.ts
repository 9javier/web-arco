import { MatPaginatorIntl } from '@angular/material';

export function PaginatorLanguageComponent() {
  const customPaginatorIntl = new MatPaginatorIntl();
  
  customPaginatorIntl.itemsPerPageLabel = 'Elementos por página:';
  customPaginatorIntl.nextPageLabel     = 'Página siguiente:';
  customPaginatorIntl.previousPageLabel = 'Página anterior:';

  return customPaginatorIntl;
}