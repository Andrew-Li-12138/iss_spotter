
//Makes a single API request to retrieve the user's IP address.

const request = require("request");
const ipURL = 'https://api.ipify.org?format=json';

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request(ipURL, (error, response, body) => {
    //handle error when accessing ipURL failed
    if (error) {
      callback(error, null);
      return;
    }

    //handle error if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // if we get here, all's well and we got the data

    //turn JSON formatted string into JS object
    const ipObj = JSON.parse(body);
    //access IP address when its not empty
    const ipStr = ipObj.ip;
    if (ipStr.length !== 0) {
      callback(null, ipStr);
    }
  });
};


//Fetch Geo Coordinates By IP
const geoAPI = 'http://ipwho.is/';
const fetchCoordsByIP = function(ip, callback) {
  //send request to ipwho.is[ip]
  request(`${geoAPI}${ip}`, (error, response, body) => {
    //handle error when accessing ipwho.is[ip] failed
    if (error) {
      callback(error, null);
      return;
    }
    //turn JSON formatted string into JS object
    const geoObj = JSON.parse(body);

    //handle error when ipwho.is[ip] return an error
    if (!geoObj.success) {
      const message = `Attemp to get geo coordinates returns ${geoObj.success} when fetching IP ${geoObj.ip} from server. Message from server: ${geoObj.message}`;
      callback(Error(message), null);
      return;
    }
    //access latitude and longitude
    const tudeObj = {
      latitude: `${geoObj.latitude}`,
      longitude: `${geoObj.longitude}`
    };
    callback(null, tudeObj);

  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const fetchISSFlyOverTimes = function(coords, callback) {
  //send request to iss-flyover API
  const passRecordUrl = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(passRecordUrl, (error, response, body) => {
    //handle error when accessing the URL fails
    if (error) {
      callback(error, null);
      return;
    }
    //handle error if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS passing records. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    //turn JSON formatted string into JS object
    const passTimeObj = JSON.parse(body);
    //access response key in the object
    const passTimeArr = passTimeObj.response;
    callback(null, passTimeArr);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, location) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(location, (error, data) => {
        if (error) {
          return callback(error, null);
        }

        callback(error, data);

      });
    }
    );
  }
  );
};

module.exports = { nextISSTimesForMyLocation };