import { autoRun, manage, $ } from 'manate';
import hyperid from 'hyperid';

const uuid = hyperid();

class CallSession {
  public id: string;
  public status: 'init' | 'ringing' | 'answered' | 'disposed' = 'init';
}

function actionWrapper(value: Function, context: ClassMethodDecoratorContext) {
  return async function (...args: any[]) {
    // dummy
    // forwards action to shared worker
    if (store.role === 'dummy') {
      worker.port.postMessage({ type: 'action', name: context.name, args });
      return;
    }

    // real
    // real will not sync state to dummy when transaction is in progress
    // this prevent sending temporary state to dummy
    $(store).begin(); // begin transaction
    const result = await value.apply(this, args);
    $(store).commit(); // commit transaction
    return result;
  };
}

export class Store {
  public role = 'unknown';
  public callSessions: CallSession[] = [];

  @actionWrapper
  public newCallSession() {
    this.callSessions.push({ id: uuid(), status: 'init' });
  }

  @actionWrapper
  public removeCallSession(id: string) {
    const index = this.callSessions.findIndex((cs) => cs.id === id);
    if (index !== -1) {
      this.callSessions.splice(index, 1);
    }
  }

  @actionWrapper
  public updateCallSessionStatus(id: string, status: CallSession['status']) {
    const callSession = this.callSessions.find((cs) => cs.id === id);
    if (callSession) {
      callSession.status = status;
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
      store[e.data.name](...e.data.args);
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
