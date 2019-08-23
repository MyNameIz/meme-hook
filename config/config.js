const path = require('path');

module.exports = {
    profile : {
        login       : '+380',
        password    : 'root',
        id          : 'uid'
    },
    upload : {
        vk : {
            url : 'https://vk.com/worldgutter',
            id  : 'uid'
        },
        telegram : '@worldgutter',
        instagram : ''
    },
    apiVK : {
        bots_longpoll : 'api_key',
        userAccessToken : 'acces_token'
    },
    apiTelegram : 'tg_api_key',
    rootDir : path.join(__dirname, '../'),
    images  : 'images',
    logDir  : 'logs',
    db : {
        user : 'u',
        psw  : 'psw',//'yourmemesaremine',
        db   : 'db',
        host : 'localhost',
        port : 27017
    }
}


