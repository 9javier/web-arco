import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRelabelProductManualComponent } from './print-relabel-product-manual.component';

describe('PrintRelabelProductManualComponent', () => {
  let component: PrintRelabelProductManualComponent;
  let fixture: ComponentFixture<PrintRelabelProductManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrintRelabelProductManualComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRelabelProductManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
