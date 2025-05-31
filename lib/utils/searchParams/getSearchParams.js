export const getSearchParams = (req) => {
    const { searchParams } = new URL(req.url)
    const params = Object.fromEntries(searchParams.entries())
    return params
}