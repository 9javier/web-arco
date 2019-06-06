import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionToRolComponent } from './permission-to-rol.component';

describe('PermissionToRolComponent', () => {
  let component: PermissionToRolComponent;
  let fixture: ComponentFixture<PermissionToRolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionToRolComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionToRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
