import { ApiProperty } from "@nestjs/swagger";
import { Meta } from "src/common/dto/meta.dto";
import { AccountType } from "./common/account-type.dto";

export class ReadAllAccountTypesResponse {
    @ApiProperty({ type: () => [AccountType] })
    accountTypes: AccountType[];

    @ApiProperty({ type: () => Meta })
    meta: Meta;
}