import { ApiProperty } from "@nestjs/swagger";
import { Meta } from "src/common/dto/meta.dto";
import { ApplicationDto } from "./common/application.dto";

export class ReadAllApplicationsResponse {
    /**
     * Represents the applications.
     */
    @ApiProperty({ type: [ApplicationDto] })
    applications: ApplicationDto[];

    @ApiProperty({ type: () => Meta })
    meta: Meta;
}