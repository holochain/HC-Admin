const fs = require("fs");
const path = require("path");
// const process = request("process")
export const getRunningApps = () => {
 const data = fs.readFileSync(path.resolve(__dirname, "../hcadmin-track.txt"));

  const dataString = data.toString();
  const lines = dataString.split('\n').map((line) => {
    if (line !== "") {
      const values = line.split(',')
      return {
        "app_name": values[0],
        "app_url": values[1]
      };
    }
  })
  const runningApps = lines.filter((app) => {
    return app !== undefined;
  });
  console.log("Running Apps: ", runningApps);
  return runningApps;
}

const reconstructText= (runningApps)=>{
  let data='';
  runningApps.forEach((app)=>{
    data=data+runningApps.app_name+','+runningApps.app_url+' \n '
  });
  fs.writeFile(path.resolve(__dirname, "../hcadmin-track.txt"), data, function(err, data){
    if (err) console.log(err);
    console.log("Successfully Rewritten to File.");
});
}

export const decideFreePort = (allStats) => {
  let startPort = 4141;
  const runningPorts=getPortsUsed(allStats);
  console.log("PORTS USED:",runningPorts);
  while (runningPorts.includes(startPort)) {
    startPort++
  }
  console.log("StartPort",startPort)
  return startPort;
}

const getPortsUsed=(allStats)=>{
  let portsUsed=[]
  console.log("ALLSTATS::-->",allStats);

  for(let stats in allStats){
    console.log("STAT->",stats);
    if(allStats[stats].portNumber)
      portsUsed.push(parseInt(allStats[stats].portNumber))
    }
  // console.log("->",portsUsed);
  return portsUsed;
}
