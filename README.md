jQuery BitTorrent Sync
=====================
A simple wrapper for the [BitTorrent Sync API](http://www.bittorrent.com/intl/en/sync/developers/api), based at [node-bittorrent-sync](https://github.com/yannickcr/node-bittorrent-sync).
[Demonstration page](http://jsfiddle.net/lomatek/An6P2/embedded/result/) (Only works with enabled api).

 1. [BitTorrent Sync API](http://www.bittorrent.com/intl/ru/sync/developers/api)
 2. [Зачем нужен BitTorrent Sync](http://habrahabr.ru/post/201072)
 3. [BitTorrent Sync FAQ *unofficial*](http://forum.bittorrent.com/topic/17782-bittorrent-sync-faq-unofficial/)

## Enabling the API

To enable the API, you must run BitTorrent Sync with the config file. All official BitTorrent Sync clients will support the API. By using the config file, you will have the ability to run Sync silently without installation, allowing improved integration with your app.

On Mac and Linux, run the Sync executable with --config path_to_file argument.
On Windows, use /config path_to_file.
The config file may be located in any directory on your drive.

Sync uses JSON format for the configuration file. Here is a sample config file that you can use to enable API:
```javascript
{
    // path to folder where Sync will store its internal data,
    // folder must exist on disk
    "storage_path" : "/Users/user/.SyncAPI",

    // run Sync in GUI-less mode
    "use_gui" : false,

    "webui" : {
        // IP address and port to access HTTP API
        "listen" : "127.0.0.1:8888",
        // login and password for HTTP basic authentication
        // authentication is optional, but it's recommended to use some
        // secret values unique for each Sync installation
        "login" : "api",
        "password" : "secret",
        // replace xxx with API key received from BitTorrent
        "api_key" : "xxx"
    }
}
```

## API Functions

 * `getFolders` Get folders
 * `addFolder` Add folder
 * `removeFolder` Remove folder
 * `getFiles` Get files
 * `setFilePrefs` Set file preferences
 * `getFolderPeers` Get folder peers
 * `getSecrets` Get secrets
 * `getFolderPrefs` Get folder preferences
 * `setFolderPrefs` Set folder preferences
 * `getFolderHosts` Get folder hosts
 * `setFolderHosts` Set folder hosts
 * `getPrefs` Get preferences
 * `setPrefs` Set preferences
 * `getOs` Get OS name
 * `getVersion` Get version
 * `getSpeed` Get speed
 * `shutdown` Shutdown
 * 
 
## Usage

```javascript
$(document).ready(function () {
    'use strict';
    var btsync = new BTSync({
            host: '127.0.0.1',
            port: 8888,
            username: 'api',
            password: 'secret'
        });
    
    btsync.on('authRequired', function () {
        // Show message if not authorized
    });

    // ----------------------------------------
    //
    // ----------------------------------------
    var promiseFolders = btsync.getFolders();
    
    promiseFolders.done(function (res) { 
        // all good
    }).fail(function (e) {
        // something wrong
    });
    
    
    // ----------------------------------------
    //
    // ----------------------------------------
    btsync.getFiles({secret:'secret'}).done(function (res) { return res; });
    
    // ----------------------------------------
    //
    // ----------------------------------------
    var callback = function (res) {
        return res;
    }
    btsync['getOs']().done(res);
    btsync['setPrefs']({
        'params': {
            'device_name': 'calculator'
        }
    }).done(res);
});
```

## License
jQuery BitTorrent Sync is licensed under the MIT License.
