import { TestBed } from '@angular/core/testing';

import { IntermediaryService } from './intermediary.service';

describe('IntermediaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntermediaryService = TestBed.get(IntermediaryService);
    expect(service).toBeTruthy();
  });
});
