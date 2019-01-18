module.exports = function(cookies_arr, new_cookies)
{
    if(typeof(new_cookies)=="string")
    {
        cookies_arr = PUTorPUSH(cookies_arr, new_cookies);
        return cookies_arr;
    }
    else if(new_cookies instanceof Array)
    {
        for(let el of new_cookies)
        {
            cookies_arr = PUTorPUSH(cookies_arr, el);
        }
        return cookies_arr;
    }
    else
        throw "Wrong params : 1";
}

function PUTorPUSH(arr, value)
{
    let val_name = value.match(/^[a-zA-Z0-9_]*/)[0];
    // console.log(val_name);
    for(let index in arr)
    {
        let name = arr[index].match(/^[a-zA-Z0-9_]*/)[0];
        // console.log(name);
        if(val_name==name)
        {
            arr[index]=value;
            return arr;
        }
    }
    arr.push(value);
    return arr;
}

module.exports.insertCookieValue = function(cookies_arr, name, value, domain)
{
    if(typeof(name)=="string"&&typeof(value)=="string")
    {
        let cookie = `${name}=${value}; expires=; path=/; domain=${domain}`;
        cookies_arr.push(cookie);
        return cookies_arr;
    }
    else
        throw "Wrong params : 1";
}

module.exports.removeValue = function(cookies_arr, name)
{
    if(typeof(name)=="string")
    {
        for(let index in cookies_arr)
        {
            let Name = cookies_arr[index].match(/^[a-zA-Z0-9_]*/)[0];
            if( Name == name )
            {
                cookies_arr.splice(index,1);
                return cookies_arr;
            }
        }
    }
    else
        throw "Wrong params : 1";
}

module.exports.showValue = function(cookies_arr, name)
{
    if(typeof(name)=="string")
    {
        for(let str of cookies_arr)
        {
            let Name = str.match(/^[a-zA-Z0-9_]*/)[0];
            if( Name == name )
            {
                console.log(str);
                break;
            }
        }
    }
    else
        throw "Wrong params : 1";
}