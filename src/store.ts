import { autoRun, manage } from 'manate';
import hyperid from 'hyperid';

const uuid = hyperid();

class CallSession {
  public id: string;
  public status: 'init' | 'ringing' | 'answered' | 'disposed' = 'init';
}

export class Store {
  public role = 'unknown';
  public callSessions: CallSession[] = [];

  public newCallSession() {
    if (this.role === 'master') {
      this.callSessions.push({ id: uuid(), status: 'init' });
    } else {
      worker.port.postMessage({ type: 'action', name: 'new-call-session' });
    }
  }
}

const store = manage(new Store());

const worker = new SharedWorker(new URL('./shared-worker.ts', import.meta.url), { type: 'module' });
worker.port.start();
window.onbeforeunload = () => worker.port.postMessage({ type: 'close' });

worker.port.onmessage = (e) => {
  console.log('worker message', e.data);
  if (e.data.type === 'role') {
    store.role = e.data.role;
  }
  if (store.role === 'master') {
    if (e.data.type === 'action') {
      if (e.data.name === 'new-call-session') {
        store.newCallSession();
      }
    }
  } else {
    // slave
    if (e.data.type === 'sync') {
      console.log('salve got sync', e.data.jsonStr);
      store.callSessions = JSON.parse(e.data.jsonStr);
    }
  }
};

const { start } = autoRun(store, () => {
  if (store.role !== 'master') {
    return;
  }
  console.log('post call sessions to worker');
  worker.port.postMessage({ type: 'sync', jsonStr: JSON.stringify(store.callSessions) });
});
start();

export default store;
