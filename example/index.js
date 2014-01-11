$(document).ready(function () {
    'use strict';
    var btsync = new BTSync({
            host: '127.0.0.1',
            port: 8888,
            username: 'api1we',
            password: 'secret'
        }),
        $els = {
            'getStarted': $('div.b-getStarted'),
            'bitTorrent': $('div.b-bitTorrent'),
            'templateDirectory': $('#template-directory').text(),
            'templateFolder': $('#template-folder').text(),
            'templateFile': $('#template-file').text()
        },
        rootSecret = '',
        currentPath = [];

    // Show message if not authorized
    btsync.on('authRequired', function () {
        $('div.b-message', $els['getStarted']).text('Not authorized');
        return this;
    });

    // Click at button "get access"
    $('button', $els['getStarted']).click(function () {
        btsync.getFolders().done(function (response) {
            // Rotate div
            $els['getStarted'].toggle();
            $els['bitTorrent'].toggle();

            // Create view for all root directory
            _.each(response, function (dir) {
                // Win path fix
                dir.dir = dir.dir.replace('\\\\?\\', '');
                dir.size = btsync.bytesToSize(dir.size || 0);

                // Create view
                $(_.template($els['templateDirectory'], dir))
                    .appendTo($els['bitTorrent'])
                    .click(function () {
                        rootSecret = dir.secret;
                        btsync['getFiles']({'secret': rootSecret}).done(showDirectory);
                    });
            });
        });
    });

    // If need show files
    function showDirectory(elements) {
        $els['bitTorrent'].empty();
        _.each(elements, function (element, counter) {
            if (counter > 25) {
                return false;
            }
            if (element.type == 'file') {
                element.size = btsync.bytesToSize(element.size || 0);
            }
            $(_.template($els['template' + (element.type == 'file' ? 'File' : 'Folder')], element)).appendTo($els['bitTorrent']).click(function () {
                currentPath.push(element.name);
                btsync.getFiles({'secret': rootSecret, 'path': currentPath.join('/')}).done(showDirectory);
            });
        });
    }
});