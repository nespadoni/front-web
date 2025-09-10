import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Tournament} from '../interfaces/tournament.interface';
import {TournamentCardComponent} from '../tournament-card/tournament-card';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [CommonModule, TournamentCardComponent],
  templateUrl: './tournament-list.html',
  styleUrl: './tournament-list.scss'
})
export class TournamentListComponent {
  @Input() tournaments: Tournament[] = [];
  @Output() clearFilters = new EventEmitter<void>();

  trackById(index: number, tournament: Tournament): number {
    return tournament.id;
  }
}
