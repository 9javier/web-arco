import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickingTaskTemplateComponent } from './list-items.component';

describe('PickingTaskTemplateComponent', () => {
  let component: PickingTaskTemplateComponent;
  let fixture: ComponentFixture<PickingTaskTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickingTaskTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingTaskTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
