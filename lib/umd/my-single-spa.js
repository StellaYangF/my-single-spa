(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.mySingleSpa = {}));
}(this, (function (exports) { 'use strict';

  var SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN';
  var LOAD_ERROR = 'LOAD_ERROR';
  var NOT_LOADED = 'NOT_LOADED';
  var LOAD_SOURCE_CODE = 'LOAD_SOURCE_CODE';
  function noSkip(app) {
    return app.status !== SKIP_BECAUSE_BROKEN;
  }
  function noLoadError(app) {
    return app.status !== LOAD_ERROR;
  }
  function notLoaded(app) {
    return app.status === NOT_LOADED;
  }
  function shouldBeActivity(app) {
    try {
      return app.activityWhen(window.location);
    } catch (error) {
      app.status = SKIP_BECAUSE_BROKEN;
      console.log(error);
    }
  }

  function start() {}

  function toLoadPromise(app) {
    if (app.status !== NOT_LOADED) {
      return Promise.resolve(app);
    }

    app.status = LOAD_SOURCE_CODE;
  }

  var appChangesUnderway = false;
  function invoke() {
    if (appChangesUnderway) {
      return new Promise(function (resolve, reject) {
      });
    }

    appChangesUnderway = true;

    {
      loadApps();
    }

    function loadApps() {
      getAppsToLoad().map(toLoadPromise);
    }
  }

  var APPS = [];
  /**
   * 注册 app
   * @param {string} appName 要注册的 app 名称
   * @param {Function<Promise>|Object} loadFunction 异步加载函数
   * @param {Function<boolean>} activityWhen 判断该 app 何时被启动
   * @param {Object} customProps 自定义配置
   * return Promise
   */

  function registerApplication(appName, _loadFunction, activityWhen, customProps) {
    if (!appName || typeof appName !== 'string') {
      throw new Error('appName must be a non-empty string');
    }

    if (!_loadFunction) {
      throw new Error('loadFunction must be a function or object');
    }

    if (typeof _loadFunction !== 'function') {
      _loadFunction = function loadFunction() {
        return Promise.resolve(_loadFunction);
      };
    }

    if (typeof activityWhen !== 'function') {
      throw new Error('activityWhen must be a function');
    }

    APPS.push({
      name: appName,
      loadFunction: _loadFunction,
      activityWhen: activityWhen,
      customProps: customProps,
      status: NOT_LOADED
    }); // console.log(APPS);

    invoke();
  }
  function getAppsToLoad() {
    return APPS.filter(noSkip).filter(noLoadError).filter(notLoaded).filter(shouldBeActivity);
  }

  exports.registerApplication = registerApplication;
  exports.start = start;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
