import { MatPaginatorIntl } from '@angular/material';

export function PaginatorLanguageComponent() {
  const customPaginatorIntl = new MatPaginatorIntl();
  
  customPaginatorIntl.itemsPerPageLabel = 'Elementos por página:';
  customPaginatorIntl.nextPageLabel     = 'Página siguiente:';
  customPaginatorIntl.previousPageLabel = 'Página anterior:';
  customPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const of = 'de';
    if (length === 0 || pageSize === 0) {
      return '0 ' + of + ' ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = ((page * pageSize) > length) ?
      (Math.ceil(length / pageSize) - 1) * pageSize:
      page * pageSize;

    const endIndex = Math.min(startIndex + pageSize, length);
    return startIndex + 1 + ' - ' + endIndex + ' ' + of + ' ' + length;
  };

  return customPaginatorIntl;
}
