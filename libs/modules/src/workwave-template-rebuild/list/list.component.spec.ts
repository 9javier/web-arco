import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkwaveTemplateComponent } from './list.component';

describe('ListWorkwaveTemplateComponent', () => {
  let component: ListWorkwaveTemplateComponent;
  let fixture: ComponentFixture<ListWorkwaveTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWorkwaveTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkwaveTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
