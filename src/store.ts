import { manage } from 'manate';

export class Store {
  public role = 'unknown';
}

const store = manage(new Store());

const worker = new SharedWorker(new URL('./shared-worker.ts', import.meta.url), { type: 'module' });
worker.port.start();
window.onbeforeunload = () => worker.port.postMessage({ type: 'close' });

worker.port.onmessage = (e) => {
  if (e.data.type === 'role') {
    store.role = e.data.role;
  }
};

export default store;
