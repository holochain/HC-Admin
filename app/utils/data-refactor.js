/*///////////////////////////////////////////////////
    Table Data Generation Helper Function MAIN
 ////////////////////////////////////////////////////*/
const dataRefactor = (app_details, app_type) => {
  console.log("APPDETAILS:-------------->",app_details);
  const APP_LIST_LENGTH = app_details.length;

  const insertAppDetails = (app) => {
    // console.log("app", app);
    if (app !== parseInt(app, 10) && app_type === "DNA") {
      const newDnaObj = {
        dna_id: app.dna_id,
        dna_instance:  app.dna_instance,
        type: app.type,
        hash: app.hash,
        status: app.status
      };
      console.log("newDnaObj", newDnaObj);
      return newDnaObj;
    }
    else if (app !== parseInt(app, 10) && app_type === "Instance") {
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

////////////////////////////////////////////////////////
          /* Data for DNA Table Overview */
////////////////////////////////////////////////////////
export const refactorListOfDnas = (downloaded_apps, list_of_dna, info_instances) => {
    let status = {};
    const uninstalled_apps = monitorUninstalledApps(downloaded_apps, list_of_dna);

    console.log("uninstalled_apps >> check to see list of uninstalled : ", uninstalled_apps);
    console.log("list_of_dna >> check to see list of uninstalled : ", list_of_dna);

    const list_of_installed = list_of_dna.map((app) => {
      let instance_list = findDnaInstances(app.id, info_instances);
      let instances_exist = instance_list.length > 0 ? "Yes" : "None Yet Exist";

      console.log(" ! instance_list ! ", instance_list);
      console.log(" ! instances_exist ! ", instances_exist);

      return {
        dna_id: app.id,
        dna_instance: instances_exist,
        type: "DNA",
        hash: app.hash,
        status: {
          col_dna_id: app.id,
          instance_list,
          status:"installed"
        }
      };
  })

  const list_of_uninstalled = uninstalled_apps.map((app) => {
      return {
        dna_id: app.dna_id,
        dna_instance: "N/A",
        type: "DNA", // fileIntance.storage.type >>> will this eventually say whether it is a DNA or UI?? or only state "file" ??
        hash: "N/A",
        status: {
          col_dna_id: app.dna_id,
          instance_list: "N/A",
          status:"uninstalled"
        }
      };
  })
  return dataRefactor(list_of_installed.concat(list_of_uninstalled), "DNA");
}

// Locate Uninstalled DNA's : Helper Function
  const monitorUninstalledApps = (downloaded_apps, list_of_dna) => {
    let uninstalled_apps = [];
    uninstalled_apps = downloaded_apps.filter(down_app=>{
      return !list_of_dna.find(app=>{
          return down_app.dna_id === app.id
      });
    });
    console.log("MONITORUNINSTALLEDAPPS >> uninstalled_apps : ", uninstalled_apps);
    return uninstalled_apps;
  }

// Locate DNA Instances : Helper Function
const findDnaInstances = (dna_id, info_instances) => {
  let dna_instances = [];
  dna_instances = info_instances.filter(app => {
      return app.dna === dna_id
  });
  return dna_instances;
}

export const refactorDnaInstanceData = (current_dna_instances, list_of_installed_instances, list_of_running_instances) => {
  console.log("><><><><>< current_dna_instances ><><><><><><", current_dna_instances);

  const info_instance_log = current_dna_instances.map((fileInstance) => {
    if (fileInstance !== parseInt(fileInstance, 10)) {
      let hash = "";
      let status = {};
      let running = {};

      let check_installed = list_of_installed_instances.find((i_instances)=>{
        return i_instances.id ===fileInstance.id
      })
        if (check_installed === undefined){
          status = {
            instance: fileInstance.id,
            dna: {
              dna_id:fileInstance.dna
            },
            agent_id:fileInstance.agent,
            status:"uninstalled"
          };
        }
        else {
          status = {
            instance: fileInstance.id,
            dna: {
              dna_id:fileInstance.dna
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
                running : false
              };
        }
        else {
          running = {
             instance: fileInstance.id,
             running : true
          };
        }

        const newInstanceObj = {
          dna_id: fileInstance.dna,
          agent_id: fileInstance.agent,
          type: "DNA Instance", // fileInstance.storage.type >>> will this eventually say whether it is a DNA or UI?? or only state "file" ??
          instanceId: fileInstance.id,
          status,
          running
        };

        console.log("newInstanceObj", newInstanceObj);
        return newInstanceObj;
      }
  });
  return dataRefactor(info_instance_log, "Instance");
}

////////////////////////////////////////////////////////
      /* Data for Instance Table Overview */
////////////////////////////////////////////////////////
export const refactorInstanceData = (list_of_instance_info, list_of_installed_instances, list_of_running_instances) => {
  const info_instance_log = list_of_instance_info.map((fileInstance) => {
    if (fileInstance !== parseInt(fileInstance, 10)) {
      let hash = "";
      let status = {};
      let running = {};

      let check_installed = list_of_installed_instances.find((i_instances)=>{
        return i_instances.id ===fileInstance.id
      })
        if (check_installed === undefined){
          status = {
            instance: fileInstance.id,
            dna: {
              dna_id:fileInstance.dna
            },
            agent_id:fileInstance.agent,
            status:"uninstalled"
          };
        }
        else {
          status = {
            instance: fileInstance.id,
            dna: {
              dna_id:fileInstance.dna
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
                running : false
              };
        }
        else {
          running = {
             instance: fileInstance.id,
             running : true
          };
        }

        const newInstanceObj = {
          dna_id: fileInstance.dna,
          agent_id: fileInstance.agent,
          type: "DNA Instance", // fileInstance.storage.type >>> will this eventually say whether it is a DNA or UI?? or only state "file" ??
          instanceId: fileInstance.id,
          status,
          running
        };

        console.log("newInstanceObj", newInstanceObj);
        return newInstanceObj;
      }
  });
  return dataRefactor(info_instance_log, "Instance");
}


export const refactorBaseDna = (instance_dna_id, list_of_dna) => {
  let status = {};
  let instance_list = [];

  console.log("instance_dna_id >> check to see the parent row's (the isntance's) base dna.id : ", instance_dna_id);
  console.log("list_of_dna >> check to see list of installed dna : ", list_of_dna);

  const matching_base_dna = list_of_dna.filter((matched_app) => {
    return matched_app.id === instance_dna_id;
  })
  // console.log(" ! matching_base_dna ! ", matching_base_dna);

  const baseDnaObj = matching_base_dna.map((base_dna) => {
    return {
      dna_id: base_dna.id,
      dna_instance: "Yes",
      type: "DNA",
      hash: base_dna.hash,
      status: {
        instance_list: [], // TODO: Make function to locate the each of this DNA's...
        status:"installed"
      }
    };
  })

  console.log("baseDnaObj", baseDnaObj);
  return dataRefactor(baseDnaObj, "DNA");
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

// Clean-up/Remove (?) the following :
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

  return dataRefactor(info_instance_log, "Instance");
}
////////////////////////////////////////////////////////////////////////////////////////////////////
