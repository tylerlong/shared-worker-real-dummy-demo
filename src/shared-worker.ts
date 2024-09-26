/// <reference lib="webworker" />

declare let self: SharedWorkerGlobalScope;
const slavePorts = new Set<MessagePort>();
let masterPort: MessagePort | undefined;
self.onconnect = (e) => {
  console.log('port connected');
  const port = e.ports[0];
  if (masterPort) {
    slavePorts.add(port);
    port.postMessage({ type: 'role', role: 'slave' });
  } else {
    masterPort = port;
    port.postMessage({ type: 'role', role: 'master' });
  }
  port.onmessage = (e) => {
    console.log('port message', e.data);
    if (e.data.type === 'close') {
      console.log('port closed');
      if (port === masterPort) {
        masterPort = undefined;
        if (slavePorts.size > 0) {
          masterPort = Array.from(slavePorts)[0];
          slavePorts.delete(masterPort);
          masterPort.postMessage({ type: 'role', role: 'master' });
        }
      } else {
        slavePorts.delete(port);
      }
    } else if (e.data.type === 'action') {
      if (masterPort) {
        console.log('forwarding action to master');
        masterPort.postMessage(e.data);
      }
    } else if (e.data.type === 'sync') {
      console.log('forwarding sync to slaves');
      slavePorts.forEach((slavePort) => slavePort.postMessage(e.data));
    }
  };
};

// We need an export to force this file to act like a module, so TS will let us re-type `self`
export default null;
