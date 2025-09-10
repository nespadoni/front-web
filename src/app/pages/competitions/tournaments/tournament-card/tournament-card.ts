import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Tournament} from '../interfaces/tournament.interface';

@Component({
  selector: 'app-tournament-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tournament-card.html',
  styleUrl: './tournament-card.scss'
})
export class TournamentCardComponent {
  @Input() tournament!: Tournament;

  getStatusText(): string {
    switch (this.tournament.status) {
      case 'upcoming':
        return 'EM BREVE';
      case 'active':
        return 'ATIVO';
      case 'finished':
        return 'FINALIZADO';
      default:
        return '';
    }
  }

  formatDateRange(): string {
    const start = this.tournament.startDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
    const end = this.tournament.endDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return `${start} - ${end}`;
  }
}
