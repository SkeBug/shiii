import { ApiProperty } from "@nestjs/swagger";
import { ApplicationDto } from "./common/application.dto";

export class ReadOneApplicationResponse {
    /**
     * Represents the application.
    */
    @ApiProperty({ type: ApplicationDto })
    application: ApplicationDto;
}