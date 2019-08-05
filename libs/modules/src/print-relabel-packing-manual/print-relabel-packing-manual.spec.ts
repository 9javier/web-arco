import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRelabelPackingManualComponent } from './print-relabel-packing-manual.component';

describe('PrintRelabelPackingManualComponent', () => {
  let component: PrintRelabelPackingManualComponent;
  let fixture: ComponentFixture<PrintRelabelPackingManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrintRelabelPackingManualComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRelabelPackingManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
