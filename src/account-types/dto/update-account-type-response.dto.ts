import { PartialType } from '@nestjs/swagger';
import { CreateAccountTypeRequest } from './create-account-type-request.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAccountTypeRequest extends PartialType(CreateAccountTypeRequest) {
    /**
     * Represents the active status of the user.
     * @example false
     */
    @IsOptional()
    @IsBoolean()
    active?: boolean
}
