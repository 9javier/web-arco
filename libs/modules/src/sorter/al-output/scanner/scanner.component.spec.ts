import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerOutputSorterComponent } from './scanner.component';

describe('ScannerOutputSorterComponent', () => {
  let component: ScannerOutputSorterComponent;
  let fixture: ComponentFixture<ScannerOutputSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScannerOutputSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannerOutputSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
