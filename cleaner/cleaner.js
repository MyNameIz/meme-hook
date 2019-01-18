const easyvk            = require('easyvk');

const config        = require('../config/config');

easyvk({
    access_token : config.apiVK
}).then(vk =>
    {
        const LPB = vk.bots.longpoll;
        if(typeof(LPB)=="object") console.log('Wall cleaner initialized!');
        LPB.connect({
            forGetLongPollServer : {
                need_pts : 0,
                group_id : config.upload.vk.id,
                lp_version : 2
            },
            forLongPollServer: {
                wait : '10',
            }
        }).then(({connection}) => {
            connection.on('wall_post_new', (post) => 
                {
                    if (post.from_id != config.profile.id && post.from_id != post.owner_id)
                        vk.call("wall.delete", { owner_id : post.owner_id, post_id : post.id })
                        .then(res => console.log("Wall cleaned:", JSON.stringify(res.vkr)))
                        .catch(error => console.error(error));
                }
            );
        })
    });