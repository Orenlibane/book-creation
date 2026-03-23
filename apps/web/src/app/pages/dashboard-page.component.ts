import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { projects } from '../studio-data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  standalone: true,
  template: `
    <section class="dashboard-page">
      <header class="hero">
        <div class="hero-copy">
          <span class="eyebrow">דשבורד פרויקטים</span>
          <h1>כל ספר מקבל מקום משלו.</h1>
          <p>
            במקום מסך עמוס אחד, מכאן בוחרים פרויקט, רואים סטטוס, וממשיכים לעורך או
            לתצוגה הסופית בצורה מסודרת.
          </p>
        </div>

        <div class="hero-card">
          <span>ספרים פעילים</span>
          <strong>{{ projects.length }}</strong>
          <small>מעבר מהיר לעבודה, שמירה וייצוא</small>
        </div>
      </header>

      <section class="projects-grid">
        @for (project of projects; track project.id) {
          <article class="project-card" [class.mint]="project.accent === 'mint'">
            <div class="project-cover">
              <span>{{ project.title }}</span>
            </div>

            <div class="project-content">
              <div>
                <h2>{{ project.title }}</h2>
                <p>{{ project.subtitle }}</p>
              </div>

              <dl class="meta-list">
                <div>
                  <dt>פורמט</dt>
                  <dd>{{ project.sizeLabel }}</dd>
                </div>
                <div>
                  <dt>עמודים כפולים</dt>
                  <dd>{{ project.spreadCount }}</dd>
                </div>
                <div>
                  <dt>מוכנות</dt>
                  <dd>{{ project.progress }}%</dd>
                </div>
              </dl>

              <div class="progress-track">
                <span [style.width.%]="project.progress"></span>
              </div>

              <div class="actions">
                <a [routerLink]="['/editor']">פתח בעורך</a>
                <a [routerLink]="['/preview']">בדוק לפני הדפסה</a>
              </div>
            </div>
          </article>
        }
      </section>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .dashboard-page {
      display: grid;
      gap: 22px;
    }

    .hero,
    .project-card,
    .actions,
    .meta-list {
      display: flex;
    }

    .hero {
      justify-content: space-between;
      gap: 20px;
      padding: 28px;
      border: 1px solid rgba(190, 152, 122, 0.18);
      border-radius: 34px;
      background:
        linear-gradient(180deg, rgba(255, 251, 245, 0.9), rgba(255, 240, 223, 0.78));
      box-shadow: 0 24px 48px rgba(106, 78, 59, 0.1);
    }

    .hero-copy {
      display: grid;
      gap: 12px;
      max-width: 720px;
    }

    .eyebrow {
      width: fit-content;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(244, 188, 152, 0.2);
      color: #955842;
      font-size: 0.74rem;
      font-weight: 700;
    }

    h1,
    h2,
    p,
    dl,
    dt,
    dd {
      margin: 0;
    }

    h1 {
      color: #301e18;
      font-family: 'Rubik', 'Assistant', sans-serif;
      font-size: clamp(2.3rem, 4vw, 3.6rem);
      line-height: 0.95;
    }

    p {
      color: #6b4f42;
      line-height: 1.75;
    }

    .hero-card {
      display: grid;
      align-content: end;
      gap: 6px;
      min-width: 220px;
      padding: 22px;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.72);
    }

    .hero-card span,
    dt {
      color: rgba(118, 86, 67, 0.72);
      font-size: 0.76rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .hero-card strong {
      color: #3a241c;
      font-size: 3rem;
      font-family: 'Rubik', 'Assistant', sans-serif;
    }

    .hero-card small {
      color: #7f5d4d;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }

    .project-card {
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(190, 152, 122, 0.18);
      border-radius: 30px;
      background: rgba(255, 252, 247, 0.82);
      box-shadow:
        0 22px 42px rgba(106, 78, 59, 0.09),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .project-cover {
      position: relative;
      min-height: 200px;
      background:
        linear-gradient(145deg, rgba(255, 186, 145, 0.94), rgba(252, 223, 200, 0.92));
    }

    .project-card.mint .project-cover {
      background:
        linear-gradient(145deg, rgba(168, 221, 203, 0.94), rgba(216, 241, 226, 0.92));
    }

    .project-cover::before {
      content: '';
      position: absolute;
      inset: 18px;
      border-radius: 20px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 244, 232, 0.84));
    }

    .project-cover span {
      position: absolute;
      inset: auto 18px 18px;
      z-index: 1;
      color: #5c3c31;
      font-weight: 700;
    }

    .project-content {
      display: grid;
      gap: 16px;
      padding: 20px;
    }

    h2 {
      color: #3a241c;
      font-size: 1.3rem;
      font-family: 'Rubik', 'Assistant', sans-serif;
    }

    .meta-list {
      flex-direction: column;
      gap: 10px;
    }

    .meta-list div {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(198, 167, 145, 0.24);
    }

    dd {
      color: #4d342a;
      font-weight: 700;
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

    .actions {
      gap: 10px;
      flex-wrap: wrap;
    }

    .actions a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 16px;
      border-radius: 999px;
      color: #fff8f1;
      background: linear-gradient(135deg, #ef8d71, #f2b18a);
      font-weight: 800;
      text-decoration: none;
      box-shadow: 0 18px 28px rgba(239, 143, 114, 0.2);
    }

    .actions a:last-child {
      color: #6a493b;
      background: rgba(255, 255, 255, 0.7);
      box-shadow: inset 0 0 0 1px rgba(191, 149, 114, 0.12);
    }

    @media (max-width: 1180px) {
      .projects-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 820px) {
      .hero {
        flex-direction: column;
      }

      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class DashboardPageComponent {
  protected readonly projects = projects;
}
