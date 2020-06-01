import { TestBed } from '@angular/core/testing';

import { ReturnTypesService } from './return-types.service';

describe('ReturnTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReturnTypesService = TestBed.get(ReturnTypesService);
    expect(service).toBeTruthy();
  });
});
