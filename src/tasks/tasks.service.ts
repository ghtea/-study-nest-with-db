import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deepStrictEqual } from 'node:assert';
import { stat } from 'node:fs';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[]{
  //   const {status, search} = filterDto;

  //   let tasks = this.getAllTasks();
  //   if (status){
  //     tasks = tasks.filter(task=>task.status === status);
  //   }
  //   if (search){
  //     tasks = tasks.filter(task=>
  //       task.title.includes(search) || 
  //       task.description.includes(search)
  //     );
  //   }

  //   return tasks;
  // }
  
  async getTaskById(id: number): Promise<Task>{
    const found = await this.taskRepository.findOne(id);
    if (!found){
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    else {
      return found;
    }
  }
  // getTaskById(id:string): Task{
  //   const found = this.tasks.find(task=>task.id===id);
  //   if (!found){
  //     throw new NotFoundException();
  //   }
  //   else {
  //     return found;
  //   }
  // }

  

  async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTaskById(id: number): Promise<void>{
    const result = await this.taskRepository.delete(id);
    
    if (result.affected === 0){
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(id:number, status: TaskStatus): Promise<Task>{
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

}
