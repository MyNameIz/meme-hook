const { VKApi, ConsoleLogger, BotsLongPollUpdatesProvider }      = require('node-vk-sdk');

const config                                                     = require('../config/config');

let api = new VKApi({
    token : config.apiVK.userAccessToken
})

let bot_api = new VKApi({
    lang   : 'ru',
    token  : config.apiVK.bots_longpoll,
    logger : new ConsoleLogger,
});

let updatesProvider = new BotsLongPollUpdatesProvider(bot_api, config.upload.vk.id);

console.log('Wall cleaner initialized!');

updatesProvider.getUpdates(updates =>
    {
        if(updates.length > 0)
        updates.map(val =>
            {
                if(val.type == "wall_post_new")
                {
                    let post = val.object;
                    if(post.from_id!=post.owner_id&&post.from_id!=config.profile.id) 
                    {
                        api.wallDelete({ access_token : config.apiVK.userAccessToken, owner_id : post.owner_id, post_id : post.id })
                        .catch(err => console.log(err))
                        .then(res => console.log('New Post Deleted:',res));
                        console.log('New post:', post.id, post.text);
                    }
                }
            }
        );
    }
);