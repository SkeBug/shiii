import { ApiProperty } from "@nestjs/swagger"
import { UserDto } from "./common/user.dto"
export class ReadOneUserResponse {
    @ApiProperty({ type: () => UserDto })
    user: UserDto
}