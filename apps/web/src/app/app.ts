import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type ProjectSummary = {
  id: string;
  title: string;
  subtitle: string;
  sizeLabel: string;
  progress: number;
  spreadCount: number;
  accent: string;
};

type SpreadSummary = {
  id: string;
  label: string;
  title: string;
  layout: string;
  status: string;
};

type TemplateSummary = {
  id: string;
  name: string;
  tone: string;
  cells: number[];
};

type MediaAsset = {
  id: string;
  title: string;
  tone: string;
  orientation: 'portrait' | 'landscape' | 'square';
};

type ToolAction = {
  id: string;
  label: string;
  icon: string;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly studioName = 'zichronot studio';
  protected readonly selectedProjectId = signal('family-trip');
  protected readonly selectedSpreadId = signal('spread-2');
  protected readonly selectedTemplateId = signal('template-collage');
  protected readonly selectedMediaId = signal('asset-4');
  protected readonly activeInspectorTab = signal<'templates' | 'media' | 'text' | 'style'>(
    'templates'
  );

  protected readonly toolbarActions: ToolAction[] = [
    { id: 'undo', label: 'בטל', icon: '↶' },
    { id: 'redo', label: 'בצע שוב', icon: '↷' },
    { id: 'preview', label: 'תצוגה', icon: '◫' },
  ];

  protected readonly quickTools: ToolAction[] = [
    { id: 'layout', label: 'פריסה', icon: '▥' },
    { id: 'text', label: 'טקסט', icon: 'T' },
    { id: 'align', label: 'יישור', icon: '≣' },
    { id: 'crop', label: 'חיתוך', icon: '⌲' },
  ];

  protected readonly projects: ProjectSummary[] = [
    {
      id: 'family-trip',
      title: 'הטיול שלנו לצפון',
      subtitle: 'אלבום משפחתי אביב 2026',
      sizeLabel: 'אלבום מרובע 30x30',
      progress: 72,
      spreadCount: 24,
      accent: 'peach',
    },
    {
      id: 'kindergarten',
      title: 'שנת הגן של מאיה',
      subtitle: 'רגעים קטנים שנשארים',
      sizeLabel: 'אלבום ילדים 21x28',
      progress: 38,
      spreadCount: 14,
      accent: 'mint',
    },
  ];

  protected readonly spreads: SpreadSummary[] = [
    {
      id: 'spread-1',
      label: 'כריכה',
      title: 'מסע של קיץ',
      layout: 'cover',
      status: 'מוכן',
    },
    {
      id: 'spread-2',
      label: 'עמודים 2-3',
      title: 'הטיול שלנו לצפון',
      layout: 'collage',
      status: 'בעריכה',
    },
    {
      id: 'spread-3',
      label: 'עמודים 4-5',
      title: 'רגעים מאושרים',
      layout: 'story',
      status: 'טיוטה',
    },
    {
      id: 'spread-4',
      label: 'עמודים 6-7',
      title: 'כותרת וטקסט',
      layout: 'editorial',
      status: 'טיוטה',
    },
  ];

  protected readonly templates: TemplateSummary[] = [
    {
      id: 'template-opening',
      name: 'פתיחה נקייה',
      tone: 'לשער או עמוד פתיחה',
      cells: [3, 1, 1],
    },
    {
      id: 'template-collage',
      name: 'קולאז׳ משפחתי',
      tone: 'שלוש תמונות וכותרת',
      cells: [2, 1, 2, 1],
    },
    {
      id: 'template-story',
      name: 'סיפור מסע',
      tone: 'תמונה רחבה עם אזור טקסט',
      cells: [4, 2],
    },
    {
      id: 'template-mix',
      name: 'מיקס מהיר',
      tone: 'גלריה קלילה לעמוד כפול',
      cells: [1, 2, 1, 2],
    },
  ];

  protected readonly mediaAssets: MediaAsset[] = [
    {
      id: 'asset-1',
      title: 'הליכה על החוף',
      tone: 'sunrise',
      orientation: 'landscape',
    },
    {
      id: 'asset-2',
      title: 'תמונה משפחתית',
      tone: 'sky',
      orientation: 'portrait',
    },
    {
      id: 'asset-3',
      title: 'פריים מההר',
      tone: 'forest',
      orientation: 'landscape',
    },
    {
      id: 'asset-4',
      title: 'האחיות מחייכות',
      tone: 'blush',
      orientation: 'square',
    },
    {
      id: 'asset-5',
      title: 'טיול ערב',
      tone: 'sunset',
      orientation: 'portrait',
    },
    {
      id: 'asset-6',
      title: 'פיקניק',
      tone: 'seafoam',
      orientation: 'landscape',
    },
  ];

  protected readonly typographyOptions = [
    'כותרת: Rubik SemiBold',
    'טקסט גוף: Assistant Regular',
    'כיוון: RTL מלא',
    'ריווח לדפוס: 12 מ״מ שוליים בטוחים',
  ];

  protected readonly exportSteps = [
    'בדיקת bleed ושוליים בטוחים',
    'הטמעת פונטים בעברית',
    'רינדור אסינכרוני ל-PDF',
    'שמירה ל-storage והכנת קובץ להורדה',
  ];

  protected readonly selectedProject = computed(
    () =>
      this.projects.find((project) => project.id === this.selectedProjectId()) ??
      this.projects[0]
  );

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

  protected selectProject(projectId: string): void {
    this.selectedProjectId.set(projectId);
  }

  protected selectSpread(spreadId: string): void {
    this.selectedSpreadId.set(spreadId);
  }

  protected selectTemplate(templateId: string): void {
    this.selectedTemplateId.set(templateId);
  }

  protected selectMedia(assetId: string): void {
    this.selectedMediaId.set(assetId);
  }

  protected setInspectorTab(tab: 'templates' | 'media' | 'text' | 'style'): void {
    this.activeInspectorTab.set(tab);
  }
}
