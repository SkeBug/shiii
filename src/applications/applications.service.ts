import { Injectable } from '@nestjs/common';
import { CreateApplicationRequest } from './dto/create-application-request.dto';
import { UpdateApplicationRequest } from './dto/update-application-request.dto';

@Injectable()
export class ApplicationsService {
  async create(createApplicationRequest: CreateApplicationRequest) {
    return 'This action adds a new application - method not implemented yet';
  }

  async findAll(): Promise<any> {
    return `This action returns all applications - method not implemented yet`;
  }

  async findOne(id: string): Promise<any> {
    return `This action returns application with ID: ${id} - method not implemented yet`;
  }

  update(id: string, updateApplicationDto: UpdateApplicationRequest) {
    return `This action updates application with ID: ${id} - method not implemented yet`;
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
