import { isStarted } from '../start';
import { getAppsToLoad } from '../application/apps';
import { toLoadPromise } from '../lifecycles/load'; 

let appChangesUnderway = false;
let changesQueue = [];

export function invoke() {
  if (appChangesUnderway) {
    return new Promise((resolve, reject) => {
      changesQueue.push({
        success: resolve,
        failure: reject,
      })
    })
  }
  appChangesUnderway = true;
  if (isStarted()) {

  } else {
    loadApps();
  }

  function loadApps() {
    getAppsToLoad().map(toLoadPromise)
  }
}