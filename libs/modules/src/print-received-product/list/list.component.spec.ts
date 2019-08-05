import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReceivedProductTemplateComponent } from './list.component';

describe('ListReceivedProductTemplateComponent', () => {
  let component: ListReceivedProductTemplateComponent;
  let fixture: ComponentFixture<ListReceivedProductTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListReceivedProductTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReceivedProductTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
