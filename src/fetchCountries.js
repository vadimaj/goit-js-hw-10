import { Notify } from 'notiflix/build/notiflix-notify-aio';
export class RestCountriesApi {
  constructor() {
    this.searchQuery = '';
  }

  fetchCountries() {
    const url = `https://restcountries.com/v3.1/name/${this.searchQuery}?fields=name,capital,languages,population,flags`;

    console.log(url);
    if (this.searchQuery !== '') {
      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(response.status);
          }

          return response.json();
        })

        .then(countries => {
          return countries;
        })
        .catch(error => {
          Notify.failure('Oops, there is no country with that name');
        });
    }
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery.trim();
  }
}
