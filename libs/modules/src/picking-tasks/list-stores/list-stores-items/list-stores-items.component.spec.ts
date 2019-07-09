import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresPickingTaskTemplateComponent } from './list-stores-items.component';

describe('StoresPickingTaskTemplateComponent', () => {
  let component: StoresPickingTaskTemplateComponent;
  let fixture: ComponentFixture<StoresPickingTaskTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoresPickingTaskTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoresPickingTaskTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
