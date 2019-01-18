const TelegramBot   = require('node-telegram-bot-api');

const fs            = require('fs');
const request       = require('request-promise');

var OFFICIAL = true;

var toggleOFFICIAL = function()
{
    if(OFFICIAL)
    {
        OFFICIAL = false;
        console.log('OFFICIAL',OFFICIAL);
        setTimeout(() =>
            {
                console.log('OFFICIAL',OFFICIAL);
                OFFICIAL = true;
            },
            1000*60*29
        );
    }
}

module.exports.Uploader = class Uploader {
    constructor(cookies, telegram_token)
    {
        if(cookies&&telegram_token)
        {
            this.cookie = cookies;
            this.telegram = new TelegramBot(telegram_token, { polling : false });
            console.log('Uploader is loaded!');
        }
        else throw "No cookies is given";
    }

    uploadVK(url, id, record)
    {
        return new Promise(async (resolve, reject) =>
            {
                let data = await this.getUploadData(url);
                let pr = [];
                if(data.post_hash)
                {
                    if(record.images.length < 1 || record.images.length > 10) throw "No images or there are too mush images for one record.";
                    for(let image of record.images) pr.push(this.uploadImage(image, data.upload, url));
                    Promise.all(pr)
                    .catch(err => { throw err; })
                    .then(res =>
                        {
                            let form = {
                                al : 1,
                                act : 'post',
                                to_id : `-${id}`,
                                type : 'all',
                                friends_only : '',
                                status_export : '',
                                facebook_export : '',
                                close_comments : 0,
                                mute_notifications : '',
                                mark_as_ads : 0,
                                official : !OFFICIAL?'':1,
                                poster_bkg_id : '',
                                signed : '',
                                anonymous : '',
                                hash : data.post_hash,
                                from : '',
                                fixed : '',
                                Message : record.text.toString(),
                            };
                            res.map((val, ind) => 
                                {
                                    console.log(val);
                                    form[`attach${ind+1}_type`] = 'photo';
                                    form[`attach${ind+1}`] = val;
                                }
                            );
                            if ( OFFICIAL ) toggleOFFICIAL();
                            console.log(form, typeof(form));
                            request("https://vk.com/al_wall.php", 
                                    {
                                        method : 'POST',

                                        headers : {
                                            cookie : this.cookie,
                                            origin : 'https://vk.com',
                                            referer : url,
                                            'user-agent' : 'Mozilla/5.0 (X11; Linux x86_64)',
                                        },

                                        formData : form
                                    },
                                    (err, response) =>
                                    {
                                        if (err) console.error(err.response.headers);
                                        else
                                        {
                                            console.log('VK Upload', response.statusCode);
                                            resolve(200);
                                        }
                                    }
                                );
                        }    
                    );
                }
                else throw "No post_hash";
            }
        );
    }

    uploadTelegram(chat_id, record)
    {
        return new Promise(async (resolve, reject) =>
            {
                let pr = [];
                if (record.images.length==1) pr.push(this.telegram.sendPhoto(chat_id, record.images[0].path, { caption : record.text })); 
                if(record.images.length > 1) 
                {
                    let photos = [];
                    pr.push(this.telegram.sendMessage(chat_id, record.text));
                    for(let image of record.images) photos.push({ type : 'photo', media : image.path });
                    pr.push(this.telegram.sendMediaGroup(chat_id, photos));
                }
                await Promise.all(pr)
                .then(res => 
                    {
                        console.log('Telegram Upload', 200);
                        resolve(200)
                    })
                .catch(err => reject(err));
                return;
            }
        )
    }

    async uploadImage(image, upload, ref)
    {
        let data = upload.params;
        var url = `${upload.url}?act=${data.act}&aid=${data.aid}&ajx=1&from_host=${data.from_host}&gid=${data.gid}&hash=${data.hash}&jpeg_quality=89&mid=${data.mid}&rhash=${data.rhash}&vk=${data.vk}`;
        return new Promise(async (resolve, reject) =>
            {
                if(fs.existsSync(image.path)&&typeof(upload)=="object")
                {
                    await request(url,
                        {
                            method : 'POST',
                            headers : {
                                'content-type' : 'multipart/form-data',
                                origin : 'https://vk.com',
                                referer : ref,
                                'user-agent' : 'Mozilla/5.0 (X11; Linux x86_64)',
                            },
                            formData : {
                                photo : fs.createReadStream(image.path),//bytes.toString('base64')
                            }
                        },
                        async (err, response) =>
                        {
                            if (err) reject(err);
                            else
                            {
                                let attach_id = await this.chooseUploaded(JSON.parse(response.body), ref);
                                if(attach_id) resolve(attach_id);
                                else reject("No id");
                            }
                        }
                    );
                }
                else
                    reject("No image or data is given.");
            }
        );
    }

    getUploadData(url)
    {
        return new Promise(async (resolve, reject) =>
            {
                // try to remove headers from request and send it
                // then try to get link from response and open it at browser without cookies
                // may be something interesting will happen
                // it can be some kind of vulnerability ... 
                await request(url, 
                    {
                        method : 'GET',
                        headers : {
                            referer : url,
                            origin : 'https://vk.com',
                            cookie : this.cookie,
                            'user-agent' : 'Mozilla/5.0 (X11; Linux x86_64)',
                        }
                    },
                    (err, response) =>
                    {
                        if (err) reject(err);
                        else 
                        {
                            let data = {};
                            data.post_hash = response.body.match(/"post_hash":"([0-9a-zA-Z]*)"/g)[0].match(/"[0-9a-zA-Z]*"/)[0].replace(/"/g,'');
                            data.upload = JSON.parse(response.body.match(/"upload":[{][^}]*[}]/g)[0].match(/[{][^}]*[}]/g)[0]+'}');
                            resolve(data);
                        }
                    }
                );
            }
        );
    }

    async chooseUploaded(resp, ref)
    { 
        return new Promise(async (resolve, reject) =>
            {
                await request('https://vk.com/al_photos.php',
                    {
                        method : 'POST',
                        headers : {
                            'content-type' : 'application/x-www-form-urlencoded',
                            origin : 'https://vk.com',
                            referer : ref,
                            cookie : this.cookie,
                            'user-agent' : 'Mozilla/5.0 (X11; Linux x86_64)',
                        },
                        formData : {
                            act : 'choose_uploaded',
                            aid : resp.aid,
                            al : 1,
                            gid : resp.gid,
                            hash : resp.hash,
                            is_reply : 0,
                            mid : resp.mid,
                            photos : resp.photos,
                            server : resp.server
                        }
                    },
                    (err, response) =>
                    {
                        if (err) throw err;
                        else
                        {
                            let rx = new RegExp(resp.mid+'_[0-9]*','g');
                            let attachID = response.body?response.body.match(rx)[0]:null;
                            if (attachID) resolve(attachID);
                            else reject("No attacment ID");
                        }
                    }
                );
            }
        );
    }
}

