import { ipcMain } from 'electron'

ipcMain.on('hello', (event: any, args: any) => {
  console.log(args)
  event.sender.send('hello', `Hello from main process: ${new Date()}.`)
})