const fs = require('fs').promises;
const axios = require('axios');

const addStation = async() => {

  try {
  
    await axios.get('http://radio.garden/api/ara/content/places')
      .then(response => {
        response.data.data.list.slice(0, 1).forEach(place => {
          const placeData = `(${place.id}, ${place.title}, ${place.country}, ${place.geo[0]}, ${place.geo[1]},`;
          axios.get(`http://radio.garden/api/ara/content/page/${place.id}/channels`)
            .then(response => {
              response.data.data.content[0].items.forEach(item => {
                const split = item.href.split('/');
                const channelID = split[split.length - 1];
                const title = item.title;
                const link = `http://radio.garden/api/ara/content/listen/${channelID}/channel.mp3`;
                const stationData = ` ${channelID}, ${title}, ${link}),`;
                const toWrite = placeData + stationData;
                fs.writeFile('seed.sql', toWrite, { flag: 'a' });
              });
            });
        });
      });
  
  } catch (error) {
    console.error(`Got an error trying to write to a file: ${error.message}`);
  }

};

(async function() {
  await addStation();
})();



