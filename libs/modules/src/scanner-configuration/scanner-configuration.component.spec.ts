import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerConfigurationComponent } from './scanner-configuration.component';

describe('ScannerConfigurationComponent', () => {
  let component: ScannerConfigurationComponent;
  let fixture: ComponentFixture<ScannerConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScannerConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannerConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
