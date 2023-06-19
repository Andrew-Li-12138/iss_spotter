const { nextISSTimesForMyLocation } = require("./iss_promised");
const { printHumanReadable } = require("./index");

nextISSTimesForMyLocation()
  .then((finalResult) =>{
    printHumanReadable(finalResult);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
