import { ApiProperty } from "@nestjs/swagger"
import { AccountType } from "./common/account-type.dto"

export class ReadOneAccountTypesResponse {
    /**
     * Represents the account types.
     * @example { "name": "EA", "description": "Elevated Account" }
     */
    @ApiProperty({ type: () => AccountType })
    accountType: AccountType
}