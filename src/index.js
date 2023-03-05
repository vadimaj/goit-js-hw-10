import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { RestCountriesApi } from './fetchCountries';
import './css/styles.css';
const DEBOUNCE_DELAY = 300;

refs = {
  inputEl: document.querySelector('#search-box'),
  countryInfoEl: document.querySelector('.country-info'),
  countryListEl: document.querySelector('.country-list'),
};

const restCountries = new RestCountriesApi();

refs.inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  restCountries.query = e.target.value;

  restCountries.fetchCountries().then(countries => {
    console.log(countries);

    if (countries.length === 1) {
      refs.countryInfoEl.innerHTML = '';
      refs.countryListEl.innerHTML = '';
      refs.countryInfoEl.insertAdjacentHTML(
        'beforeend',
        makeCountryMarkup(countries[0])
      );
    } else if (countries.length > 1 && countries.length <= 10) {
      console.log(countries.length);
      refs.countryListEl.innerHTML = '';
      refs.countryInfoEl.innerHTML = '';
      refs.countryListEl.insertAdjacentHTML(
        'beforeend',
        makeCountryList(countries)
      );
    } else {
      refs.countryListEl.innerHTML = '';
      refs.countryInfoEl.innerHTML = '';
      Notify.info('Too many matches found. Please enter a more specific name.');
    }
  });
}
function makeCountryMarkup(country) {
  const {
    flags: { svg: svgSource, alt },
    name: { common: commonName },
    capital,
    population,
    languages,
  } = country;
  return `<div class="card-header">    
    <div class="card-img">
      <img src="${svgSource}" alt="${alt}" height="50" />
    </div>
    <h2 class="card-title">${commonName}</h2>
  </div>
  <div class="card-body">
    <p class="card-text">Capital: <span class = "card-data">${capital.join(
      ', '
    )}<span></p>
    <p class="card-text">Population: <span class = "card-data">${population}<span></p>
    <p class="card-text">Languages: <span class = "card-data">${Object.values(
      languages
    ).join(', ')}<span></p>
    </div>
  </div>
  `;
}

function makeCountryRowMarkup(country) {
  const {
    flags: { svg: svgSource, alt },
    name: { common: commonName },
  } = country;
  return `<li class="card-header">
       <div class="card-img">
      <img src="${svgSource}" alt="${alt}" height="20" />
    </div>
    <h2 class="country-list-title">${commonName}</h2>
    </li>`;
}

function makeCountryList(countries) {
  return countries.map(makeCountryRowMarkup).join('');
}
