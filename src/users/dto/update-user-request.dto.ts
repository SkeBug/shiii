import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUserRequest } from './create-user-request.dto';

export class UpdateUserRequest extends PartialType(CreateUserRequest) {
    /**
     * Represents the active status of the user.
     * @example false
     */
    @IsOptional()
    @IsBoolean()
    active?: boolean
}
