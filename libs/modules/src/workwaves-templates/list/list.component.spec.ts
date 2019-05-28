import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkwavesTemplatesComponent } from './list.component';

describe('ListWorkwavesTemplatesComponent', () => {
  let component: ListWorkwavesTemplatesComponent;
  let fixture: ComponentFixture<ListWorkwavesTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWorkwavesTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkwavesTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
