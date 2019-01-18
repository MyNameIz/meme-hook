const fs            = require('fs');
const path          = require('path');

module.exports.Logger = class {
    constructor(logDir, names)
    {
        if (!typeof(logDir)=="string"||!fs.existsSync(logDir)) throw "No path to logs directory.";
        else this.dir = logDir;
        if(!typeof(names)=="object"||!(names instanceof Array)) this.names = [];
        else this.names = names;
    };

    log(text, module)
    {
        let filename = (this.names.indexOf(module)==-1) ? 'main.log' : `${module}.log`;
        let way = path.join(this.dir,filename);
        if(text)log(way, text.toString());
        else log(way, new Error('Nothing to log!'));
    }

    error(err, module, cb)
    {
        let filename = (this.names.indexOf(module)==-1) ? 'main.log' : `${module}.log`;
        let way = path.join(this.dir,filename);
        if(err)
        {
            let text;
            if(err instanceof Error) 
            {
                text = err.stack;
            }
            else
            {
                text = err.toString();
                let ERR = new Error(text);
                text += '\n' + ERR.stack;
            }
            log(way, text);
        }
        else log(way, new Error('Nothing to log!'));
        if(cb) cb();
    }
};

function log(way, text)
{
    if(typeof(way)=="string"&&typeof(text)=="string")
    {
        let delim = `===[ ${Date()} ]=`;
        for(let i = 0; i < 99; i++) delim += '=';
        delim += '\n\n';
        if (fs.existsSync(way)) fs.appendFile(way, `${delim}${text}\n\n`, () => {});
        else fs.writeFile(way, `${delim}${text}\n`, () => {});
    }
}