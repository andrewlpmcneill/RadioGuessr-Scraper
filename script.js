const fs = require('fs').promises;
const axios = require('axios');
const axiosThrottle = require('axios-request-throttle');

axiosThrottle.use(axios, { requestsPerSecond: 100 });

const addStation = async() => {

  try {
  
    await axios.get('http://radio.garden/api/ara/content/places')
      .then(response => {
        response.data.data.list.forEach(place => {
          let placeTitle = place.title;
          if (placeTitle.includes("'")) placeTitle = placeTitle.replaceAll("'", "''");
          let placeCountry = place.country;
          if (placeCountry.includes("'")) placeCountry = placeCountry.replaceAll("'", "''");
          const placeData = ` '${place.id}', '${placeTitle}', '${placeCountry}', ${place.geo[0]}, ${place.geo[1]}),\n`;
          axios.get(`http://radio.garden/api/ara/content/page/${place.id}/channels`)
            .then(response => {
              response.data.data.content[0].items.forEach(item => {
                const split = item.href.split('/');
                const channelID = split[split.length - 1];
                let stationTitle = item.title;
                if (stationTitle.includes("'")) stationTitle = stationTitle.replaceAll("'", "''");
                const link = `http://radio.garden/api/ara/content/listen/${channelID}/channel.mp3`;
                const stationData = `('${channelID}', '${stationTitle}', '${link}',`;
                const toWrite = stationData + placeData;
                fs.writeFile('seed2.sql', toWrite, { flag: 'a' });
              });
            });
        });
      });
  
  } catch (error) {
    console.error(`Got an error trying to write to a file.`);
  }

};

(async function() {
  await addStation();
})();



