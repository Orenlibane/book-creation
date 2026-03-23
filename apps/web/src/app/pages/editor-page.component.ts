import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { mediaAssets, quickTools, spreads, templates, toolbarActions } from '../studio-data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  standalone: true,
  template: `
    <section class="editor-page">
      <header class="editor-header panel">
        <div>
          <span class="eyebrow">editor workspace</span>
          <h1>עמוד עריכה ייעודי</h1>
          <p>כאן מתמקדים רק בבניית הספר: עמודים, קנבס, תבניות, מדיה וטקסט.</p>
        </div>

        <div class="toolbar">
          @for (action of toolbarActions; track action.id) {
            <button type="button">
              <span>{{ action.icon }}</span>
              {{ action.label }}
            </button>
          }
        </div>
      </header>

      <div class="editor-layout">
        <aside class="left-rail panel">
          <div class="rail-heading">
            <h2>עמודים</h2>
            <small>{{ spreads.length }} עמודים</small>
          </div>

          <div class="thumbnail-list">
            @for (spread of spreads; track spread.id) {
              <button
                class="thumbnail-item"
                [class.is-active]="selectedSpread().id === spread.id"
                type="button"
                (click)="selectSpread(spread.id)"
              >
                <span>{{ spread.label }}</span>
                <strong>{{ spread.title }}</strong>
                <small>{{ spread.status }}</small>
              </button>
            }
          </div>
        </aside>

        <section class="canvas-panel panel">
          <header class="canvas-header">
            <div>
              <span class="eyebrow">{{ selectedSpread().label }}</span>
              <h2>{{ selectedSpread().title }}</h2>
            </div>

            <div class="canvas-meta">
              <span>תבנית: {{ selectedTemplate().name }}</span>
              <span>תמונה: {{ selectedMedia().title }}</span>
            </div>
          </header>

          <div class="book-surface">
            <div class="page-sheet">
              <div class="frame large sunrise"></div>
              <div class="headline-block">
                <span>המסע שלנו לצפון</span>
                <small>חיפה / נוף גלילי / זיכרונות של קיץ</small>
              </div>
              <div class="frame portrait forest"></div>
            </div>

            <div class="spine"></div>

            <div class="page-sheet">
              <div class="frame square" [ngClass]="selectedMedia().tone"></div>
              <div class="story-block">
                <h3>רגעים מאושרים</h3>
                <p>כאן יישב הקנבס האמיתי של כל עמוד, בלי ערבוב עם דשבורד או export.</p>
              </div>
              <div class="mini-gallery">
                <div class="mini-frame sky"></div>
                <div class="mini-frame blush"></div>
                <div class="mini-frame sunset"></div>
              </div>
            </div>
          </div>

          <div class="quick-tools">
            @for (action of quickTools; track action.id) {
              <button type="button">
                <span>{{ action.icon }}</span>
                {{ action.label }}
              </button>
            }
          </div>
        </section>

        <aside class="right-rail panel">
          <section class="section-block">
            <div class="rail-heading">
              <h2>תבניות</h2>
            </div>

            <div class="template-list">
              @for (template of templates; track template.id) {
                <button
                  class="template-item"
                  [class.is-active]="selectedTemplate().id === template.id"
                  type="button"
                  (click)="selectTemplate(template.id)"
                >
                  <div class="template-preview">
                    @for (cell of template.cells; track $index) {
                      <span [style.flex]="cell"></span>
                    }
                  </div>
                  <strong>{{ template.name }}</strong>
                  <small>{{ template.tone }}</small>
                </button>
              }
            </div>
          </section>

          <section class="section-block">
            <div class="rail-heading">
              <h2>תמונות</h2>
            </div>

            <div class="media-grid">
              @for (asset of mediaAssets; track asset.id) {
                <button
                  class="media-item"
                  [class.is-active]="selectedMedia().id === asset.id"
                  type="button"
                  (click)="selectMedia(asset.id)"
                >
                  <span class="media-visual" [ngClass]="asset.tone"></span>
                  <strong>{{ asset.title }}</strong>
                </button>
              }
            </div>
          </section>
        </aside>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .editor-page,
    .editor-layout,
    .toolbar,
    .canvas-header,
    .quick-tools,
    .rail-heading,
    .canvas-meta {
      display: flex;
    }

    .editor-page {
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

    .editor-header {
      justify-content: space-between;
      gap: 18px;
      padding: 24px;
    }

    .eyebrow,
    .canvas-meta span,
    .thumbnail-item span,
    .rail-heading small,
    .template-item small {
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
    }

    .toolbar,
    .quick-tools {
      gap: 10px;
      flex-wrap: wrap;
    }

    .toolbar button,
    .quick-tools button,
    .thumbnail-item,
    .template-item,
    .media-item {
      appearance: none;
      border: 0;
      font: inherit;
      cursor: pointer;
    }

    .toolbar button,
    .quick-tools button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      border-radius: 999px;
      color: #68483b;
      background: rgba(255, 255, 255, 0.76);
      box-shadow: inset 0 0 0 1px rgba(191, 149, 114, 0.12);
    }

    .editor-layout {
      gap: 18px;
      align-items: stretch;
    }

    .left-rail,
    .right-rail {
      width: 280px;
      padding: 18px;
    }

    .canvas-panel {
      flex: 1;
      min-width: 0;
      padding: 18px;
    }

    .rail-heading,
    .canvas-header {
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .thumbnail-list,
    .template-list {
      display: grid;
      gap: 12px;
      margin-top: 14px;
    }

    .thumbnail-item,
    .template-item,
    .media-item {
      width: 100%;
      padding: 14px;
      text-align: right;
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.58);
      color: inherit;
      transition:
        transform 180ms ease,
        background 180ms ease,
        box-shadow 180ms ease;
    }

    .thumbnail-item.is-active,
    .template-item.is-active,
    .media-item.is-active,
    .thumbnail-item:hover,
    .template-item:hover,
    .media-item:hover {
      transform: translateY(-1px);
      background: rgba(255, 248, 240, 0.96);
      box-shadow:
        0 16px 34px rgba(120, 86, 61, 0.12),
        inset 0 0 0 1px rgba(222, 149, 109, 0.24);
    }

    .thumbnail-item strong {
      display: block;
      margin-top: 6px;
      color: #3d2820;
    }

    .thumbnail-item small {
      display: inline-block;
      margin-top: 8px;
      color: #9f614d;
    }

    .canvas-meta {
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .book-surface {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 22px minmax(0, 1fr);
      gap: 0;
      margin-top: 18px;
      min-height: 560px;
      padding: 28px;
      border-radius: 34px;
      background:
        radial-gradient(circle at top, rgba(255, 255, 255, 0.94), rgba(255, 242, 226, 0.88)),
        linear-gradient(180deg, rgba(249, 231, 207, 0.88), rgba(245, 222, 195, 0.76));
    }

    .page-sheet {
      display: grid;
      gap: 18px;
      padding: 28px;
      border-radius: 22px;
      background:
        linear-gradient(180deg, rgba(255, 250, 243, 0.96), rgba(253, 242, 228, 0.88));
      box-shadow:
        0 18px 30px rgba(125, 96, 74, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.92);
    }

    .spine {
      margin: 30px 0;
      border-radius: 999px;
      background:
        linear-gradient(180deg, rgba(223, 194, 168, 0.9), rgba(183, 149, 122, 0.8));
      box-shadow:
        inset 0 0 12px rgba(112, 80, 57, 0.24),
        0 0 18px rgba(147, 108, 83, 0.18);
    }

    .frame,
    .media-visual,
    .mini-frame {
      border-radius: 20px;
      overflow: hidden;
      background: linear-gradient(160deg, #f7b88a, #ffd89c 36%, #86c7d9 72%, #6ba0c5);
      box-shadow: 0 14px 26px rgba(110, 83, 65, 0.14);
    }

    .frame.large {
      min-height: 220px;
    }

    .frame.portrait {
      min-height: 176px;
      width: 64%;
    }

    .frame.square {
      min-height: 190px;
    }

    .forest {
      background: linear-gradient(160deg, #89c39a, #c6e0a5 38%, #768f6d 70%, #536e4c);
    }

    .sky {
      background: linear-gradient(160deg, #9fc8f7, #d5e7ff 38%, #8fd7d8 72%, #6ea3be);
    }

    .blush {
      background: linear-gradient(160deg, #f3b8b0, #f7d7cb 40%, #f2c47f 74%, #c98d6b);
    }

    .sunset {
      background: linear-gradient(160deg, #e6926d, #f3bc7b 38%, #956b90 72%, #675676);
    }

    .headline-block,
    .story-block {
      display: grid;
      gap: 6px;
    }

    .headline-block span {
      color: #3a241c;
      font-size: clamp(1.8rem, 2.4vw, 2.4rem);
      font-weight: 700;
      font-family: 'Rubik', 'Assistant', sans-serif;
    }

    .headline-block small {
      color: #83604f;
    }

    .story-block h3 {
      font-size: 2rem;
    }

    .mini-gallery {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .mini-frame {
      min-height: 84px;
    }

    .quick-tools {
      justify-content: center;
      margin-top: 18px;
    }

    .section-block + .section-block {
      margin-top: 18px;
    }

    .template-preview {
      display: flex;
      gap: 6px;
      min-height: 82px;
      margin-bottom: 10px;
      padding: 8px;
      border-radius: 18px;
      background: rgba(255, 242, 228, 0.9);
    }

    .template-preview span {
      border-radius: 10px;
      background:
        linear-gradient(180deg, rgba(189, 229, 230, 0.94), rgba(247, 227, 191, 0.92));
    }

    .template-item strong,
    .media-item strong {
      color: #3d2820;
      display: block;
    }

    .media-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 14px;
    }

    .media-visual {
      display: block;
      min-height: 100px;
      margin-bottom: 10px;
    }

    @media (max-width: 1280px) {
      .editor-layout {
        flex-direction: column;
      }

      .left-rail,
      .right-rail {
        width: auto;
      }
    }

    @media (max-width: 820px) {
      .editor-header,
      .canvas-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .book-surface {
        grid-template-columns: 1fr;
        min-height: auto;
      }

      .spine {
        display: none;
      }

      .media-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class EditorPageComponent {
  protected readonly toolbarActions = toolbarActions;
  protected readonly quickTools = quickTools;
  protected readonly spreads = spreads;
  protected readonly templates = templates;
  protected readonly mediaAssets = mediaAssets;

  private readonly selectedSpreadId = signal('spread-2');
  private readonly selectedTemplateId = signal('template-collage');
  private readonly selectedMediaId = signal('asset-4');

  protected readonly selectedSpread = computed(
    () => this.spreads.find((spread) => spread.id === this.selectedSpreadId()) ?? this.spreads[0]
  );

  protected readonly selectedTemplate = computed(
    () =>
      this.templates.find((template) => template.id === this.selectedTemplateId()) ??
      this.templates[0]
  );

  protected readonly selectedMedia = computed(
    () =>
      this.mediaAssets.find((asset) => asset.id === this.selectedMediaId()) ?? this.mediaAssets[0]
  );

  protected selectSpread(spreadId: string): void {
    this.selectedSpreadId.set(spreadId);
  }

  protected selectTemplate(templateId: string): void {
    this.selectedTemplateId.set(templateId);
  }

  protected selectMedia(assetId: string): void {
    this.selectedMediaId.set(assetId);
  }
}
