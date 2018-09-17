import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceDetailsComponent } from './workspace-details.component';

describe('DashboardComponent', () => {
  let component: WorkspaceDetailsComponent;
  let fixture: ComponentFixture<WorkspaceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [
    ],
      declarations: [
          WorkspaceDetailsComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
