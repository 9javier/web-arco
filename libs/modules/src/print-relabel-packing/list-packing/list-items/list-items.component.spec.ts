import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingRelabelTemplateComponent } from './list-items.component';

describe('PackingRelabelTemplateComponent', () => {
  let component: PackingRelabelTemplateComponent;
  let fixture: ComponentFixture<PackingRelabelTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingRelabelTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingRelabelTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
