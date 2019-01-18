const request = require('request-promise');
const cheerio = require('cheerio');
const PATH    = require('path');
const fs      = require('fs');
const crypto  = require('crypto');

const images  = require('../config/config').images;

module.exports = function(eventString, cookies)
{
    return new Promise(async (resolve, reject) => 
        {
            if(typeof(eventString)=="string")
            {
                let postID = eventString.match(/wall-[0-9_]*/)[0];
                let postURL = `https://m.vk.com/${ postID }`;
                let html = await request(postURL, 
                    {
                        method : 'GET',
                        headers : {
                            cookie : cookies
                        }
                    },
                    function(err, response)
                    {
                        if(err)
                        {
                            console.log(err.response.headers);
                        }
                        else
                        {
                            return response.body;            
                        }
                    }
                );
                const $ = cheerio.load(html);
                let ads = hasAds($);
                console.log('Has ads:', ads);
                if(ads) reject("Has ads");
                let arr = await (getPostMemes($));
                if(arr)
                    resolve({
                        text   : getPostText($),
                        images  : arr,
                        origin : postURL, 
                    });
                else
                    resolve(null);
            }
            else
                throw "Wrong params.";
        }
    );
}

function hasAds(html)
{
    if(html)
    {
        if(html('div.wi_body div.pi_text a').length > 0) return true;
        else return false;
    }
    else throw "No HTML";
}

function getPostText(html)
{
    if(html)
        return html('div.wi_body div.pi_text').text();
    else
        throw "No HTML";
}

async function getPostMemes(html)
{
    var $ = html;
    return new Promise(async (resolve, reject) =>
        {
            let meme_arr = [];
            let imgURL = [];
            $('div.wi_body').find('div.thumb_map_img').map((index,el) => 
                {
                    imgURL.push($(el).attr('data-src_big').split('|')[0]);
                }
            );
            if(imgURL.length > 0)
            {
                let pr = [];
                let i = 0;
                imgURL.map((val) => 
                    {
                        pr.push(new Promise((resolve, reject) =>
                            {
                                let imgNAME = `${Date.now().toString()}_${i++}.jpg`;
                                let imgPATH = PATH.join(images, imgNAME);
                                request(val, async (err,res) =>
                                    {
                                        if(err) reject(err);
                                        let hash;
                                        await Promise.all([getMD5Hash(imgPATH)])
                                        .then(result => hash = result[0]);
                                        meme_arr.push({
                                            name : imgNAME,
                                            path : imgPATH,
                                            url  : val,
                                            hash : hash,
                                        });
                                        resolve(true);
                                    }
                                ).pipe(fs.createWriteStream(imgPATH));
                            }
                        ));
                    }
                );
                await Promise.all(pr)
                .catch(err => console.error(err))
                .then(res =>
                    {
                        resolve(meme_arr);
                        return;
                    })
            }
            else
                resolve(null);
        }
    );
}

function getMD5Hash(path)
{
    return new Promise((resolve, reject) =>
        {
            let h = crypto.createHash('md5');
            fs.createReadStream(path)
                .on('data', (data) => h.update(data))
                .on('close', () => 
                {
                    h = h.digest('hex');
                    resolve(h)
                });
        }
    );
}

