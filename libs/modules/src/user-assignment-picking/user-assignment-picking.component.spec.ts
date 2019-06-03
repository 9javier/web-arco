import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssignmentPickingComponent } from './user-assignment-picking.component';

describe('UserAssignmentPickingComponent', () => {
  let component: UserAssignmentPickingComponent;
  let fixture: ComponentFixture<UserAssignmentPickingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAssignmentPickingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAssignmentPickingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
