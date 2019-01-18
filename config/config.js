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
    apiVK : '7b5b2d194a837b36b75c9bd3f8ecbf98386ae162d0b65ed2f1efee8b43dedfe2ccfed1b117211770f694c',
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

