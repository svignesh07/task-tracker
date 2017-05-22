import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { TasksService } from './../tasks.service';
import { Subscription } from 'rxjs/Rx';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  deleteTaskSubscription: Subscription;
  private delete_task_path: string;

  @Input() tasks;
  @Input() category;
  @Output() taskDeleted: EventEmitter<any> = new EventEmitter<any>();

  constructor(private tasksService: TasksService) {}

  ngOnInit() {

  }

  deleteTask(task) {
    // Setting the delete_task_path based on the task's state
    if (task.state === 'pending') {
      this.delete_task_path = 'pending';
    } else if (task.state === 'in_progress') {
      this.delete_task_path = 'in_progress';
    } else {
      this.delete_task_path = 'completed';
    }

    if (confirm('Are you sure you want to delete - ' + task.name + '?')) {
      const index = this.tasks.indexOf(task);
      this.deleteTaskSubscription = this.tasksService.deleteTask(this.delete_task_path, task.id)
        .subscribe((res) => {
          this.tasks.splice(index, 1);
          this.taskDeleted.emit();
        },
        err => {
          alert('Could\'nt delete the task.');
        });
    }
  }

  ngOnDestroy() {
    if(this.deleteTaskSubscription) {
      this.deleteTaskSubscription.unsubscribe();
    }
  }

}
