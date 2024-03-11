import {
    createSearchParamsCache,
    parseAsInteger,
    parseAsString,parseAsStringEnum
} from 'nuqs/server'

enum OrderBy {
    asc = "asc",
    desc = "desc"
}
export const searchParamsCache = createSearchParamsCache({
    track: parseAsString,
    challenge:parseAsString,
    orderBy:parseAsStringEnum<OrderBy>(Object.values(OrderBy))
})