import { Route } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page.component';
import { EditorPageComponent } from './pages/editor-page.component';
import { PreviewPageComponent } from './pages/preview-page.component';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'editor', component: EditorPageComponent },
  { path: 'preview', component: PreviewPageComponent },
];
