import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Tournament} from '../interfaces/tournament.interface';

@Component({
  selector: 'app-tournament-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tournament-hero.html',
  styleUrl: './tournament-hero.scss'
})
export class TournamentHeroComponent {
  @Input() featuredTournament: Tournament | null = null;
  @Input() tournaments: Tournament[] = [];

  getTotalTournaments(): number {
    return this.tournaments.filter(t => t.status === 'active').length;
  }

  getTotalParticipants(): number {
    return this.tournaments.reduce((total, t) => total + t.participants, 0);
  }

  getActiveSports(): number {
    const uniqueSports = new Set(this.tournaments.map(t => t.sport));
    return uniqueSports.size;
  }
}
