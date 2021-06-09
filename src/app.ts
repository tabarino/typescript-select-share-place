import axios from "../node_modules/axios/index";

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number, lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS'
};

const GOOGLE_API_KEY = 'XXX';

const form = document.querySelector('form')!;
const address = document.getElementById('address')! as HTMLInputElement;

function searchAddressHandler(event: Event) {
  event.preventDefault();

  let enteredAddress = address.value;
  enteredAddress = encodeURI(enteredAddress);

  axios.get<GoogleGeocodingResponse>(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${enteredAddress}&key=${GOOGLE_API_KEY}`
  ).then(response => {
    if (response.data.status !== 'OK') {
      throw new Error('Could not fetch location!');
    }

    const coordinates = response.data.results[0].geometry.location;
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: coordinates,
      zoom: 16,
    });

    new google.maps.Marker({ position: coordinates, map: map });

  }).catch(err => {
    alert(err.message);
    console.error(err);
  });
}

form.addEventListener('submit', searchAddressHandler);
