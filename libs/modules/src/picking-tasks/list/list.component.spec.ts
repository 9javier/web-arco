import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPickingTasksTemplateComponent } from './list.component';

describe('ListPickingTasksTemplateComponent', () => {
  let component: ListPickingTasksTemplateComponent;
  let fixture: ComponentFixture<ListPickingTasksTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPickingTasksTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPickingTasksTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
