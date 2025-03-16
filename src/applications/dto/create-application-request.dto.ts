import { IsNotEmpty, IsString } from "class-validator";

export class CreateApplicationRequest {
    /**
     * Represents the application name.
     * @example "SB24"
     */
    @IsString()
    @IsNotEmpty()
    name: string

    /**
     * Represents the application description.
     * @example "The internet banking application"
     */
    @IsString()
    @IsNotEmpty()
    description: string
}
