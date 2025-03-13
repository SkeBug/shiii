import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"
import { Meta } from "src/common/dto/meta.dto";

class AccountTypes {
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

export class ReadAllAccountTypesResponse {
    /**
     * Represents the account types.
     * @example [{ "name": "EA", "description": "Elevated Account" }]
     */
    @ApiProperty({ type: [AccountTypes] })
    accountTypes: AccountTypes[];

    @ApiProperty({ type: () => Meta })
    meta: Meta;
}