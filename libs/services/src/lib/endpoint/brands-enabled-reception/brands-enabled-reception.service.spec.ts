import { TestBed } from '@angular/core/testing';

import { BrandsEnabledReceptionService } from './brands-enabled-reception.service';

describe('BrandsEnabledReceptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrandsEnabledReceptionService = TestBed.get(BrandsEnabledReceptionService);
    expect(service).toBeTruthy();
  });
});
