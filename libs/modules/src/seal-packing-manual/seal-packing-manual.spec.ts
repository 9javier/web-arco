import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SealPackingManualComponent } from './seal-packing-manual.component';

describe('SealPackingManualComponent', () => {
  let component: SealPackingManualComponent;
  let fixture: ComponentFixture<SealPackingManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SealPackingManualComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SealPackingManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
