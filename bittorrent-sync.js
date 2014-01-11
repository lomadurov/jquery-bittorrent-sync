/**
 * jQuery BitTorrent Sync
 */
(function (window, $) {
    'use strict';

    var methods = [
            'get_folders',
            'add_folder',
            'remove_folder',
            'get_files',
            'set_file_prefs',
            'get_folder_peers',
            'get_secrets',
            'get_folder_prefs',
            'set_folder_prefs',
            'get_folder_hosts',
            'set_folder_hosts',
            'get_prefs',
            'set_prefs',
            'get_os',
            'get_version',
            'get_speed',
            'shutdown'
        ],
        EventEmitter = {
            _events: {},
            on: function (event, callback) {
                this._events = this._events || {};
                this._events[event] = this._events[event] || [];
                this._events[event].push(callback);
            },
            off: function (event, callback) {
                this._events = this._events || {};
                if (event in this._events === false) return;
                this._events[event].splice(this._events[event].indexOf(callback), 1);
            },
            // Возможно лучше переделать на бесконечное кол-во аргументов
            emit: function (event, data, data2, data3) {
                this._events = this._events || {};
                if (event in this._events === false)    return;
                for (var i = 0, c = this._events[event].length; i < c; i++) {
                    this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
                }
            }
        };


    var BTSync = function (options) {
        // Setting options
        $.extend(this.options, options);

        // Create all API methods
        for (var i = 0, j = methods.length; i < j; i++) {
            this[this.toCamel(methods[i])] = $.proxy(this.query, this, methods[i]);
        }

        return this;
    };

    $.extend(BTSync.prototype, EventEmitter, {
        // Default options
        options: {
            host: 'localhost',
            port: 8888,
            username: 'api',
            password: 'secret',
            timeout: 1e4
        },
        query: function (method) {
            var userQS = typeof arguments[1] === 'object' ? arguments[1] : {};
            return this._apiCall($.extend({ method: method }, userQS));
        },
        _apiCall: function (qs) {
            var requestOptions = {
                    url: 'http://' + this.options.host + (this.options.port === 80 ? "" : ':' + this.options.port) + '/api',
                    data: qs,
                    // temporarily
                    dataType: 'jsonp',
                    method: 'GET',
                    headers: {
                        Accept: 'application/json'
                    },
                    crossDomain: true,
                    timeout: this.options.timeout,
                    // don't work because JSONP
                    username: this.options.username,
                    password: this.options.password
                },
                promise = $.ajax(requestOptions).done($.proxy(this._apiCallback, this)).fail($.proxy(this._apiCallbackFail, this));
            this.emit('request', requestOptions);
            return promise;
        },
        _apiCallbackFail: function (jqXHR) {
            // Fix: 404 - blind stopper
            if (jqXHR.status === 401 || jqXHR.status === 404) {
                this.emit('authRequired');
            }
        },
        _apiCallback: function (data, textStatus, jqXHR) {
            this.emit('complete', {
                code: jqXHR.statusCode,
                data: data
            });
        },
        toCamel: function (str) {
            return str.replace(/(_[a-z])/g, function (substr) {
                return substr.toUpperCase().replace('_', '');
            });
        },
        bytesToSize: function (bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
                i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            if (bytes == 0) {
                return '0 Bytes';
            }
            return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
        }
    });

    window.BTSync = BTSync;

})(window, jQuery);