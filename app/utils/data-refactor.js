/*///////////////////////////////////////////////////
    Table Data Generation Helper Function MAIN
 ////////////////////////////////////////////////////*/
const dataRefactor = (app_details) => {
  console.log("APPDETAILS:-------------->",app_details);
  const APP_LIST_LENGTH = app_details.length;
  const insertAppDetails = (app) => {
    // console.log("app", app);
    if (app !== parseInt(app, 10)) {
      const newInstanceObj = {
        dna_id: app.dna_id,
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

///////////////////////
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
              dna_id:fileInstance.dna,
              hash: hash
            },
            status:"installed"
          };
         }
         else {
           status = {
             instance: instance_info.id,
             dna: {
               dna_id:fileInstance.dna,
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
        dna_id: fileInstance.dna,
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

export const refactorListOfDnas = (downloaded_apps, list_of_dna) => {
  // if (downloaded_apps !== parseInt(downloaded_apps, 10)) {
    let status = {};
    const uninstalled_apps = monitorUninstalledApps(downloaded_apps, list_of_dna);
    console.log("uninstalled_apps >> check to see list of uninstalled : ", uninstalled_apps);
    console.log("list_of_dna >> check to see list of uninstalled : ", list_of_dna);

    const list_of_installed = list_of_dna.map((app) => {
        return {
          dna_id: app.id,
          agent_id: "N/A",
          type: "DNA", // fileIntance.storage.type >>> wil this eventually say wether it is a DNA or UI?? or only state "file" ??
          hash: "N/A",
          instanceId: "N/A",
          status: {
            instance: "N/A",
            dna: {
              dna_id: app.id,
              hash: "N/A"
            },
            status:"installed"
          },
          running: false
        };
    })
    const list_of_uninstalled = uninstalled_apps.map((app) => {
        return {
          dna_id: app.dna_id,
          agent_id: "N/A",
          type: "DNA", // fileIntance.storage.type >>> wil this eventually say wether it is a DNA or UI?? or only state "file" ??
          hash: "N/A",
          instanceId: "N/A",
          status: {
            instance: "N/A",
            dna: {
              dna_id: app.id,
              hash: "N/A"
            },
            status:"uninstalled"
          },
          running: false
        };
    })
  return dataRefactor(list_of_installed.concat(list_of_uninstalled));
}

const monitorUninstalledApps = (downloaded_apps, list_of_dna) => {
  let uninstalled_apps = [];
  uninstalled_apps = downloaded_apps.filter(down_app=>{
    return !list_of_dna.find(app=>{
        return down_app.dna_id === app.id
    });
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
export const refactorInstanceData = (list_of_instance_info, list_of_installed_instances, list_of_running_instances) => {
  // const INSTANCE_INFO_LENGTH = list_of_installed_instances.length;
  // console.log("list_of_instance_info::",list_of_instance_info);
  // console.log("LOGGGGGG::",list_of_installed_instances);
  // console.log("LOGGGGGG Running::",list_of_running_instances);
  const info_instance_log = list_of_instance_info.map((fileInstance) => {
    if (fileInstance !== parseInt(fileInstance, 10)) {
      let hash = "";
      let status = {};
      let running = {};

      let check_installed = list_of_installed_instances.find((i_instances)=>{
        return i_instances.id ===fileInstance.id
      })
        if (check_installed===undefined){
          status = {
            instance: fileInstance.id,
            dna: {
              dna_id:fileInstance.dna,
              hash: hash
            },
            agent_id:fileInstance.agent,
            status:"uninstalled"
          };
      }else{
        status = {
          instance: fileInstance.id,
          dna: {
            dna_id:fileInstance.dna,
            hash: hash
          },
          agent_id:fileInstance.agent,
          status:"installed"
        };
      }

      let check_running = list_of_running_instances.find((ri)=>{
        return ri.id ===fileInstance.id
      })
        if (check_running===undefined){
            running = {
              instance: fileInstance.id,
              dna: hash,
              running : false
            };
      }else{
        running = {
           instance: fileInstance.id,
           dna: hash,
           running : true
         };
      }

      const newInstanceObj = {
        dna_id: fileInstance.dna,
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
