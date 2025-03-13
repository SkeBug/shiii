import { Type } from "class-transformer"
import { ArrayNotEmpty, ArrayUnique, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUUID } from "class-validator"

export class CreateUserRequest {
    
    /**
     * Represents the name of the user.
     * @example "Evandro Silva"
     */
    @IsString()
    @IsNotEmpty()
    name: string

    /**
     * Represents the external identifier of the user.
     * @example "A255087"
     */
    @IsString()
    @IsNotEmpty()
    externalId: string

    /**
     * Represents the email of the user.
     * @example "evandro.silva@standardbank.co.ao"
     */
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    /**
     * Represents the password of the user.
     * @example "Password@123"
     */
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @IsStrongPassword(
        { 
            minLength: 8, 
            minLowercase: 1, 
            minUppercase: 1, 
            minNumbers: 1, 
            minSymbols: 1 
        }
    ) 
    password: string

    /**
     * Represents the manager identifier (UUID) of the user.
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"
     */
    @IsString()
    @IsOptional()
    @IsUUID()
    managerId?: string

    /**
     * Represents the role identifier (UUID) of the user.
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d" 
     */
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    roleId: string

    /**
     * Represents the area identifier (UUID) of the user.
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"
     */
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    areaId: string

    /**
     * Represents the account types identifiers (UUID) of the user.
     * @example ["f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d", "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"]
     */
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    @IsOptional()
    accountTypes?: string[]

    /**
     * Represents the account types applications of the user.
     */
    // @ValidateNested({ each: true })
    // @ArrayNotEmpty()
    // @ArrayUnique()
    // @IsArray()
    // @IsOptional()
    // @Validate(AccountTypesApplications, { each: true })
    @Type(() => AccountTypesApplications)
    accountTypesApplications?: AccountTypesApplications[]

    /**
     * Represents the applications entitlements of the user.
     */
    // @ValidateNested({ each: true })
    // @ArrayNotEmpty()
    // @ArrayUnique()
    // @IsArray()
    // @IsOptional()
    // @Validate(ApplicationsEntitlements, { each: true })
    @Type(() => ApplicationsEntitlements)
    applicationsEntitlements?: ApplicationsEntitlements[]
} 

class AccountTypesApplications {
    /**
     * Represents the account type identifier (UUID) of the user.
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"
     */
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    accountTypeId: string

    /**
     * Represents the applications identifiers (UUID) per account type of the user.
     * @example ["f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d", "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"]
     */
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    applicationsId: string[]
}

class ApplicationsEntitlements {
    /**
     * Represents the applications identifiers (UUID) of the user.
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"
     */
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    applicationId: string

    /**
     * Represents the entitlements identifiers (UUID) per application of the user.
     * @example ["f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d", "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"]
     */
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    entitlementsId: string[]
}