import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStoresPickingTasksTemplateComponent } from './list-stores.component';

describe('ListStoresPickingTasksTemplateComponent', () => {
  let component: ListStoresPickingTasksTemplateComponent;
  let fixture: ComponentFixture<ListStoresPickingTasksTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStoresPickingTasksTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStoresPickingTasksTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
