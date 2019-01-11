// ==========================================================================================
// NB: These services are the calls between the windows / window and electron via IPC
// ==========================================================================================
import { ipcRenderer } from 'electron'
import { IHelloWorldService } from './types'

// HelloWorld IPC call :
export default function() : IHelloWorldService {
  async function sayHelloToMainProcess() : Promise<any> {
    return new Promise(function(resolve, reject) {
      ipcRenderer.send('hello', 'Hello from renderer process.')

      function onResponse (event: any, response: any) {
        ipcRenderer.removeListener('hello', onResponse)
        return resolve(response)
      }
      return ipcRenderer.on('hello', onResponse)
    })
  }
  return {
    sayHelloToMainProcess
  }
}
