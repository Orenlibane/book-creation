import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'זיכרונות';
  protected readonly highlights = [
    'עברית מלאה ו-RTL כבר מהיסוד',
    'עורך ספר עם drag and drop, תמונות וטקסט',
    'שמירה אוטומטית, preview וייצוא PDF אסינכרוני',
  ];
}
