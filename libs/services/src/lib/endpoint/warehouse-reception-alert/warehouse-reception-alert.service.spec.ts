import { TestBed } from '@angular/core/testing';
import { WarehouseReceptionAlertService } from './warehouse-reception-alert.service';

describe('WarehouseReceptionAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WarehouseReceptionAlertService = TestBed.get(WarehouseReceptionAlertService);
    expect(service).toBeTruthy();
  });
});
