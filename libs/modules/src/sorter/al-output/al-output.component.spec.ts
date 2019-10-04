import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlOutputSorterComponent } from './al-output.component';

describe('AlOutputSorterComponent', () => {
  let component: AlOutputSorterComponent;
  let fixture: ComponentFixture<AlOutputSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlOutputSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlOutputSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
