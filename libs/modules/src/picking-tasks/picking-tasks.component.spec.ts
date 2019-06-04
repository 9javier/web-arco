import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickingTasksComponent } from './picking-tasks.component';

describe('PickingTasksComponent', () => {
  let component: PickingTasksComponent;
  let fixture: ComponentFixture<PickingTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickingTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
