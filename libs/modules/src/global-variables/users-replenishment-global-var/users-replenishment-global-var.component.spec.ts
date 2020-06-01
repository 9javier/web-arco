import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersReplenishmentGlobalVarComponent } from './users-replenishment-global-var.component';

describe('UsersReplenishmentGlobalVarComponent', () => {
  let component: UsersReplenishmentGlobalVarComponent;
  let fixture: ComponentFixture<UsersReplenishmentGlobalVarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersReplenishmentGlobalVarComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersReplenishmentGlobalVarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
