

export function setParamsInUrl(url, params) {
    let newUrl = url
    Object.keys(params).forEach((key, index) => {
        const value = params[key]
        if(index === 0) newUrl = `${newUrl}?${key}=${value}`
        else newUrl = `${newUrl}&${key}=${value}`
    })
    
    return newUrl
 }
