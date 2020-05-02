import { 
  NOT_LOADED,
  noSkip,
  noLoadError,
  notLoaded,
  shouldBeActivity,
} from './apps.helper';
import { invoke } from '../navigations/invoke';

const APPS = [];

/**
 * 注册 app
 * @param {string} appName 要注册的 app 名称
 * @param {Function<Promise>|Object} loadFunction 异步加载函数
 * @param {Function<boolean>} activityWhen 判断该 app 何时被启动
 * @param {Object} customProps 自定义配置
 * return Promise
 */
export function registerApplication(appName, loadFunction, activityWhen, customProps) {
  if (!appName || typeof appName !== 'string') {
    throw new Error('appName must be a non-empty string');
  }
  if (!loadFunction) {
    throw new Error('loadFunction must be a function or object');
  }
  if (typeof loadFunction !== 'function') {
    loadFunction = () => Promise.resolve(loadFunction);
  }
  if (typeof activityWhen !== 'function') {
    throw new Error('activityWhen must be a function');
  }
  APPS.push({
    name: appName,
    loadFunction,
    activityWhen,
    customProps,
    status: NOT_LOADED,
  });
  
  // console.log(APPS);
  
  invoke();
}

export function getAppsToLoad() {
  return APPS.filter(noSkip).filter(noLoadError).filter(notLoaded).filter(shouldBeActivity);
}