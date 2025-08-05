import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamManagement } from './team-management';

describe('TeamManagement', () => {
  let component: TeamManagement;
  let fixture: ComponentFixture<TeamManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
