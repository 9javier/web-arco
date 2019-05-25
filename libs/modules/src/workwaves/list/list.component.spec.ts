import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkwavesComponent } from './list.component';

describe('ListWorkwavesComponent', () => {
  let component: ListWorkwavesComponent;
  let fixture: ComponentFixture<ListWorkwavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWorkwavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkwavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
