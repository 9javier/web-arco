import { TestBed } from '@angular/core/testing';

import { CarriersService } from './carriers.service';

describe('CarriersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CarriersService = TestBed.get(CarriersService);
    expect(service).toBeTruthy();
  });
});
