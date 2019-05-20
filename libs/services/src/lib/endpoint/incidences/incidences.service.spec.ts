import { TestBed } from '@angular/core/testing';

import { IncidencesService } from './incidences.service';

describe('IncidencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncidencesService = TestBed.get(IncidencesService);
    expect(service).toBeTruthy();
  });
});
