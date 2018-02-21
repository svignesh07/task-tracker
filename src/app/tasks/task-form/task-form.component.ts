import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Task } from './../task';
import { TasksService } from './../tasks.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  title: string;
  task: Task = new Task();
  add_task_path = '';
  private getTaskSubscription: any;
  private getTasksSubscription: any;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tasksService: TasksService
  ) {
    this.form = fb.group({
      id: [null, ''],
      title: ['', null],
      description: ['', Validators.required],
      // likes: ['', Validators.required],
      language: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getTaskSubscription = this.route.params.subscribe(params => {

      const task_id = params['id']
        , task_type = params['task_type'];

      this.title = task_id ? 'Edit Task' : 'New Task';

      if (!task_id) {
        return;
      }

      this.getTasksSubscription = this.tasksService.getTask(task_type, task_id)
        .subscribe(
        task => this.task = task,
        response => {
          if (response.status === 404) {
            // Navigate to 404 Not Found
          }
        });
    });
  }

  addTask(task) {
    let result;

    // Setting the add_task_path based on the task's state
    if (task.language === 'english') {
      this.add_task_path = `english/${task.category}`;
    } else if (task.language === 'portuguese') {
      this.add_task_path = `portuguese/${task.category}`;
    } else if (task.language === 'spanish') {
      this.add_task_path = `spanish/${task.category}`;
    } else {
       this.add_task_path = `french/${task.category}`;
    }

    this.route.params.subscribe((res) => {
      const current_task_type = res.task_type;
      if (task.id && current_task_type === this.add_task_path) {
        result = this.tasksService.updateTask(this.add_task_path, task, task.id);
      } else if (task.id) {
        this.tasksService.deleteTask(current_task_type, task.id)
          .subscribe(null, err => {
            console.log(err);
          });
        delete (task.id); // to add a new task in a new category
        delete (task.language); // to add a new task in a new category
        delete (task.category); // to add a new task in a new category
        result = this.tasksService.addTask(this.add_task_path, task);
      } else {
        delete (task.language); // to add a new task in a new category
        delete (task.category); // to add a new task in a new category
        result = this.tasksService.addTask(this.add_task_path, task);
      }
    });

    // Route to tasks page after task addition or updation
    result.subscribe(data => {
      console.log(data);
    });
  }

  ngOnDestroy() {
    // Unsubscribe
    if (this.getTasksSubscription) {
      this.getTasksSubscription.unsubscribe();
    }
    if (this.getTaskSubscription) {
      this.getTaskSubscription.unsubscribe();
    }
  }
}
