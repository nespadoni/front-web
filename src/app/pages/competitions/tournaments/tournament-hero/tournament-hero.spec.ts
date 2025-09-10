import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TournamentHeroComponent} from './tournament-hero.component';

describe('TournamentHeroComponent', () => {
  let component: TournamentHeroComponent;
  let fixture: ComponentFixture<TournamentHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentHeroComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TournamentHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
