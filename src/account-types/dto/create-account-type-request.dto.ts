import { IsNotEmpty, IsString } from "class-validator";

export class CreateAccountTypeRequest {
    /**
     * Represents the account type name.
     * @example "EA"
     */
    @IsString()
    @IsNotEmpty()
    name: string

    /**
     * Represents the account type description.
     * @example "Elevated Account"
     */
    @IsString()
    @IsNotEmpty()
    description: string
}
