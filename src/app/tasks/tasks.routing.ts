import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TasksComponent } from './tasks.component';
import { TaskFormComponent } from './task-form/task-form.component';

const tasksRoutes: Routes = [

  { path: '', component: TasksComponent, pathMatch: 'full' },
  { path: 'new', component: TaskFormComponent},
  { path: ':task_type/:id', component: TaskFormComponent},
];

export const routing: ModuleWithProviders = RouterModule.forChild(tasksRoutes);
