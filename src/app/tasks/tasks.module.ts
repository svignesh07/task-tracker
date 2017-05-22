import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { TasksComponent } from './tasks.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TasksService } from './tasks.service';
import { TaskComponent } from './task/task.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpModule
  ],
  declarations: [
    TasksComponent,
    TaskFormComponent,
    TaskComponent
  ],
  exports: [
    TasksComponent
  ],
  providers: [
    TasksService
  ]
})
export class TasksModule { }
