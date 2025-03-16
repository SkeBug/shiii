export class ApplicationDto {
    /**
     * Represents the application id (UUID).
     * @example "123e4567-e89b-12d3-a456-426614174000"
     */
    id: string;

    /**
     * Represents the application name.
     * @example "SB24"
     */
    name: string;

    /**
     * Represents the application description.
     * @example "The internet banking application"
     */
    description: string;

    /**
     * Represents the application status.
     * @example true
     */
    active: boolean;

    /**
     * Represents the application creation date.
     * @example "2021-10-07T20:00:00.000Z"
     */
    createdAt: Date;

    /**
     * Represents the application update date.
     * @example "2021-10-07T20:00:00.000Z"
     */
    updatedAt: Date;
}