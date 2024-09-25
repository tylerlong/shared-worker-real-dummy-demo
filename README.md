# Shared worker master slaves demo

If there are multiple tabs/windows of this web application, only one of them is a master app, all other tabs/windows are slave apps. 

The master app will sync its state to all salves apps so that all tabs/windows are in sync.

When user performs an action on a slave app, it will send a message to the master app, and master app will update the state. 

The first connected tab will be master app. When the master tab is closed, one of the slave apps will be promoted to be the master app.


## Notes

parcel must have `--no-hmr`, otherwise a dynamic string will be append to shared worker URL. This will cause all tabs have a different shared worker.

We use window.onbeforeunload to detect tab close. I am unaware of a better way since `SharedWorker.port.onclose` doesn't exist.
