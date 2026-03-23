import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { exportSteps, projects, typographyOptions } from '../studio-data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  standalone: true,
  template: `
    <section class="preview-page">
      <header class="preview-hero panel">
        <div class="hero-copy">
          <span class="eyebrow">preview & export</span>
          <h1>עמוד סופי לפני הדפסה.</h1>
          <p>
            זה המסך שמוודא שהספר מוכן: תצוגה, בדיקות דפוס, פונטים בעברית, והורדת
            קובץ PDF.
          </p>
        </div>

        <div class="hero-actions">
          <a [routerLink]="['/editor']">חזרה לעורך</a>
          <button type="button">הורד PDF להדפסה</button>
        </div>
      </header>

      <div class="preview-layout">
        <section class="book-panel panel">
          <div class="book-stage">
            <div class="book-cover">
              <div class="cover-art">
                <span>family trip</span>
                <strong>{{ project.title }}</strong>
              </div>
            </div>
          </div>

          <div class="progress-block">
            <div class="progress-copy">
              <h2>הספר מוכן</h2>
              <small>{{ project.progress }}% מוכן לייצוא</small>
            </div>
            <div class="progress-track">
              <span [style.width.%]="project.progress"></span>
            </div>
          </div>
        </section>

        <aside class="checklist-panel panel">
          <section>
            <h3>צ׳קליסט ייצוא</h3>
            <ul>
              @for (step of exportSteps; track step) {
                <li>{{ step }}</li>
              }
            </ul>
          </section>

          <section>
            <h3>הגדרות טיפוגרפיה</h3>
            <ul>
              @for (item of typographyOptions; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </section>
        </aside>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .preview-page,
    .preview-hero,
    .preview-layout,
    .hero-actions {
      display: flex;
    }

    .preview-page {
      flex-direction: column;
      gap: 18px;
    }

    .panel {
      border: 1px solid rgba(190, 152, 122, 0.18);
      border-radius: 30px;
      background: rgba(255, 252, 247, 0.78);
      box-shadow:
        0 20px 40px rgba(106, 78, 59, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(18px);
    }

    .preview-hero {
      justify-content: space-between;
      gap: 18px;
      padding: 24px;
      background:
        linear-gradient(180deg, rgba(255, 251, 245, 0.9), rgba(255, 240, 223, 0.78));
    }

    .eyebrow,
    small {
      color: rgba(118, 86, 67, 0.72);
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1,
    h2,
    h3,
    p {
      margin: 0;
    }

    h1,
    h2,
    h3 {
      color: #301e18;
      font-family: 'Rubik', 'Assistant', sans-serif;
    }

    h1 {
      margin-top: 8px;
      font-size: clamp(2rem, 3vw, 3rem);
    }

    p {
      margin-top: 8px;
      color: #6b4f42;
      line-height: 1.75;
      max-width: 700px;
    }

    .hero-actions {
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .hero-actions a,
    .hero-actions button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 18px;
      border-radius: 999px;
      border: 0;
      color: #fff8f1;
      background: linear-gradient(135deg, #ef8d71, #f2b18a);
      font: inherit;
      font-weight: 800;
      text-decoration: none;
      cursor: pointer;
      box-shadow: 0 18px 28px rgba(239, 143, 114, 0.2);
    }

    .hero-actions a {
      color: #6a493b;
      background: rgba(255, 255, 255, 0.7);
      box-shadow: inset 0 0 0 1px rgba(191, 149, 114, 0.12);
    }

    .preview-layout {
      gap: 18px;
      align-items: stretch;
    }

    .book-panel {
      flex: 1;
      padding: 20px;
    }

    .checklist-panel {
      width: 360px;
      padding: 20px;
    }

    .book-stage {
      display: grid;
      place-items: center;
      min-height: 430px;
      border-radius: 32px;
      background:
        radial-gradient(circle at top, rgba(255, 255, 255, 0.94), rgba(255, 240, 224, 0.88));
    }

    .book-cover {
      width: min(280px, 100%);
      aspect-ratio: 0.82;
      padding: 16px;
      border-radius: 24px;
      background:
        linear-gradient(140deg, rgba(243, 157, 133, 0.96), rgba(156, 222, 204, 0.86));
      transform: perspective(1100px) rotateX(10deg) rotateZ(-10deg);
      box-shadow: 0 24px 36px rgba(121, 86, 63, 0.22);
    }

    .cover-art {
      display: grid;
      align-content: end;
      gap: 8px;
      height: 100%;
      padding: 18px;
      border-radius: 18px;
      background:
        linear-gradient(180deg, rgba(255, 252, 247, 0.96), rgba(253, 242, 228, 0.88));
    }

    .cover-art span {
      color: rgba(118, 86, 67, 0.72);
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .cover-art strong {
      color: #442d23;
      font-size: 1.45rem;
      line-height: 1.2;
    }

    .progress-block {
      display: grid;
      gap: 12px;
      margin-top: 18px;
    }

    .progress-copy {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .progress-track {
      height: 10px;
      border-radius: 999px;
      background: rgba(232, 214, 198, 0.78);
      overflow: hidden;
    }

    .progress-track span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #8fd2bf, #ef9a79);
    }

    section + section {
      margin-top: 18px;
    }

    ul {
      display: grid;
      gap: 10px;
      margin: 14px 0 0;
      padding: 0;
      list-style: none;
    }

    li {
      padding: 12px 14px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.52);
      color: #61473b;
    }

    @media (max-width: 1120px) {
      .preview-layout {
        flex-direction: column;
      }

      .checklist-panel {
        width: auto;
      }
    }

    @media (max-width: 820px) {
      .preview-hero,
      .progress-copy {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `,
})
export class PreviewPageComponent {
  protected readonly project = projects[0];
  protected readonly exportSteps = exportSteps;
  protected readonly typographyOptions = typographyOptions;
}
