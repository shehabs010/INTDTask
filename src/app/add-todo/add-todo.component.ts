import { Component, OnInit, Output, EventEmitter, Input , OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import {FormGroup,FormControl,Validators, FormControlName} from '@angular/forms'
import { Todo } from '../models/todo.model';


@Component({
  selector: 'add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {
  @Output() todoAdded= new EventEmitter<Todo>();
  @Input() nwItem: any;
  todoForm:FormGroup;
  inputValue:string = '';
  dueDate:string= new Date().toString();
  
  constructor() {

    this.todoForm = new FormGroup({
    id: new FormControl(null),
    text:new FormControl('',[Validators.required]),
    dueDate:new FormControl('',[Validators.required]),
    status:new FormControl(false),
  }); }
  
  ngOnInit(): void {
    var today = new Date().toISOString();
    var iso = today.substring(0,today.length-1);
    document.getElementsByName("date-time")[0].setAttribute('min', iso)
  }


  ngOnChanges(changes:SimpleChanges){
    if(changes && changes.nwItem && changes.nwItem.currentValue){
      this.todoForm.patchValue(changes.nwItem.currentValue)
    }
  }
  addNewTodo(){
    //console.log(this.todoForm)
    this.todoAdded.emit(this.todoForm.value)
    this.todoForm.reset();
    this.todoForm.patchValue({
     
      status:false
    })
  }
  
}
