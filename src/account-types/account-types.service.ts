import { Injectable } from '@nestjs/common';
import { CreateAccountTypeRequest } from './dto/create-account-type-request.dto';

@Injectable()
export class AccountTypesService {
  async create(accountType: CreateAccountTypeRequest) {
    return 'This action adds a new accountType - method not implemented yet';
  }

  async findAll(): Promise<any> {
    return 'This action returns all accountTypes - method not implemented yet';
  }

  async findOne(id: string): Promise<any> {
    return `This action returns a #${id} accountType - method not implemented yet`;
  }

  async update(id: string, accountType: any) {
    return `This action updates a #${id} accountType - method not implemented yet`;
  }

  async remove(id: string) {
    return `This action removes a #${id} accountType`;
  }
}
