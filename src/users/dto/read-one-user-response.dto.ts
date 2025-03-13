import { ApiProperty } from "@nestjs/swagger"

class Manager {
    /** Represents the manager identifier (UUID). *
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d" 
     */
    id: string

    /** Represents the name of the manager. *
     * @example "Manuel Ernesto"
     */
    name: string
}

class Role {
    /**
     * Represents the role identifier (UUID).
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"
     */
    id: string

    /**
     * Represents the name of the role.
     * @example "Member"
     */
    name: string

    /**
     * Represents the description of the role.
     * @example "This is a member role."
     */
    description: string | null
}

class Area {
    /** Represents the area identifier (UUID). 
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"
     */
    id: string
    
    /** Represents the name of the area. 
     * @example "SB24"
     */
    name: string

    /** Represents the description of the area. 
     * @example "This is the SB24 area."
     */
    description: string | null
}

class AccountTypes {
    /**
     * Represents the account type identifier (UUID).
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"
     */
    id: string

    /**
     * Represents the name of the account type.
     * @example "EA"
     */
    name: string

    /**
     * Represents the description of the account type.
     * @example "Elevate Account"
     */
    description: string | null
}

class AccountTypeForApplications {
    /**
     * Represents the account type identifier (UUID).
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"
     */
    id: string

    /**
     * Represents the name of the account type.
     * @example "EA"
     */
    name: string
}

class ApplicationsForAccountTypes {
    /**
     * Represents the application identifier (UUID).
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"
     */
    id: string

    /**
     * Represents the name of the application.
     * @example "SB24"
     */
    name: string
}

class AccountTypesApplicationsRead {
    accountType: AccountTypeForApplications

    applications: ApplicationsForAccountTypes[]
}

class ApplicationsForEntitlements {
    /**
     * Represents the application identifier (UUID).
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"
     */
    id: string

    /**
     * Represents the name of the application.
     * @example "SB24"
     */
    name: string
}

class Entitlement {
    /** Represents the entitlement identifier (UUID).
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"
     */
    id: string
    
    /** Represents the name of the entitlement.
     * @example "SB24.View"
     */
    name: string
}

class ApplicationsEntitlementsRead {
    application: ApplicationsForEntitlements

    entitlements: Entitlement[]
}

class User {
    /**
     * Represents the user identifier (UUID).
     * @example "f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d"
     */
    id: string

    /**
     * Represents the external identifier of the user.
     * @example "A255087"
     */
    externalId: string

    /**
     * Represents the name of the user.
     * @example "Evandro Silva"
     */
    name: string

    /**
     * Represents the email of the user.
     * @example "evandro.silva@standardbank.co.ao"
     */
    email: string

    /** Represents the manager of the user. */
    manager: Manager | null

    /** Represents the role of the user. 
     * There are 3 roles: Admin, Manager, Member
    */
    role: Role

    /** Represents the area of the user. */
    area: Area

    /** Represents the account types of the user. */
    accountTypes: AccountTypes[]

    /** Represents each account type of the user with its applications. */
    accountTypesApplications: AccountTypesApplicationsRead[]

    /** Represents each application of the user with its entitlements. */
    applicationsEntitlements: ApplicationsEntitlementsRead[]
}

export class ReadOneUserResponse {
    @ApiProperty({ type: () => User })
    user: User
}
