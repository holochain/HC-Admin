import cmd from 'node-cmd'

export const checkPort = (portNumber) => {
  return new Promise((resolve,reject)=>{
    callPort(portNumber).then(get_port_details => {
      let checking = get_port_details.split('\n')
      if(checking.length > 1)
      if (checking[1].toLowerCase().indexOf("holochain") >= 0)
      resolve(true);
      resolve (false);
    });
  });
}


const callPort = (portNumber) => {
  return new Promise((resolve,reject)=>{
    cmd.get(
      `lsof -i :` + portNumber,
      function(err, data, stderr) {
        if (!err) {
          resolve(data);
        } else {
          resolve("")
        }
      }
    );
  });
}
