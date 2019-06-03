import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserAssignmentTemplateComponent } from './list.component';

describe('ListUserAssignmentTemplateComponent', () => {
  let component: ListUserAssignmentTemplateComponent;
  let fixture: ComponentFixture<ListUserAssignmentTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUserAssignmentTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserAssignmentTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
