import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickingTasksStoresComponent } from './picking-tasks-stores.component';

describe('PickingTasksStoresComponent', () => {
  let component: PickingTasksStoresComponent;
  let fixture: ComponentFixture<PickingTasksStoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickingTasksStoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingTasksStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
