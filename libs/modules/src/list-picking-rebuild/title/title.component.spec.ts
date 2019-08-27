import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitlePickingComponent } from './title.component';

describe('TitlePickingComponent', () => {
  let component: TitlePickingComponent;
  let fixture: ComponentFixture<TitlePickingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitlePickingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitlePickingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
