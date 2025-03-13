import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create.user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserRequest extends PartialType(CreateUserDto) {
    /**
     * Represents the active status of the user.
     * @example false
     */
    @IsOptional()
    @IsBoolean()
    active?: boolean
}
