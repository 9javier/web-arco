import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionHideAlertComponent } from './reception-hide-alert.component';

describe('ReceptionHideAlertComponent', () => {
  let component: ReceptionHideAlertComponent;
  let fixture: ComponentFixture<ReceptionHideAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionHideAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionHideAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
