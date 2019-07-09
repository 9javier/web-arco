import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresPickingTaskInitiatedTemplateComponent } from './list-stores-initiated.component';

describe('StoresPickingTaskInitiatedTemplateComponent', () => {
  let component: StoresPickingTaskInitiatedTemplateComponent;
  let fixture: ComponentFixture<StoresPickingTaskInitiatedTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoresPickingTaskInitiatedTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoresPickingTaskInitiatedTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
