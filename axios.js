const axios = require('axios');

// axios.get('http://radio.garden/api/ara/content/page/Aq7xeIiB/channels')
//   .then(response => {
//     response.data.data.content[0].items.forEach(item => {
//       const arr = item.href.split('/');
//       console.log(arr[arr.length - 1]);
//     });
//   });
axios.get('http://radio.garden/api/ara/content/places')
  .then(response => {
    let stations = 0;
    let places = 0;
    response.data.data.list.forEach(place => {
      places++;
      stations += place.size;
    });
    console.log(`There are ${places} places and ${stations} stations on Radio.Garden.`);
  });