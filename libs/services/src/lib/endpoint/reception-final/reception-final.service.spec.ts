import { TestBed } from '@angular/core/testing';

import { ReceptionFinalService } from './reception-final.service';

describe('NewProductsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReceptionFinalService = TestBed.get(ReceptionFinalService);
    expect(service).toBeTruthy();
  });
});
