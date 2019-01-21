/*///////////////////////////////////////////////////
    Table Data Generation Helper Function MAIN
 ////////////////////////////////////////////////////*/
const dataRefactor = (app_details) => {
  console.log("APDETAILS:-------------->",app_details);
  const APP_LIST_LENGTH = app_details.length;
  const insertAppDetails = (app) => {
    // console.log("app", app);
    if (app !== parseInt(app, 10)) {
      const newInstanceObj = {
        appName: app.appName,
        agent_id: app.agent_id,
        type: app.type,
        hash: app.hash,
        instanceId: app.instanceId,
        status: app.status,
        running: app.running
      };
      console.log("newInstanceObj", newInstanceObj);
      return newInstanceObj;
    }
    else {
      return "";
    }
  }

  const range = (length) => {
    const lengthArray: Array < any > = [];
    for (let i = 0; i < length; i++) {
      lengthArray.push(i);
    }
    return lengthArray;
  }

  const dataGenerate = (length = APP_LIST_LENGTH) => {
    return app_details.map(app => {
      return {
        ...insertAppDetails(app),
        children: range(length - 1).map(insertAppDetails) // # per page...
      };
    })
  }
  return dataGenerate()
}
export const listInstalledInstances = (list_of_instance_info, list_of_running_instances) => {
  // const INSTANCE_INFO_LENGTH = list_of_instance_info.length;
  const info_instance_log = list_of_instance_info.map((fileInstance) => {
    if (fileInstance !== parseInt(fileInstance, 10)) {
      let hash = "";
      let status = {};
      let running = {};


      // for (let file of list_of_dna) {
      //   if (fileInstance.dna === file.id) {
      //     hash = file.hash;
      //   }
      //   else {
      //     hash = "unknown";
      //   }
      // }

      for (let instance_info of list_of_instance_info) {
        if (fileInstance.id === instance_info.id) {
          status = {
            instance: instance_info.id,
            dna: {
              appName:fileInstance.dna,
              hash: hash
            },
            status:"installed"
          };
         }
         else {
           status = {
             instance: instance_info.id,
             dna: {
               appName:fileInstance.dna,
               hash: hash
             },
             status:"unknown"
           };
         }
      }

      for (let running_instance of list_of_running_instances) {
        if (fileInstance.id === running_instance.id) {
          running = {
            instance: fileInstance.id,
            dna: hash,
            running : true
          };
        }
        else {
          running = {
            instance: fileInstance.id,
            dna: hash,
            running : false
          };
        }
      }

      const newInstanceObj = {
        appName: fileInstance.dna,
        agent_id: fileInstance.agent,
        type: "DNA", // fileInstance.storage.type >>> will this eventually say whether it is a DNA or UI?? or only state "file" ??
        hash,
        instanceId: fileInstance.id,
        status,
        running
      };

      console.log("newInstanceObj", newInstanceObj);
      return newInstanceObj;
    }});

  return dataRefactor(info_instance_log);
}


export const listInstalledApps = (list_of_instance_info, list_of_running_instances, list_of_dna) => {
  // const INSTANCE_INFO_LENGTH = list_of_instance_info.length;
  const info_instance_log = list_of_instance_info.map((fileInstance) => {
    if (fileInstance !== parseInt(fileInstance, 10)) {
      let hash = "";
      let status = {};
      let running = {};


      for (let file of list_of_dna) {
        if (fileInstance.dna === file.id) {
          hash = file.hash;
        }
        else {
          hash = "unknown";
        }
      }

      for (let instance_info of list_of_instance_info) {
        if (fileInstance.id === instance_info.id) {
          status = {
            instance: instance_info.id,
            dna: {
              appName:fileInstance.dna,
              hash: hash
            },
            status:"installed"
          };
         }
         else {
           status = {
             instance: instance_info.id,
             dna: {
               appName:fileInstance.dna,
               hash: hash
             },
             status:"unknown"
           };
         }
      }

      for (let running_instance of list_of_running_instances) {
        if (fileInstance.id === running_instance.id) {
          running = {
            instance: fileInstance.id,
            dna: hash,
            running : true
          };
        }
        else {
          running = {
            instance: fileInstance.id,
            dna: hash,
            running : false
          };
        }
      }

      const newInstanceObj = {
        appName: fileInstance.dna,
        agent_id: fileInstance.agent,
        type: "DNA", // fileInstance.storage.type >>> will this eventually say whether it is a DNA or UI?? or only state "file" ??
        hash,
        instanceId: fileInstance.id,
        status,
        running
      };

      console.log("newInstanceObj", newInstanceObj);
      return newInstanceObj;
    }});

  return dataRefactor(info_instance_log);
}

export const listDownloadedApps = (downloaded_apps, list_of_instance_info) => {
  if (downloaded_apps !== parseInt(downloaded_apps, 10)) {
    let status = {};
    const uninstalled_apps = monitorUninstalledApps(downloaded_apps, list_of_instance_info);
    console.log("uninstalled_apps >> check to see list of uninstalled : ", uninstalled_apps);

    const downloaded_list_log = downloaded_apps.map(() => {
      for (let u_app in uninstalled_apps) {
        status = {
          instance: "N/A",
          dna: {
            appName: downloaded_apps.app_name,
            hash: "N/A"
          },
          status:"uninstalled"
        };

        const newDownloadObj = {
          appName: downloaded_apps.app_name,
          agent_id: "N/A",
          type: "DNA", // fileIntance.storage.type >>> wil this eventually say wether it is a DNA or UI?? or only state "file" ??
          hash: "N/A",
          instanceId: "N/A",
          status,
          running: false
        };

        console.log("newDownloadObj", newDownloadObj);
        return newDownloadObj;
      }
    })};
  return dataRefactor(listDownloadedApps);
}

const monitorUninstalledApps = (downloaded_apps, list_of_instance_info) => {
  console.log("MONITORUNINSTALLEDAPPS >> downloaded_apps : ", downloaded_apps);
  let uninstalled_apps = [];
  uninstalled_apps = list_of_instance_info.filter((info_instance) => {
    for (let d_app of downloaded_apps) {
      return d_app.path !== info_instance.storage.path
    }
  });
  // for (let info_instance of list_of_instance_info) {
  //   // console.log("downloaded_apps.path", downloaded_apps.path);
  //   // console.log("info_instance.storage.path", info_instance.storage.path);
  //   const uninstalled_app = downloaded_apps.path !== info_instance.storage.path;
  //   uninstalled_app === true ? uninstalled_apps.push(downloaded_apps) : null;
  // };
  console.log("MONITORUNINSTALLEDAPPS >> uninstalled_apps : ", uninstalled_apps);
  return uninstalled_apps;
}

// export const manageAllDownloadedApps=(allApps)=>{
//   let listOfApps = allApps.split("\n");
//   listOfApps = listOfApps.filter((app)=>{
//     return app !== "";
//   });
//   const app_details = listOfApps.map((app)=>{
//     return { "app_name": app,
//      "path": `~/.hcadmin/holochain-download/${app}` }
//   });
//   return app_details;
// }
