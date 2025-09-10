import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-tournament-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tournament-filters.html',
  styleUrl: './tournament-filters.scss'
})
export class TournamentFiltersComponent {
  @Output() filtersChanged = new EventEmitter<any>();
  @Output() totalResultsChanged = new EventEmitter<number>();

  selectedSport = 0;
  selectedUniversity = 0;
  selectedStatus = 'all';
  totalResults = 0;

  sports = [
    {id: 0, name: 'Todos os Esportes'},
    {id: 1, name: 'Futebol'},
    {id: 2, name: 'Basquete'},
    {id: 3, name: 'Vôlei'},
    {id: 4, name: 'Tênis'}
  ];

  universities = [
    {id: 0, name: 'Todas as Universidades'},
    {id: 1, name: 'USP'},
    {id: 2, name: 'UNIC'},
    {id: 3, name: 'UNICAMP'},
    {id: 4, name: 'UNESP'}
  ];

  statusOptions = [
    {value: 'all', label: 'Todos os Status'},
    {value: 'upcoming', label: 'Em Breve'},
    {value: 'active', label: 'Ativo'},
    {value: 'finished', label: 'Finalizado'}
  ];

  onSportChange(sportId: number) {
    this.selectedSport = sportId;
    this.emitFilters();
  }

  onUniversityChange(universityId: number) {
    this.selectedUniversity = universityId;
    this.emitFilters();
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.emitFilters();
  }

  clearFilters() {
    this.selectedSport = 0;
    this.selectedUniversity = 0;
    this.selectedStatus = 'all';
    this.emitFilters();
  }

  updateTotalResults(count: number) {
    this.totalResults = count;
  }

  private emitFilters() {
    this.filtersChanged.emit({
      sport: this.selectedSport,
      university: this.selectedUniversity,
      status: this.selectedStatus
    });
  }
}
