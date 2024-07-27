import {lib,game,ui,get,ai,_status} from '../../noname.js';
import {content} from './source/content.js';
import {precontent} from './source/precontent.js';
import {config} from './source/config.js';
import {ext_package} from './source/package.js';
import {help} from './source/help.js';
import {basic} from './source/basic.js';

export let type = 'extension';

export default async function(){
    const extensionInfo = await lib.init.promises.json(`${basic.extensionDirectoryPath}info.json`);
    let extension = {
        name:extensionInfo.name,
        editable:false,
        content:content,
        precontent:precontent,
        config:await basic.resolve(config),
        help:await basic.resolve(help),
        package:ext_package,
        files:{"character":[],"card":[],"skill":[],"audio":[]}
    };
    Object.keys(extensionInfo)
    .filter(key=>key!='name')
    .forEach(key=>extension.package[key]=extensionInfo[key]);
    
    return extension;    
}
