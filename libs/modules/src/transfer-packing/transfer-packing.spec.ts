import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPackingComponent } from './transfer-packing.component';

describe('TransferPackingComponent', () => {
  let component: TransferPackingComponent;
  let fixture: ComponentFixture<TransferPackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransferPackingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
