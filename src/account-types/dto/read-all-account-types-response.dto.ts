import { ApiProperty } from "@nestjs/swagger";
import { Meta } from "src/common/dto/meta.dto";
import { AccountTypeDto } from "./common/account-type.dto";

export class ReadAllAccountTypesResponse {
    @ApiProperty({ type: () => [AccountTypeDto] })
    accountTypes: AccountTypeDto[];

    @ApiProperty({ type: () => Meta })
    meta: Meta;
}