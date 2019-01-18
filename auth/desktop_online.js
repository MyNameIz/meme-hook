const request = require('request-promise');

module.exports = function(ref, id)
{
    return new Promise((resolve, reject) => 
        {
            if(typeof(ref)=="string"&&typeof(id)=="string")
            {
                request(`https://r3.mail.ru/k?vk_id=${ ref }&src=desktop`,
                    {
                        headers : {
                            referer : ref,
                            'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64)'
                        }
                    },
                    
                    function(err ,response)
                    {
                        if(err)
                        {
                            console.error(err);
                            reject(err);
                            return ;
                        }
                        resolve(true);
                        return ;
                    }
                )
            }
            else
                throw "Wrong params to be the desktop user.";
        }
    );
}