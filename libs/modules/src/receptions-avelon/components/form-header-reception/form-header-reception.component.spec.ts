import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHeaderReceptionComponent } from './form-header-reception.component';

describe('FormHeaderReceptionComponent', () => {
  let component: FormHeaderReceptionComponent;
  let fixture: ComponentFixture<FormHeaderReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormHeaderReceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHeaderReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
