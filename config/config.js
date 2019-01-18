const path = require('path');

module.exports = {
    profile : {
        login       : '+380955396632',
        password    : 'ulafol5',
        id          : '321220269'
    },
    upload : {
        vk : {
            url : 'https://vk.com/worldgutter',
            id  : '138075553'
        },
        telegram : '@worldgutter',
        instagram : ''
    },
    apiVK : {
        bots_longpoll : 'a2b35ab3a5d6c4d3f01316a72b1276643cd970c0c44b09ebb4a8ca109142c0e46a247aebf8757451c3d6b',
        userAccessToken : '2d42992ef5fee0e99817be59f87e311179383d1df7dd3e3a89b0692f4533b902c8a5a7364c48f1975e37a'
    },
    apiTelegram : '681075129:AAH6_bX0ya9jrzM8ZlrqloYAilSIRnBsXpI',
    rootDir : path.join(__dirname, '../'),
    images  : 'images',
    logDir  : 'logs',
    db : {
        user : 'meme-bot',
        psw  : 'yourmemesaremine0',//'yourmemesaremine',
        db   : 'memeHook',
        host : 'localhost',
        port : 27017
    }
}
// nothing to commit, that's why i did this comment

