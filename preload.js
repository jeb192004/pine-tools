/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  
  info: () => ipcRenderer.invoke('info'),
  keyboard_config: (val) => ipcRenderer.send('keyboard', val),
  //save_folder: () => ipcRenderer.invoke('save-folder'),
  get_json: () => ipcRenderer.invoke('get_json'),
  add: (data)=> ipcRenderer.send('asynchronous-message', data),
  toggle_kb: () => ipcRenderer.invoke('toggle_kb'),
  set_password: (val) => ipcRenderer.send('alert', val),
  delete_item: (val) => ipcRenderer.invoke('delete', val),
  closeW: (val) => ipcRenderer.invoke('close', val),
  minW: (val) => ipcRenderer.invoke('min', val),
  maxW: (val) => ipcRenderer.invoke('max', val),
  toast: (data)=> ipcRenderer.send('toast', data),
  
  // we can also expose variables, not just functions
})


