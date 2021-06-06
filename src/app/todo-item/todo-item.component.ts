import { Component, Input, OnInit ,EventEmitter, Output } from '@angular/core';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent implements OnInit {
  
  @Input()
  todo: Todo = {
    dueDate: '',
    id: 0,
    text: '',
    status: false,
    notification:null,
    isDisabled:false
  };
  
  @Output() complete  = new EventEmitter<{id:number}>();
  @Output() edit= new EventEmitter<{}>();
  @Output() delete= new EventEmitter<{}>();
  
  constructor() {
   
  }
  
isComplete(id: any){
  console.log(id)
  
  this.complete.emit(id)
}

isEdit(item: any){
  this.edit.emit(item)
}
isDelete(item: any){
  this.delete.emit(item)
}
  ngOnInit(): void {

  }
}
