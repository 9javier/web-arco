import { TestBed } from '@angular/core/testing';

import { SorterExecutionService } from './sorter-execution.service';

describe('SorterExecutionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SorterExecutionService = TestBed.get(SorterExecutionService);
    expect(service).toBeTruthy();
  });
});
