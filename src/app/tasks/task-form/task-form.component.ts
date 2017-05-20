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
  private subscription: any;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tasksService: TasksService
  ) {
    this.form = fb.group({
      id: [null, ''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      estimate: ['', Validators.required],
      state: ['', Validators.required],
    });
  }


  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {

      const task_id = params['id']
          , task_type = params['task_type'];

      this.title = task_id ? 'Edit Task' : 'New Task';

      if (!task_id) {
        return;
      }

      this.tasksService.getTask(task_type, task_id)
        .subscribe(
          task => this.task = task,
          response => {
            if (response.status === 404) {
              // Navigate to 404 Not Found
            }
          });
    });
  }

  addTask(form) {
    let result;
    if (form.state === 'pending') {
      this.add_task_path = 'pending';
    } else if (form.state === 'in_progress') {
      this.add_task_path = 'in_progress';
    } else {
      this.add_task_path = 'completed';
    }

    this.route.params.subscribe((res) => {
      const current_task_type = res.task_type;
      if (form.id && current_task_type === this.add_task_path) {
        result = this.tasksService.updateTask(this.add_task_path, form, form.id);
      } else if (form.id) {
        this.tasksService.deleteTask(current_task_type, form.id)
        .subscribe(null, err => {
          console.log(err);
        });
        delete(form.id); // to add new task
        result = this.tasksService.addTask(this.add_task_path, form);
      } else {
        result = this.tasksService.addTask(this.add_task_path, form);
      }
    });

    result.subscribe(data => this.router.navigate(['tasks']));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}



