export class AccountTypeDto {
    /**
     * Represents the account type id (UUID).
     * @example "123e4567-e89b-12d3-a456-426614174000"
     */
    id: string
    
    /**
     * Represents the account type name.
     * @example "EA"
     */
    name: string

    /**
     * Represents the account type description.
     * @example "Elevated Account"
     */
    description: string

    /**
     * Represents the account type status.
     * @example true
     */
    active: boolean

    /**
     * Represents the account type creation date.
     * @example "2021-10-07T20:00:00.000Z"
     */
    createdAt: Date

    /**
     * Represents the account type update date.
     * @example "2021-10-07T20:00:00.000Z"
     */
    updatedAt: Date
}