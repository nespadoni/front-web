import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Match, MatchStatus} from '../models/match.interface';
import {SportIconPipe} from '../pipes/sport-icon.pipe';

@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [CommonModule, SportIconPipe],
  templateUrl: './match-card.html',
  styleUrl: './match-card.scss'
})
export class MatchCardComponent {
  @Input() match!: Match;
  @Output() followToggle = new EventEmitter<string>();
  @Output() viewDetails = new EventEmitter<string>();

  getStatusColor(status: MatchStatus): string {
    const colors: Record<MatchStatus, string> = {
      'live': '#4CAF50',
      'finished': '#f44336',
      'scheduled': '#FF9800',
      'halftime': '#2196F3',
      'postponed': '#9E9E9E'
    };
    return colors[status] || '#9E9E9E';
  }

  getStatusText(status: MatchStatus): string {
    const texts: Record<MatchStatus, string> = {
      'live': 'AO VIVO',
      'finished': 'FINALIZADO',
      'scheduled': 'AGENDADO',
      'halftime': 'INTERVALO',
      'postponed': 'ADIADO'
    };
    return texts[status] || status.toUpperCase();
  }

  onFollow(): void {
    this.followToggle.emit(this.match.id);
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.match.id);
  }

  getRecentHighlights(): any[] {
    return this.match.highlights
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 3);
  }

  getHighlightIcon(type: string): string {
    const icons: Record<string, string> = {
      'goal': '⚽',
      'card': '🟨',
      'substitution': '🔄',
      'point': '🏀',
      'timeout': '⏸️'
    };
    return icons[type] || '📝';
  }
}
