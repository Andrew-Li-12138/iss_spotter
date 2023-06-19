const request = require('request-promise-native');
const ipURL = 'https://api.ipify.org?format=json';
const geoAPI = 'http://ipwho.is/';
const fetchMyIP = function() {
  return request(ipURL);
};


const fetchCoordsByIP = function(body) {
  const locObj = JSON.parse(body);
  const locStr = locObj.ip;
  return request(`${geoAPI}${locStr}`);
};

const fetchISSFlyOverTimes = function(body) {
  const geoObj = JSON.parse(body);
  const tudesObj = {
    latitude: `${geoObj.latitude}`,
    longitude: `${geoObj.longitude}`
  };
  const locUrl = `https://iss-flyover.herokuapp.com/json/?lat=${tudesObj.latitude}&lon=${tudesObj.longitude}`;
  return request(locUrl);
    
};


const nextISSTimesForMyLocation = function() {
  const promisedResult = fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((body) => {
      const passTimeObj = JSON.parse(body);
      const finalResult = passTimeObj.response;
      return finalResult;
    });
  return promisedResult;
};


module.exports = { nextISSTimesForMyLocation };