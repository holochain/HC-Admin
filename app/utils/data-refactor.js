/*///////////////////////////////////////////////////
    Table Data Generation Helper Function MAIN
 ////////////////////////////////////////////////////*/
export const dataRefactor = (list_of_instance_info, list_of_dna, list_of_running_instances, downloaded_apps) => {
  const INSTANCE_INFO_LENGTH = list_of_instance_info.length;
  // console.log("INSTANCE_INFO_LENGTH : ", INSTANCE_INFO_LENGTH);

  const insertInstanceLog = (fileInstance) => {
    if (fileInstance !== parseInt(fileInstance, 10)) {
      let hash = "";
      let status = {};
      let running = {};


      for (let file of list_of_dna) {
        console.log("LIST OF DNA:", list_of_dna);
        console.log("INSTANCE DNA: ", fileInstance.dna);
        if (fileInstance.dna === file.id) {
          hash = file.hash;
          console.log("FILE HASH: ", hash);
        };
      }

      const uninstalled_apps = monitorUninstalledApps(fileInstance, downloaded_apps);
      for (let instance_info of list_of_instance_info) {
        for (let uApp of uninstalled_apps) {
          if (instance_info.dna === uApp.dna) {
            status = {
              instance: instance_info.id,
              dna: {
                appName:fileInstance.dna,
                hash: hash
              },
              status:"uninstalled"
             };
           }
         }

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
          type: "DNA", // fileIntance.storage.type >>> wil this eventually say wether it is a DNA or UI?? or only state "file" ??
          hash,
          instanceId: fileInstance.id,
          status,
          running
        };

        console.log("newInstanceObj", newInstanceObj);
        return newInstanceObj;
      }
      else {
        return "";
      }
    }

    const range = (length) => {
      const lengthArray: Array<any> = [];
      for (let i = 0; i < length; i++) {
        lengthArray.push(i);
      }
      return lengthArray;
    };

    const dataGenerate = (length = INSTANCE_INFO_LENGTH) => {
      return list_of_instance_info.map(infoInstance => {
        return {
          ...insertInstanceLog(infoInstance),
          children: range(length - 1).map(insertInstanceLog) // # per page...
        };
      })
    }
    return dataGenerate()
}

const monitorUninstalledApps = (installed_apps, downloaded_apps) => {
// console.log("MONITORUNINSTALLEDAPPS >> installed_apps : ", installed_apps);
const uninstalled_apps = [];
const filter_installed_apps =  downloaded_apps.filter((d_apps) => {
  const uninstalled_app = d_apps.dna !== installed_apps.dna;
  uninstalled_app === true ? uninstalled_apps.push(d_apps) : null;
});
// console.log("MONITORUNINSTALLEDAPPS >> uninstalled_apps : ", uninstalled_apps)
return [...new Set([...uninstalled_apps])]
}

export const manageAllDownloadedApps=(allApps)=>{
  let listOfApps = allApps.split("\n");
  listOfApps = listOfApps.filter((app)=>{
    return app !== "";
  });
  const app_details = listOfApps.map((app)=>{
    return {"app_name":app}
  });
  return app_details;
}
