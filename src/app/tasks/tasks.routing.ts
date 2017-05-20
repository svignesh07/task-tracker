import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { TasksComponent } from './tasks.component';
import { TaskFormComponent } from './task-form/task-form.component';

const tasksRoutes: Routes = [

  { path: 'tasks', component: TasksComponent, pathMatch: 'full' },
  { path: 'tasks/new', component: TaskFormComponent},
  { path: 'tasks/:task_type/:id', component: TaskFormComponent},
];

export const TasksRouting = RouterModule.forChild(tasksRoutes);

const routes: Routes = [
  { path: '', pathMatch: 'full', component: TasksComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);


