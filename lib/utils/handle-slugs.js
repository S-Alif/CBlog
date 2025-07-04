export function createSlug(title, blogId) {
    const maxLength = 60
    
    let slug = title
        .toLowerCase()
        .trim()
        .replace(/[^؀-ۿ\w\s-]/g, '')
        .replace(/\s+/g, '-')
    
    if (slug.length > maxLength) {
        const truncated = slug.slice(0, maxLength)
        const lastDash = truncated.lastIndexOf('-')
        slug = truncated.slice(0, lastDash !== -1 ? lastDash : maxLength)
    }
    
    return `${slug}-${blogId}`
}