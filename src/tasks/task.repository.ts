import { InternalServerErrorException, Logger } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  private logger = new Logger('TasksController');


  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>{
    const {status, search} = filterDto;
    const query = this.createQueryBuilder('task');

    if (status){
      query.andWhere('task.status = :status', {status})
    }

    if (search){
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`});
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    }
    catch (e){
      this.logger.error(`Failed to get tasks`)
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description} = createTaskDto;
    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;

    try {
      await task.save();
    }
    catch (e){
      this.logger.error(`Failed to create tasks for data: ${createTaskDto}`, e.stack);
      throw new InternalServerErrorException();
    }

    return task;
  }


}