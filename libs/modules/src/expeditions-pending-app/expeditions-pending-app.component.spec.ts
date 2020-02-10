import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionsPendingAppComponent } from './expeditions-pending-app.component';

describe('ExpeditionsPendingAppComponent', () => {
  let component: ExpeditionsPendingAppComponent;
  let fixture: ComponentFixture<ExpeditionsPendingAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpeditionsPendingAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpeditionsPendingAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
