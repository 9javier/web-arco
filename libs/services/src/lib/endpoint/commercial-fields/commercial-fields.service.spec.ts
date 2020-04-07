import { TestBed } from '@angular/core/testing';

import { CommercialFieldsService } from './commercial-fields.service';

describe('CommercialFieldsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommercialFieldsService = TestBed.get(CommercialFieldsService);
    expect(service).toBeTruthy();
  });
});
