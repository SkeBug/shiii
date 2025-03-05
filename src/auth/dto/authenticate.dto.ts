import { IsNotEmpty, IsString } from "class-validator";

export class AuthenticateDto {
  @IsString()
  @IsNotEmpty()
  readonly userEmail: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string
}