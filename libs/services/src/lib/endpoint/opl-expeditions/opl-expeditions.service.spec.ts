import { TestBed } from '@angular/core/testing';

import { OplExpeditionsService } from './opl-expeditions.service';

describe('OplExpeditionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OplExpeditionsService = TestBed.get(OplExpeditionsService);
    expect(service).toBeTruthy();
  });
});
