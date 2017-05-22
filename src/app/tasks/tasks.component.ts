
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TasksService } from './tasks.service';
import { Task } from './task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {

  private states: any[] = ['pending', 'in_progress', 'completed'];
  private tasks_path = 'db';
  private getTasksSubscription: any;
  pending_tasks = [];
  in_progress_tasks = [];
  completed_tasks = [];
  pending_hours = 0;
  in_progress_hours = 0;
  completed_hours = 0;

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.getTasksSubscription = this.tasksService.getTasks(this.tasks_path)
      .subscribe((data) => {
        this.pending_tasks = data.pending;
        this.in_progress_tasks = data.in_progress;
        this.completed_tasks = data.completed;
        this.updateHours();
      });
  }

  updateHours() {
    this.pending_hours = this.calculateHours(this.pending_tasks);
    this.in_progress_hours = this.calculateHours(this.in_progress_tasks);
    this.completed_hours = this.calculateHours(this.completed_tasks);
  }

  // Returns the total Hours for each Task Category
  calculateHours(array) {
    let estimate = 0;

    for (let i = 0; i < array.length; i++) {
      estimate += parseFloat(array[i].estimate);
    }
    return estimate;
  }

  onTaskDelete() {
    this.updateHours();
  }

  ngOnDestroy() {
    // Unsubscribe
    if (this.getTasksSubscription) {
      this.getTasksSubscription.unsubscribe();
    }
  }

}
