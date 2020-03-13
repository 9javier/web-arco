import { TestBed } from '@angular/core/testing';

import { InternalGroupsEnabledService } from './internal-groups-enabled.service';

describe('InternalGroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InternalGroupsEnabledService = TestBed.get(InternalGroupsEnabledService);
    expect(service).toBeTruthy();
  });
});
