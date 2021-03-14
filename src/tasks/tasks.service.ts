import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.module';
import {v1 as uuid} from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[]{
    const {status, search} = filterDto;

    let tasks = this.getAllTasks();
    if (status){
      tasks = tasks.filter(task=>task.status === status);
    }
    if (search){
      tasks = tasks.filter(task=>
        task.title.includes(search) || 
        task.description.includes(search)
      );
    }

    return tasks;
  }

  getTaskById(id:string): Task{
    const found = this.tasks.find(task=>task.id===id);
    if (!found){
      throw new NotFoundException();
    }
    else {
      return found;
    }
  }

  updateTaskStatus(id:string, status: TaskStatus){
    const task  = this.getTaskById(id);
    task.status = status; // 참조 유지된다 즉, 원래 있던 객체가 수정되게 된다
    return task;
  }

  createTask(createTaskDto: CreateTaskDto){

    const { title, description} = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN
    };

    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id:string): void {
    // 에러 발생하는 것도 포함한다
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter(e=>e.id !== id);
  }

}
