import axios from 'axios';

const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_eEKqV-Aolo5VsDjcFXhrXxZcFIgNVGE2dy0r1ESZ4TFEzwZWA8DmFWrY04kY6VRFaUtEcDF_RWHW/pub?output=csv';

axios.get(url)
  .then(response => {
    const lines = response.data.split('\n');
    console.log(lines.slice(0, 5).join('\n'));
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
