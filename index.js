// const { fetchMyIP } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('It worked! Returned IP:' , ip);
//   console.log(typeof ip)
// });

// const { fetchCoordsByIP } = require('./iss')

// fetchCoordsByIP('135.0.125.5', (error, data) => {
//   if (error) {
//     console.log("It didn't work!", error)
//     return;
//   }
//   console.log('It worked! Returned geo info:', data)
// }
//  )

// const { fetchISSFlyOverTimes } = require('./iss')
// const nfCoords = { latitude: '43.467517', longitude: '-79.6876659' }

// fetchISSFlyOverTimes(nfCoords, (error, data) => {
//   if (error) {
//     console.log("It didn't work!", error)
//     return
//   }
//   console.log('It worked! Returned passing time and duration:', data)
// });

const { nextISSTimesForMyLocation } = require('./iss');

const printHumanReadable = function(passTimes) {
  for (let time of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(time.risetime);
    const duration = time.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printHumanReadable(passTimes);
});