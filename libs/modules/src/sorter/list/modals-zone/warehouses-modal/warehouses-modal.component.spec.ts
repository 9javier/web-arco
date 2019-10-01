import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousesModalComponent } from './warehouses-modal.component';

describe('WarehousesModalComponent', () => {
  let component: WarehousesModalComponent;
  let fixture: ComponentFixture<WarehousesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehousesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehousesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
