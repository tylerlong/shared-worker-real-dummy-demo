/// <reference lib="webworker" />

declare let self: SharedWorkerGlobalScope;
const slavePorts = new Set<MessagePort>();
let masterPort: MessagePort;
self.onconnect = (e) => {
  console.log('port connected');
  const port = e.ports[0];
  if (masterPort) {
    slavePorts.add(port);
  } else {
    masterPort = port;
  }
  port.onmessage = (e) => {
    console.log('port message', e.data);
    if (e.data.type === 'close') {
      console.log('port closed');
    }
  };
};

// We need an export to force this file to act like a module, so TS will let us re-type `self`
export default null;
