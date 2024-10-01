import { autoRun, manage, $ } from 'manate';
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
    if (this.role === 'real') {
      this.callSessions.push({ id: uuid(), status: 'init' });
    } else {
      worker.port.postMessage({ type: 'action', name: 'newCallSession' });
    }
  }

  public removeCallSession(id: string) {
    if (this.role === 'real') {
      const index = this.callSessions.findIndex((cs) => cs.id === id);
      if (index !== -1) {
        $(this.callSessions).begin();
        this.callSessions.splice(index, 1);
        $(this.callSessions).commit();
      }
    } else {
      worker.port.postMessage({ type: 'action', name: 'removeCallSession', args: { id } });
    }
  }

  public updateCallSessionStatus(id: string, status: CallSession['status']) {
    if (this.role === 'real') {
      const callSession = this.callSessions.find((cs) => cs.id === id);
      if (callSession) {
        callSession.status = status;
      }
    } else {
      worker.port.postMessage({ type: 'action', name: 'updateCallSessionStatus', args: { id, status } });
    }
  }
}

const store = manage(new Store());

const worker = new SharedWorker(new URL('./shared-worker.ts', import.meta.url), { type: 'module' });
worker.port.start();
window.onbeforeunload = () => worker.port.postMessage({ type: 'close' });

worker.port.onmessage = (e) => {
  console.log('worker message', JSON.stringify(e.data));
  if (e.data.type === 'role') {
    store.role = e.data.role;
  }
  if (store.role === 'real') {
    if (e.data.type === 'action') {
      store[e.data.name](...Object.values(e.data.args ?? {}));
    }
  } else {
    // dummy
    if (e.data.type === 'sync') {
      store.callSessions = JSON.parse(e.data.jsonStr);
    }
  }
};

const { start } = autoRun(store, () => {
  if (store.role !== 'real') {
    return;
  }
  worker.port.postMessage({ type: 'sync', jsonStr: JSON.stringify(store.callSessions) });
});
start();

export default store;
