import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanFormComponent } from './kanban-form.component';

describe('KanbanFormComponent', () => {
  let component: KanbanFormComponent;
  let fixture: ComponentFixture<KanbanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KanbanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
