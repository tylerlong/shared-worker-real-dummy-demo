# Shared worker master slaves demo

If there are multiple tabs/windows of this web application, only one of them is a master app, all other tabs/windows are slave apps. 

The master app will sync its state to all salves apps so that all tabs/windows are in sync.

When user performs an action on a slave app, it will send a message to the master app to update the state. 
The master app will then send the updated state to all slave apps.
