import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sportIcon',
  standalone: true
})
export class SportIconPipe implements PipeTransform {
  private readonly sportIcons: Record<string, string> = {
    'football': '⚽',
    'basketball': '🏀',
    'volleyball': '🏐',
    'handball': '🤾',
    'tennis': '🎾',
    'swimming': '🏊',
    'athletics': '🏃',
    'futsal': '⚽'
  };

  transform(sportId: string): string {
    return this.sportIcons[sportId] || '🏆';
  }
}
