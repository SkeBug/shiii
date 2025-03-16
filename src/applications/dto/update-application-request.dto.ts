import { PartialType } from '@nestjs/swagger';
import { CreateApplicationRequest } from './create-application-request.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateApplicationRequest extends PartialType(CreateApplicationRequest) {
    /**
     * Represents the active status of the application.
     * @example false
     */
    @IsOptional()
    @IsBoolean()
    active?: boolean
}
