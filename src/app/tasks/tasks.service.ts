import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class TasksService {

  private baseUrl: string;

  constructor(private http: Http) {
    this.baseUrl = 'https://ionic2-jokes.firebaseio.com/jokes/';
  }

  getTasks(path) {
    return this.http.get(`${this.baseUrl}${path}`)
      .map(res => res.json());
  }

  getTask(path: string, id) {
    return this.http.get(`${this.baseUrl}${path}/${id}`)
      .map(res => res.json());
  }

  addTask(path: string, task: Object = {}) {
    return this.http.post(`${this.baseUrl}${path}.json`, task)
      .map(res => res.json());
  }

  updateTask(path: string, task, id) {
    return this.http.put(`${this.baseUrl}${path}/${id}`, task)
      .map(res => res.json());
  }

  deleteTask(path: string, id) {
    return this.http.delete(`${this.baseUrl}${path}/${id}`)
      .map(res => res.json());
  }

}
