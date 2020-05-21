import { TestBed } from '@angular/core/testing';

import { OplTransportExpeditionService } from './opl-transport-expedition.service';

describe('OplExpeditionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OplTransportExpeditionService = TestBed.get(OplTransportExpeditionService);
    expect(service).toBeTruthy();
  });
});
