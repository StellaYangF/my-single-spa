import { 
  NOT_LOADED, 
  LOAD_SOURCE_CODE, 
  SKIP_BECAUSE_BROKEN
} from "../application/apps.helper";
import { 
  smellLikePromise, 
  flattenLifecycleArray
} from './helper';

export function toLoadPromise(app) {
  if (app.status !== NOT_LOADED) {
    return Promise.resolve(app);
  }
  app.status = LOAD_SOURCE_CODE;
  
  let loadPromise = app.loadFunction();
  if (!smellLikePromise(loadPromise)) {
    return Promise.reject(new Error(''));
  }
  let errors = [];
  loadPromise.then(appConfig => {
    if (typeof appConfig !== 'object') throw new Error('');
    ['bootstrap', 'mount', 'unmount'].forEach(lifecycle => {
      if (!appConfig[lifecycle]) {
        errors.push(`lifecycle: ${lifecycle} must exist`)
      }
    })
    if (errors.length) {
      app.status = SKIP_BECAUSE_BROKEN;
      console.log(errors);
      return;
    }
    
    app.boostrap = flattenLifecycleArray(appConfig.boostrap, `app: ${app.name} bootstrapping`);
    app.mount = flattenLifecycleArray(appConfig.mount, `app: ${app.name} mounting`);
    app.unmount = flattenLifecycleArray(appConfig.unmount, `app: ${app.name} unmounting`);
  })
}