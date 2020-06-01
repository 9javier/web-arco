import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersReplenishmentComponent } from './users-replenishment.component';

describe('UsersReplenishmentComponent', () => {
  let component: UsersReplenishmentComponent;
  let fixture: ComponentFixture<UsersReplenishmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersReplenishmentComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersReplenishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
