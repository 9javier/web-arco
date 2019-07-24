import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPricesManualComponent } from './print-prices-manual.component';

describe('PrintPricesManualComponent', () => {
  let component: PrintPricesManualComponent;
  let fixture: ComponentFixture<PrintPricesManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrintPricesManualComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPricesManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
