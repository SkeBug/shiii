export class Meta {
    /** Represents the total number of elements.
     * @example 100
    */
    total: number

    /** Represents the current page.
     * @example 1
    */
    currentPage: number
    
    /** Represents the last page.
     * @example 10
    */
    lastPage: number
    
    /** Represents the number of elements per page.
     * @example 10
    */
    limit: number

    /** Represents the previous page URL.
     * @example "/resource?page=1&limit=10"
    */
    prev: string | null
    
    /** Represents the next page URL.
     * @example "/resource?page=3&limit=10"
    */
    next: string | null
}