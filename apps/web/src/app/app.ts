import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { studioName } from './studio-data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly studioName = studioName;
  protected readonly navigation = [
    {
      path: '/dashboard',
      label: 'דשבורד',
      description: 'ניהול פרויקטים ואלבומים',
    },
    {
      path: '/editor',
      label: 'Editor',
      description: 'עריכת עמודים ותבניות',
    },
    {
      path: '/preview',
      label: 'Preview',
      description: 'בדיקה סופית וייצוא',
    },
  ];
}
