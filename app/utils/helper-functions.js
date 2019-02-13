//////////////////////////////////////////
    // ELECTRON IPC Calls
/////////////////////////////////////////
import * as electron from "electron";

export const getHomePath = () => {
  return electron.remote.app.getPath("home");
}

export const handleCloseApp = () => {
  console.log("TRYING TO CLOSE APP...")
  const { ipcRenderer } = electron;
  const quit = 'quit'
  ipcRenderer.send("window:close", quit);
};

export const handleRefreshApp = () => {
  console.log("TRYING TO REFRESH APP...")
  const { ipcRenderer } = electron;
  const refresh = 'refresh'
  ipcRenderer.send("window:refresh", refresh);
};

export const handleLoadLinkInBrowser = (link) => {
  console.log("TRYING TO send user to following link IN THEIR default BROWSER: ", link)
  const { ipcRenderer } = electron;
  ipcRenderer.send("browswer:open", link)
}

//////////////////////////////////////////
    // CMD Downloaded Apps Mangement
/////////////////////////////////////////
const manageAllDownloadedApps = (allApps) => {
  console.log("helper function manageAllDownloadedApps...");

  let listOfApps = allApps.split("\n");
  listOfApps = listOfApps.filter((app)=>{
    return app !== "";
  });
  const app_details = listOfApps.map((app)=>{
    // ATTN > changed from  app_name to dna_id
    console.log("APP param >> downloaded_app", app);
    return { "dna_id": app,
     "path": `~/.hcadmin/holochain-download/${app}` }
  });
  return app_details;
}
export default manageAllDownloadedApps;

export const manageAllDownloadedUI = (allBundles) => {
  console.log("helper function manageAllDownloadedApps...");

  let listOfApps = allBundles.split("\n");
  listOfApps = listOfApps.filter((app)=>{
    return app !== "";
  });
  const app_details = listOfApps.map((app)=>{
    // ATTN > changed app_name tp dna_id
    return { "ui_bundle_id": app,
     "root_dir": `~/.hcadmin/download-ui/${app}` }
  });
  return app_details;
}
//////////////////////////////////////////
    // Custom Serach Bar Functions
/////////////////////////////////////////
