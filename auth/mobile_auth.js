const cheerio = require('cheerio');
const request = require('request-promise');
const Url     = require('url');

const url = 'https://m.vk.com';

let _cookies = null;

function auth(login, password)
{
    return new Promise(async (resolve,reject) => 
        {
            let login_url = await _getLoginUrl();
            request(login_url, {
                method : 'POST',
                headers : {
                    cookie : _cookies,
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
                },
                formData : {
                    email : login,
                    pass  : password
                },
            })
            .then(res => 
                {
                    reject(res);
                })
            .catch(err => 
                {
                    if(err.statusCode == 302)
                    {
                        let c = err.response.headers['set-cookie'];
                        for(let d of c)
                            _cookies.push(d);
                        let location = err.response.headers.location;
                        console.log(location, '\n')
                        if(!!Url.parse(location,true).query['__q_hash'])
                        {
                            request(location, {
                                method : 'GET',
                                headers : {
                                    // cookie : _cookies,
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Origin': 'https://m.vk.com',
                                    'Referer': 'https://m.vk.com/',
                                    'Upgrade-Insecure-Requests': '1',
                                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
                                }    
                            })
                            .then(response => 
                                {
                                    console.log('response')
                                    resolve(_cookies);
                                })
                            .catch(err => 
                                {
                                    console.log(err.response);
                                    resolve(_cookies);
                                })
                        }
                        else
                        {
                            reject('xyu');
                        }
                    }
                    else
                    {
                        reject(err);
                    }
                })
        }
    );
}

module.exports = auth;

async function _getLoginUrl()
{
    let html = await _getLoginPage(url);
    const $ = cheerio.load(html);
    let login_url = $('form').attr('action'); 
    return login_url;
}

async function _getLoginPage(uri)
{
    return await request(uri,function(err, response)
        {
            if(err)
            {
                console.log(err);
            }      
            else
            {
                console.log()
                _cookies = response.caseless.get('set-cookie');
                return response;
            }
        }
    );
}
