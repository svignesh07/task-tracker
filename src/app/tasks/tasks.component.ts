
import { Component, OnInit } from '@angular/core';
import { TasksService } from './tasks.service';
import { Task } from './task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  private states: any[] = ['pending', 'in_progress', 'completed'];
  private tasks_path = 'db';
  all_tasks: any[] = [];
  pending_tasks: Task[] = [];
  in_progress_tasks: Task[] = [];
  completed_tasks: Task[] = [];
  pending_hours = 0;
  in_progress_hours = 0;
  completed_hours = 0;
  delete_task_path = '';

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.tasksService.getTasks(this.tasks_path)
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

      this.tasksService.deleteTask(this.delete_task_path, task.id)
        .subscribe(null,
        err => {
          alert('Could not delete task.');
          // Add back the task in the array
          array_type.splice(index, 0, task);
        },
        () => {
          this.pending_hours = this.calculateHours(this.pending_tasks);
          this.in_progress_hours = this.calculateHours(this.in_progress_tasks);
          this.completed_hours = this.calculateHours(this.completed_tasks);
        });
    }
  }

  calculateHours(array) {
    let estimate = 0;

    for (let i = 0; i < array.length; i++) {
      estimate += parseInt(array[i].estimate, 10);
    }
    return estimate;
  }

}
