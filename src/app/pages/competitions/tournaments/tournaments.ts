import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Tournament} from './interfaces/tournament.interface';
import {TournamentService} from './services/tournament.service';
import {TournamentHeroComponent} from './tournament-hero/tournament-hero';
import {TournamentFiltersComponent} from './tournament-filters/tournament-filters';
import {TournamentListComponent} from './tournament-list/tournament-list';

@Component({
  selector: 'app-tournaments',
  standalone: true,
  imports: [
    CommonModule,
    TournamentHeroComponent,
    TournamentFiltersComponent,
    TournamentListComponent
  ],
  templateUrl: './tournaments.html',
  styleUrl: './tournaments.scss'
})
export class TournamentsComponent implements OnInit {
  @ViewChild(TournamentFiltersComponent) filtersComponent!: TournamentFiltersComponent;

  tournaments: Tournament[] = [];
  filteredTournaments: Tournament[] = [];
  featuredTournament!: Tournament;
  currentFilters: any = {
    sport: 0,
    university: 0,
    status: 'all'
  };

  constructor(private tournamentService: TournamentService) {
  }

  ngOnInit() {
    this.loadTournaments();
  }

  onFiltersChanged(filters: any) {
    this.currentFilters = filters;
    this.applyFilters(filters);
  }

  onClearFilters() {
    this.currentFilters = {
      sport: 0,
      university: 0,
      status: 'all'
    };
    this.applyFilters(this.currentFilters);

    // Reset filters component
    if (this.filtersComponent) {
      this.filtersComponent.selectedSport = 0;
      this.filtersComponent.selectedUniversity = 0;
      this.filtersComponent.selectedStatus = 'all';
    }
  }

  private loadTournaments() {
    this.tournaments = this.tournamentService.getTournaments();
    this.featuredTournament = this.tournamentService.getFeaturedTournament();
    this.applyFilters(this.currentFilters);
  }

  private applyFilters(filters: any) {
    this.filteredTournaments = this.tournamentService.getFilteredTournaments(filters);

    // Update filters component with total count
    if (this.filtersComponent) {
      this.filtersComponent.updateTotalResults(this.filteredTournaments.length);
    }
  }
}
