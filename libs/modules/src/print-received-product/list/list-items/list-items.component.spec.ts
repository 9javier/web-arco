import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedProductTemplateComponent } from './list-items.component';

describe('ReceivedProductTemplateComponent', () => {
  let component: ReceivedProductTemplateComponent;
  let fixture: ComponentFixture<ReceivedProductTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedProductTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedProductTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
