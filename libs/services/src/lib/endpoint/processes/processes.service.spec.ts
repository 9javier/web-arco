import { TestBed } from '@angular/core/testing';

import { ProcessesService } from './processes.service';

describe('ProcessesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessesService = TestBed.get(ProcessesService);
    expect(service).toBeTruthy();
  });
});
