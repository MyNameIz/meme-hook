const request = require('request-promise');
const { EventEmitter } = require('events');

const updateCookies = require('../cookies/cookies');
const downloadMeme = require('../downloader/downloader');
const { Handler } = require('../handler/handler');

class Cheker extends EventEmitter{
    constructor(data)
    {
        super();
        this.sources = data.src;
        this.id = data.id;
        this.queue_url = `https://queuev4.vk.com/im${this.id.match(/[0-9]{3}$/)}`;
        this.cookie = data.cookie;
        this.handler = new Handler;
        this.on('created', function()
            {
                console.log('Cheker created')
                // for(let src of this.sources)
                // {
                //     console.log(src)
                //     this.getLongPollServer(src);
                // }
                this.getLongPollServer('https://vk.com');
            }
        );
        this.on('pollFail', function(referer)
            {
                this.getLongPollServer(referer);
            }
        );
        this.on('pollStart', async function(ref, LP)
            {
                sendReq2qframe(this, ref, LP)
                    .catch(err => 
                        {
                            console.error(err);
                            this.emit('pollFail', ref, LP);
                            return ;
                        }
                    )
                    .then(res => 
                        {
                            this.emit('pollContinue', ref, LP);
                            return ;
                        }
                    );
            }
        );
        this.on('pollContinue', function(ref, LP)
            {
                this.watchForNewMemes(ref, LP);
            }
        );
        this.on('pollSuccess', function(ref, post)
            {
                if(typeof(post)=="string"&&post.indexOf('Новая запись')!=-1)
                {
                    console.log('MEME DETECTED!');
                    this.MemeDetected(ref, post);
                }
            }
        );
        this.emit('created')
    }

    async getLongPollServer(referer)
    {
        var self = this;
        await request(referer,{
                method : 'GET',
                headers : {
                    cookie : self.cookie
                }
            }, 
            function(err, response)
            {
                if(err)
                {
                    if(!!err.response['set-cookie'])
                        self.cookie = updateCookies(this.cookie, err.response['set-cookie'])
                    return;
                }
                else
                {
                    if(!!response.caseless.get('set-cookie'))
                        self.cookie = updateCookies(self.cookie, response.caseless.get('set-cookie'));
                    return;
                }
            }
        );
        
        let pr = request('https://vk.com/notifier.php?act=a_get_key', {
            method  : 'POST',
            headers : {
                referer : referer,
                origin: 'https://vk.com',
                'x-requested-with': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)',
                cookie  : self.cookie
            },
            formData : {
                al : '1',
                id : this.id
            }
        })
        .then(response => {
            let parsed_response = parseLPServerData(response);
            console.log(response)
            if(parsed_response.ts)
            {
                self.emit('pollStart', referer, parsed_response)
            }
            else
                self.emit('pollFail', referer);
        })
        .catch(err => 
        {
            console.log(err)
            self.emit('pollFail', referer);
        });
    }

    watchForNewMemes(ref ,LP/* not Linkin Park */)
    {
        var self = this;
        var LP = LP;

        request(self.queue_url,
            {
                method  : 'POST',

                headers : {
                    cookie : self.cookie,
                    'origin'  : 'https://queuev4.vk.com',
                    'referer' : 'https://queuev4.vk.com/q_frame.php?7',
                    'user-agent' : 'Mozilla/5.0 (X11; Linux x86_64)'
                },

                form : {
                    act : 'a_check',
                    id : self.id.toString(),
                    key : LP.key.toString(),
                    ts  : LP.ts.toString(),
                    wait : '10'
                }
            },

            function(err, response)
            {
                if(err)
                {
                    console.log(err);
                    self.emit('pollFail', ref);
                }
                let lpAnswer = JSON.parse(response.body);
                if(lpAnswer.failed)
                {
                    self.emit('pollFail', ref);
                    return;
                }
                if(!!lpAnswer.ts)
                {
                    console.log(response.body);
                    let events = lpAnswer.events;
                    LP.ts = lpAnswer.ts;
                    if(events.length > 0) self.emit('pollSuccess', ref, events[0]);
                    self.emit('pollStart', ref, LP);
                    return ;
                }
            }
        );
    }

    async MemeDetected(ref, post)
    {
        downloadMeme(post, this.cookie)
            .catch(err =>
                {
                    console.error(err);
                })
            .then(res =>
                {   
                    console.log(res);
                    if(res)
                    {
                        res.public = ref;
                        this.handler.handle(res, this.cookie);
                    }
                })
    }
}

module.exports.Cheker = Cheker;


function parseLPServerData(response)
{
    let ts = response.split('<!int>')[1];
    let key = response.match(/<!>([a-z0-9A-Z_\s]*)<!><!int>/)[1];
    if(ts&&key)
        return {
            ts : ts,
            key : key
        }
    else
        return null;
}

function sendReq2qframe(self, ref, LP)
{
    return new Promise((resolve, reject) =>
        {
            request('https://queuev4.vk.com/q_frame.php?7',
            {
                method : 'GET',

                headers : {
                    cookie : self.cookie,
                    referer : ref,
                    'user-agent' : 'Mozilla/5.0 (X11; Linux x86_64)'
                }
            },
            function(err, response)
            {
                if(err)
                {
                    console.error(err);
                    self.emit('pollFail', ref);
                    return ;
                }
                self.emit('pollContinue', ref, LP);
                return;
            });
        }
    );
}
