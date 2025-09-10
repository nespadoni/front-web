import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarMatch} from '../interfaces/calendar.interface';

@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-card.html',
  styleUrl: './match-card.scss'
})
export class MatchCardComponent {
  @Input() match!: CalendarMatch;
  @Input() variant: 'full' | 'compact' | 'mini' = 'full';
  @Output() matchClick = new EventEmitter<CalendarMatch>();

  onMatchClick(): void {
    this.matchClick.emit(this.match);
  }

  getStatusClass(): string {
    switch (this.match.status) {
      case 'live':
        return 'status-live';
      case 'scheduled':
        return 'status-scheduled';
      case 'finished':
        return 'status-finished';
      case 'postponed':
        return 'status-postponed';
      default:
        return '';
    }
  }

  getStatusText(): string {
    switch (this.match.status) {
      case 'live':
        return 'AO VIVO';
      case 'scheduled':
        return 'AGENDADO';
      case 'finished':
        return 'FINALIZADO';
      case 'postponed':
        return 'ADIADO';
      default:
        // CORREÇÃO: Tipo mais específico para status
        return (this.match.status as string).toUpperCase();
    }
  }

  getPriorityClass(): string {
    switch (this.match.priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  }

  formatTime(): string {
    return this.match.date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDate(): string {
    return this.match.date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  }
}
