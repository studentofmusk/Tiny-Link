function isValidCode(code){
    return /^[A-Za-z0-9]{6,8}$/.test(code);
}

function isValidUrl(urlString){
    try{
        const url = new URL(urlString);
        
        return url.protocol === 'http:'|| url.protocol === 'https:';
    }catch(error){
        return false;
    }
}

module.exports = {
    isValidCode,
    isValidUrl
}