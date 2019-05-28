import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleListWorkwaveTemplateComponent } from './list-title.component';

describe('TitleListWorkwaveTemplateComponent', () => {
  let component: TitleListWorkwaveTemplateComponent;
  let fixture: ComponentFixture<TitleListWorkwaveTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleListWorkwaveTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleListWorkwaveTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
