export const handleCloseWindow = () => {
  console.log("TRYING TO CLOSE APP...")
  const { ipcRenderer } = electron;
  const quit = 'quit'
  ipcRenderer.send("window:close", quit);
};

const manageAllDownloadedApps=(allApps)=>{
  console.log("helper function manageAllDownloadedApps...");
  let listOfApps = allApps.split("\n");
  listOfApps = listOfApps.filter((app)=>{
    return app !== "";
  });
  const app_details = listOfApps.map((app)=>{
    // ATTN > changed app_name tp dna_id
    return { "dna_id": app,
     "path": `~/.hcadmin/holochain-download/${app}` }
  });
  return app_details;
}
export default manageAllDownloadedApps;

//////////////////////////////////////////
    // The Container API Calls
/////////////////////////////////////////

// <div className="App-header">
//   <button className="InstallButton" type="button" onClick={e => this.refresh()}>Refresh</button>
// </div>

//
// triggerWebClientCallTest = () => {
// // call for GET_INFO_INSTANCES()
//   this.props.get_info_instances().then(res => {
//     this.callFetchState();
//     console.log("Home props after INFO/INSTANCES call", this.props);
//   })
//
// // call for INSTALL_DNA_FROM_FILE ({ id, path })
//   const dna_file = {
//     id: "app spec instance 3",
//     path: "/home/lisa/Documents/gitrepos/holochain/holochain-rust/app_spec/dist/app_spec.hcpkg"
//   };
//   this.props.install_dna_from_file(dna_file).then(res => {
//     this.callFetchState();
//     console.log("Home props after INSTALL call", this.props);
//   })
//
// // call for LIST_OF_DNA()
//   this.props.list_of_dna().then(res => {
//     this.callFetchState();
//     console.log("Home props after LIST_OF_DNA call", this.props);
//   })
//
// // call for ADD_AGENT_DNA_INSTANCE ({ id })
//   const agent_dna_instance = {
//     id: "app spec instance 4",
//     dna_id:"app spec rust",
//     agent_id:"test agent 1"
//   }
//   this.props.add_agent_dna_instance(agent_dna_instance).then(res => {
//     this.callFetchState();
//     console.log("Home props after ADD_AGENT_DNA_INSTANCE call", this.props);
//   })
//
//   // call for LIST_OF_INSTANCES ()
//   this.props.list_of_instances().then(res => {
//     this.callFetchState();
//     console.log("Home props after LIST_OF_INSTANCES call", this.props);
//   })
//
// // call for START_AGENT_DNA_INSTANCE ({ id })
//   const start_agent_dna_instance_by_id = { id: "app spec instance 4" }
//   this.props.start_agent_dna_instance(start_agent_dna_instance_by_id).then(res => {
//     this.callFetchState();
//     console.log("Home props after START_AGENT_DNA_INSTANCE call", this.props);
//   })
//
//   // call for LIST_OF_RUNNING_INSTANCES ()
//   this.props.list_of_running_instances().then(res => {
//     this.callFetchState();
//     console.log("Home props after LIST_OF_RUNNING_INSTANCES call", this.props);
//   })
//
// // call for STOP_AGENT_DNA_INSTANCE ({ id })
//   const stop_agent_dna_instance_by_id = { id: "app spec instance 4" }
//   this.props.stop_agent_dna_instance(stop_agent_dna_instance_by_id).then(res => {
//     this.callFetchState();
//     console.log("Home props after STOP_AGENT_DNA_INSTANCE call", this.props);
//   })
//
// // call for UNINSTALL_DNA_BY_ID ({ id })
//   const dna_by_id = {id: "app spec instance 4"}
//   this.props.uninstall_dna_by_id(dna_by_id).then(res => {
//     this.callFetchState();
//     console.log("Home props after DNA_BY_ID call", this.props);
//   })
//
// // call for REMOVE_AGENT_DNA_INSTANCE ({ id })
//   const remove_agent_dna_instance_by_id = { id: "app spec instance 4" }
//   this.props.remove_agent_dna_instance(remove_agent_dna_instance_by_id).then(res => {
//     this.callFetchState();
//     console.log("Home props after REMOVE_AGENT_DNA_INSTANCE call", this.props);
//   })
// }
