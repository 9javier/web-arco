import { TestBed } from '@angular/core/testing';

import { DropFilesService } from './drop-files.service';

describe('NewProductsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DropFilesService = TestBed.get(DropFilesService);
    expect(service).toBeTruthy();
  });
});
