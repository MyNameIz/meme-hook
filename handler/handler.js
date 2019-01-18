const mongoose          = require('mongoose');
const fs                = require('fs');

const imageModel        = require('../models/image');
const recordModel       = require('../models/record');
const { Uploader }      = require('../uploader/uploader');

const config            = require('../config/config');

const upload            = config.public;

module.exports.Handler = class Handler {
    constructor()
    {
    }

    async handle(record, cookie)
    {
        var self = this;
        if(typeof(record)=="object")
        {
            let flag = await this.hasCollisionImages(record.images);
            if(!flag&&record.images.length>0)
            {
                await this.saveImages(record.images);
                await this.saveRecord(record);
                console.log('RECORD',record,'RECORD');
                let uploader = new Uploader(cookie, config.apiTelegram);
                Promise.all([
                    uploader.uploadTelegram(config.upload.telegram, record),
                    uploader.uploadVK(config.upload.vk.url, config.upload.vk.id, record)
                ])
                .then(res => 
                    {
                        for(let image of record.images)
                        {
                            fs.unlink(image.path, () => {});
                        }
                    }  
                )
                .catch(res => 
                    {
                        for(let image of record.images)
                        {
                            fs.unlink(image.path, () => {});
                        }
                    }
                );
                return;
            }
            else
            {
                console.log('repeated image detected');
                record.images.map(val => del(val.path));
                return;
            }
        }
        else
            throw "HANDLER : No record got"
    }

    async hasCollisionImages(images)
    {
        var flag = false;
        if(typeof(images)=="object")
        {
            let pr = [];
            images.map((value) => 
                {
                    console.log(`hash=${value.hash}`)
                    pr.push(imageModel.findOne({ hash : value.hash }, (err, res) => 
                        {
                            if(err) console.error(err);
                        }
                    ))
                }
            );
            await Promise.all(pr)
                .catch(err =>
                    {
                        console.error(err);
                    })
                .then(result =>
                    {
                        result.map((val) => { if(val) flag = true; });
                    });
            return flag;
        }
        else
            throw "HANDLER : can not check images for collisions."
    }

    async saveRecord(record)
    {
        if(typeof(record)=="object")
            await recordModel.create(record, function(err, res)
                {
                    if (err) console.error(err);
                    return res;
                }
            )
        else
            throw "HANDLER : Nothing to cacnel"
    }

    async saveImages(images)
    {
        if(typeof(images)=="object")
            await imageModel.create(images,function(err,res)
                {
                    if(err) console.error(err);
                    return res;
                }
            )
        else throw "HANDLER : Nothing to cacnel"
    }
}

function del(path)
{
    if(fs.existsSync(path)) fs.unlinkSync(path);
    else throw `${path} doesn't exist`
}