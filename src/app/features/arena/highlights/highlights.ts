import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-highlights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './highlights.html',
  styleUrl: './highlights.scss'
})
export class HighlightsComponent {
  // Dados simulados - sem lógica ainda, apenas visual
}
