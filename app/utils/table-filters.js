export const filterApps = (installed_apps, downloaded_apps) => {
  const mergedAppsList = mergeApps(installed_apps,downloaded_apps);
  return mergedAppsList;
  
  // const allAppsWithStats = addStats(mergedAppsList,allStats)
  // return allAppsWithStats;
}

////////////////////////////////////////////////////////////////////////

const mergeApps = (installed_apps, downloaded_apps) => {
  const filtered_downloaded_apps = downloaded_apps.filter((d_apps) => {
    const duplicate_app = installed_apps.find((i_apps) => {
      return i_apps.appName === d_apps.appName;
    })
    return duplicate_app == undefined
  })
  return [...new Set([...installed_apps, ...filtered_downloaded_apps])]
}
//
//
// const addStats = (allApps,allStats) => {
//   console.log("AllStats:",allStats);
//   const allAppsStats=allApps.map((app) => {
//     if(allStats[app.appName]){
//       const stats=allStats[app.appName];
//       console.log("ENTERED:",stats);
//       return {...app,'CPU%':stats.CPU,'MEM%':stats.MEM,'portNumber':stats.portNumber,'running':true}
//     } else {
//       return {...app,'CPU%':0,'MEM%':0,'portNumber':'-','running':false}
//     }
//   }
// )
//   console.log("All Apps Stats: ",allAppsStats)
//   return allAppsStats
// }
