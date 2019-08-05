import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRelabelPackingComponent } from './print-relabel-packing.component';

describe('PrintRelabelPackingComponent', () => {
  let component: PrintRelabelPackingComponent;
  let fixture: ComponentFixture<PrintRelabelPackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintRelabelPackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRelabelPackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
