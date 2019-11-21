import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditsMobileComponent } from './audits-mobile.component';

describe('AuditsMobileComponent', () => {
  let component: AuditsMobileComponent;
  let fixture: ComponentFixture<AuditsMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditsMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditsMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
