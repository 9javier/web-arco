import { MatPaginatorIntl } from '@angular/material';

export function PaginatorLanguageComponent() {
  const customPaginatorIntl = new MatPaginatorIntl();
  
  customPaginatorIntl.itemsPerPageLabel = 'Elementos por página:';

  return customPaginatorIntl;
}