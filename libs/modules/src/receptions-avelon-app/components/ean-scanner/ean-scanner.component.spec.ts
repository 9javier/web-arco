import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EanScannerComponent } from './ean-scanner.component';

describe('EanScannerComponent', () => {
  let component: EanScannerComponent;
  let fixture: ComponentFixture<EanScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EanScannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EanScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
