import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

class AccountType {
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

export class ReadOneAccountTypesResponse {
    /**
     * Represents the account types.
     * @example { "name": "EA", "description": "Elevated Account" }
     */
    @ApiProperty({ type: () => AccountType })
    accountType: AccountType
}