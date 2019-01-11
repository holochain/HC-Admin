export default handleCloseWindow = () => {
  console.log("TRYING TO CLOSE APP...")
  const { ipcRenderer } = electron;
  const quit = 'quit'
  ipcRenderer.send("window:close", quit);
};
