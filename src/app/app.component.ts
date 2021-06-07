import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Todo } from './models/todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'todo-list';
  todos: Array<Todo> = window.localStorage.getItem('todos-List')
    ? JSON.parse(window.localStorage.getItem('todos-List') || '[]')
    : [];
  completedTodoList: Array<Todo> = window.localStorage.getItem(
    'todos-Done-List'
  )
    ? JSON.parse(window.localStorage.getItem('todos-Done-List') || '[]')
    : [];
  editObject={
    isDisabled:false
  }; 
  endTaskTime = 0;
  isDisabled=false;

  handelEvent(data: any) {
    if (!data.id) {
      data.id = Math.floor(Math.random() * 1000);
      this.todos.push(data);
      window.localStorage.setItem('todos-List', JSON.stringify(this.todos));
      this.endTimeNotification(data);
    } else {
      let checkEditItem = this.todos.find((x) => x.id == data.id);
      if (checkEditItem != null) {
        clearTimeout(checkEditItem.notification);
        checkEditItem.isDisabled= false;
        let indexOfItem = this.todos.indexOf(checkEditItem);
        this.todos.splice(indexOfItem, 1);
        
        this.todos.push(data);
        window.localStorage.setItem('todos-List', JSON.stringify(this.todos));
        this.endTimeNotification(data);
      }
    }
  }
  handelEventComplete(serverData: any) {
    let todo = this.todos.filter((x) => x.id == serverData)[0];
    todo.status = true;
    this.completedTodoList.push(todo);
    window.localStorage.setItem(
      'todos-Done-List',
      JSON.stringify(this.completedTodoList)
    );
    let x = this.todos.indexOf(todo);
    this.todos.splice(x, 1);
    window.localStorage.setItem('todos-List', JSON.stringify(this.todos));
  }

  handelEventNotComplete(serverDatas: any) {
    let unTodoItem = this.completedTodoList.filter(
      (x) => x.id == serverDatas
    )[0];
    unTodoItem.status = false;
    let itemIndex = this.completedTodoList.indexOf(unTodoItem);
    this.completedTodoList.splice(itemIndex, 1);
    window.localStorage.setItem(
      'todos-Done-List',
      JSON.stringify(this.completedTodoList)
    );
    this.todos.push(unTodoItem);
    window.localStorage.setItem('todos-List', JSON.stringify(this.todos));
  }
  handelEventEdit(serverEditData: any) {
    if(this.editObject.isDisabled){
      this.editObject.isDisabled= false; 
      this.editObject = serverEditData;
      this.editObject.isDisabled = true;
    }else{
      this.editObject = serverEditData;
      serverEditData.isDisabled = true;
    }
  }
  handelEventDelete(serverDeleteData: any) {
    if (serverDeleteData.status) {
      let todoItem = this.completedTodoList.filter(
        (x) => x.id === serverDeleteData
      )[0];
      let itemIndex = this.completedTodoList.indexOf(todoItem);
      this.completedTodoList.splice(itemIndex, 1);
      window.localStorage.setItem(
        'todos-Done-List',
        JSON.stringify(this.completedTodoList)
      );
    } else {
      let todoItem = this.todos.filter((x) => x.id === serverDeleteData.id)[0];
      let itemIndex = this.todos.indexOf(todoItem);
      this.todos.splice(itemIndex, 1);
      window.localStorage.setItem('todos-List', JSON.stringify(this.todos));
    }
  }
  endTimeNotification(taskNotification: Todo) {
    var m1 = moment(new Date(taskNotification.dueDate));
    var m2 = moment(new Date());
    var m3 = (m1.diff(m2, 'minutes')+1) * 60;

  
    if (m3 > 0) {
      taskNotification.notification = setTimeout(() => {
        this.showNotifcation(taskNotification);
      }, m3 * 1000);
    }
  }

  sortByTasks() {
    let sortedTodos = _.sortBy(this.todos, [
      function (o) {
        return o.dueDate;
      },
    ]);
    return sortedTodos;
  }
  sortByDoneTasks() {
    let sortedDoneTodos = _.sortBy(this.completedTodoList, [
      function (o) {
        return o.dueDate;
      },
    ]);
    return sortedDoneTodos;
  }
  showNotifcation(endTaskTime: any) {
    const notification = new Notification(endTaskTime.dueDate, {
      body: endTaskTime.text,
    });
  }
  ngOnInit(): void {
    //Let's check if the browser supports notifications
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === 'granted') {
      // If it's okay let's create a notification
      for (let i = 0; i < this.todos.length; i++) {
        let taskNotification = this.todos[i];
        this.endTimeNotification(taskNotification);
      }
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === 'granted') {
          for (let i = 0; i < this.todos.length; i++) {
            let taskNotification = this.todos[i];
            this.endTimeNotification(taskNotification);
          }
        }
      });
    }

  }
}
