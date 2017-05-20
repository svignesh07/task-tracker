import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class TasksService {

  private url: string = "http://localhost:3000/";

  constructor(private http: Http) { }

  getTasks(path){
    return this.http.get(`${this.url}${path}`)
      .map(res => res.json());
  }

  getTask(path: string, id){
    return this.http.get(`${this.url}${path}/${id}`)
      .map(res => res.json());
  }

  addTask(path: string, task: Object = {}){
    return this.http.post(`${this.url}${path}`, task)
      .map(res => res.json());
  }

  updateTask(path: string, task, id){
    return this.http.put(`${this.url}${path}/${id}`, task)
      .map(res => res.json());
  }

  deleteTask(path: string, id){
    debugger;
    return this.http.delete(`${this.url}${path}/${id}`)
      .map(res => res.json());
  }

}
