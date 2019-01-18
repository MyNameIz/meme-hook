const cheerio = require('cheerio');
const request = require('request-promise');
const Url     = require('url');

const cookiesUpdate = require('../cookies/cookies');

const url = 'https://vk.com';

let _cookies = [
    'remixdt=-3600; expires=; path=/; domain=.vk.com',
    'remixflash=0.0.0; expires=; path=/; domain=.vk.com',
    'remixscreen_depth=24; expires=; path=/; domain=.vk.com',
    'remixscreen_orient=1; expires=; path=/; domain=.vk.com'
];

function auth(login, password)
{
    return new Promise(async (resolve,reject) => 
        {
            let form = await _getLoginForm();
            form[1].email = login;
            form[1].pass = password;
            request(form[0], {
                method : 'POST',
                headers : {
                    cookie : _cookies,
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)'
                },
                formData : form[1]
            })
            .catch(err => 
                {
                    if(err.statusCode == 302)
                    {
                        _cookies = cookiesUpdate(_cookies, err.response.headers['set-cookie']);
                        let location = err.response.headers.location;
                        if(!!Url.parse(location,true).query['__q_hash'])
                        {
                            request(location, {
                                method : 'GET',
                                headers : {
                                    cookie : _cookies,
                                    referer : 'https://vk.com',
                                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64)'
                                }    
                            },
                            async function(err, response)
                            {
                                if(err)
                                {
                                    console.log(err.response.headers);
                                    cookiesUpdate(_cookies, err.response.headers['set-cookie']);
                                    resolve(_cookies);
                                }
                                cookiesUpdate(_cookies, response.caseless.get('set-cookie'));
                                resolve(_cookies);
                            });
                        }
                        else
                        {
                            reject(false);
                        }
                    }
                    else
                    {
                        console.log('error')
                        reject(err);
                    }
                })
        }
    );
}

module.exports = auth;

async function _getLoginForm()
{
    let form = {};
    let html = await _getLoginPage(url);
    const $ = cheerio.load(html);
    let login_url = $('form').attr('action');
    form.act = $('[name="act"]').attr('value');
    form.role = $('[name="role"]').attr('value');
    form.expire = $('[name="expire"]').attr('value');
    form._origin = $('[name="_origin"]').attr('value');
    form.ip_h = $('[name="ip_h"]').attr('value');
    form.lg_h = $('[name="lg_h"]').attr('value');
    return [ login_url, form];
}

async function _getLoginPage(uri)
{
    return await request(uri,
        {
            headers : {
                referer : 'https://www.google.com/',
                'user-agent' : 'Mozilla/5.0 (X11; Linux x86_64)',
                cookie  : _cookies
            }
        },
        function(err, response)
        {
            if(err)
            {
                console.log(err);
            }      
            else
            {
                _cookies = cookiesUpdate(_cookies, response.caseless.get('set-cookie'));
                return response;
            }
        }
    );
}
