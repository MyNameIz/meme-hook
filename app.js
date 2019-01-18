const mongoose      = require('mongoose');

const config        = require('./config/config');
const { Cheker }    = require('./cheker/cheker');

const logger        = new (require('./logger/logger').Logger)(config.logDir, [
    'auth', 'checker', 'downloader', 'handler', 'uploader'
])

process.stderr.wr = process.stderr.write;
process.stderr.write = function(mes, c)
{
    logger.error(mes);
    process.stderr.wr(mes,c);
}

const comp_auth     = require('./auth/comp_auth');
const lookLikeDesktop = require('./auth/desktop_online');

const db = config.db;
// const dburi = `mongodb://${db.user}:${db.psw}@${db.host}:${db.port}/${db.db}`;
const dburi = `mongodb://${db.user}:${db.psw}@ds157064.mlab.com:57064/memehook`;

let promises = [
    mongoose.connect(dburi, {useNewUrlParser : true}),
    comp_auth(config.profile.login, config.profile.password)
];

Promise.all(promises)
.catch(err => 
{
    logger.error(err);
})
.then(res => 
{
    // https://oauth.vk.com/authorize?client_id=6824831&redirect_uri=https://vk.com/&scope=wall&response_type=token&v=5.92&state=fucku
    let cookies = res[1];
    lookLikeDesktop('https://vk.com/', config.profile.id)
    let sources = res.map((value) => {return value.url;})
    console.log('MongoDB Connected!');
    console.log('User Authorized!');
    require('./cleaner/cleaner');
    new Cheker({
        id      : config.profile.id,
        cookie  : cookies
    });
    console.log('MemeHook Started!');
});
