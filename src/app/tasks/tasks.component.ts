
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
  private delete_task_path = '';
  private getTasksSubscription: any;
  private deleteTaskSubscription: any;
  all_tasks: any[] = []; // it will contain pending_tasks, in_progress_tasks and completed_tasks
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
        this.all_tasks.push(this.pending_tasks, this.in_progress_tasks, this.completed_tasks);
        this.pending_hours = this.calculateHours(this.pending_tasks);
        this.in_progress_hours = this.calculateHours(this.in_progress_tasks);
        this.completed_hours = this.calculateHours(this.completed_tasks);
      });
  }

  deleteTask(task) {
    let array_type: any[];

    // Setting the delete_task_path based on the task's state
    if (task.state === 'pending') {
      array_type = this.pending_tasks;
      this.delete_task_path = 'pending';
    } else if (task.state === 'in_progress') {
      array_type = this.in_progress_tasks;
      this.delete_task_path = 'in_progress';
    } else {
      array_type = this.completed_tasks;
      this.delete_task_path = 'completed';
    }

    if (confirm('Are you sure you want to delete - ' + task.name + '?')) {
      const index = array_type.indexOf(task);
      array_type.splice(index, 1);

      this.deleteTaskSubscription = this.tasksService.deleteTask(this.delete_task_path, task.id)
        .subscribe(() => {
          // Update the total Hours of each task category if task is succesfully deleted
          this.pending_hours = this.calculateHours(this.pending_tasks);
          this.in_progress_hours = this.calculateHours(this.in_progress_tasks);
          this.completed_hours = this.calculateHours(this.completed_tasks);
        },
        err => {
          alert('Could\'nt delete the task.');
          array_type.splice(index, 0, task); // To add back the task in the array
        });
    }
  }

  // Returns the total Hours for each Task Category
  calculateHours(array) {
    let estimate = 0;

    for (let i = 0; i < array.length; i++) {
      estimate += parseInt(array[i].estimate, 10);
    }
    return estimate;
  }

  ngOnDestroy() {
    // Unsubscribe
    if (this.getTasksSubscription) {
      this.getTasksSubscription.unsubscribe();
    }
    if (this.deleteTaskSubscription) {
      this.deleteTaskSubscription.unsubscribe();
    }
  }

}
