# Shared worker real/dummy demo

If there are multiple tabs/windows of this web application, only one of them is a real app, all other tabs/windows are dummy apps. 

The real app will sync its state to all salves apps so that all tabs/windows are in sync.

When user performs an action on a dummy app, it will send a message to the real app, and real app will update the state. 

The first connected tab will be real app. When the real tab is closed, one of the dummy apps will be promoted to be the real app.


## Notes

parcel must have `--no-hmr`, otherwise a dynamic string will be append to shared worker URL. This will cause all tabs have a different shared worker.

We use window.onbeforeunload to detect tab close. I am unaware of a better way since `SharedWorker.port.onclose` doesn't exist.
