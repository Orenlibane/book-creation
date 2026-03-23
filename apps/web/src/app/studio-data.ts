export type ProjectSummary = {
  id: string;
  title: string;
  subtitle: string;
  sizeLabel: string;
  progress: number;
  spreadCount: number;
  accent: string;
};

export type SpreadSummary = {
  id: string;
  label: string;
  title: string;
  layout: string;
  status: string;
};

export type TemplateSummary = {
  id: string;
  name: string;
  tone: string;
  cells: number[];
};

export type MediaAsset = {
  id: string;
  title: string;
  tone: string;
  orientation: 'portrait' | 'landscape' | 'square';
};

export type ToolAction = {
  id: string;
  label: string;
  icon: string;
};

export const studioName = 'zichronot studio';

export const projects: ProjectSummary[] = [
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
  {
    id: 'wedding-book',
    title: 'סיפור החתונה שלנו',
    subtitle: 'מהחופה ועד הריקוד האחרון',
    sizeLabel: 'אלבום פרימיום 28x35',
    progress: 91,
    spreadCount: 32,
    accent: 'sand',
  },
];

export const spreads: SpreadSummary[] = [
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

export const templates: TemplateSummary[] = [
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

export const mediaAssets: MediaAsset[] = [
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

export const toolbarActions: ToolAction[] = [
  { id: 'undo', label: 'בטל', icon: '↶' },
  { id: 'redo', label: 'בצע שוב', icon: '↷' },
  { id: 'preview', label: 'תצוגה', icon: '◫' },
];

export const quickTools: ToolAction[] = [
  { id: 'layout', label: 'פריסה', icon: '▥' },
  { id: 'text', label: 'טקסט', icon: 'T' },
  { id: 'align', label: 'יישור', icon: '≣' },
  { id: 'crop', label: 'חיתוך', icon: '⌲' },
];

export const typographyOptions = [
  'כותרת: Rubik SemiBold',
  'טקסט גוף: Assistant Regular',
  'כיוון: RTL מלא',
  'ריווח לדפוס: 12 מ״מ שוליים בטוחים',
];

export const exportSteps = [
  'בדיקת bleed ושוליים בטוחים',
  'הטמעת פונטים בעברית',
  'רינדור אסינכרוני ל-PDF',
  'שמירה ל-storage והכנת קובץ להורדה',
];
