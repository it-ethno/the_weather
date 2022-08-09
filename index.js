const apiKeyOpenWeather = 'Your OpenWeatherMap API Key goes here';
const apiKeyUnsplash = 'Your Unsplash API Key goes here';
const apiKeyNASA = 'Your NASA API Key goes here';

/* Base URLs for all used APIs */
const baseURLWeatherMap = 'https://tile.openweathermap.org/map/precipitation_new/';
const baseURLForecast = 'https://api.openweathermap.org/data/2.5/forecast?';
const baseURLUnsplash = 'https://api.unsplash.com/search/photos?per_page=30';

/* Handlers for static HTML Elements */
const allTainer = document.querySelector('#alltainer');

const currentNow = document.querySelector('#currentNow');
const currentLocation = document.querySelector('#currentLocation');
const currentTemperature = document.querySelector('#currentTemperature');
const currentIcon = document.querySelector('#currentIcon');
const currentDescription = document.querySelector('#currentDescription');
const currentFeelsLike = document.querySelector('#currentFeelsLike');
const currentMinMax = document.querySelector('#currentMinMax');
const currentPressure = document.querySelector('#currentPressure');
const currentHumidity = document.querySelector('#currentHumidity');
const currentPop = document.querySelector('#currentPop');
const currentSunrise = document.querySelector('#currentSunrise');
const currentSunset = document.querySelector('#currentSunset');
const currentForecastDisplay = document.querySelector('#currentForecast');
const meteorsMessage = document.querySelector('#currentMeteors');
const meteorsDisplay = document.querySelector('#meteors');
const meteorIcon = document.querySelector('#meteor');

const todayDisplay = document.querySelector('#today');
const theNext4Display = document.querySelector('#theNext4');
const theNext24Display = document.querySelector('#theNext24');

const menuButton = document.querySelector('#menuButton');
const menu = document.querySelector('#menu');

const footer = document.querySelector('#footer');

const imageCaption = document.querySelector('#imageCaption');
const imageControls = document.querySelector('#imageControls');
const imagesBtn = document.querySelector('#imagesBtn');

const prefColorSelect = document.querySelector('#preferredColor');
const bwCheckbox = document.querySelector('#blackAndWhiteUnsplash');
const useLocCheckbox = document.querySelector('#useLocationQuery');
const use5050Checkbox = document.querySelector('#useFiftyFiftyQuery');
const combineLocWeatherCheckbox = document.querySelector('#combineLocationWeatherQuery');
const usePrefColorCheckbox = document.querySelector('#usePreferredColor');
const panelOpacitySlider = document.querySelector('#panelOpacity');

menuButton.addEventListener('click', toggleMenu);
currentLocation.addEventListener('click', showInput);
imageControls.addEventListener('click', handlePlayPause);
imagesBtn.addEventListener('click', showImageHistory);
panelOpacitySlider.addEventListener('input', handleSettingsChange);

/* Fix the emptystring problem */
menu.style.visibility = 'hidden';

let place = 'Mülheim';
let placeGeo = {};
let locationObj = {};

let backgroundPath = '';
let backgroundSearchString = '';
let backgroundImage = {};

/* All stuff meteoreous */
let dangerous = 0;
let meteors = [];
let dangerousMeteors = [];

let currentConditions = {};
let today = [];

let windowWidth = window.screen.width;
let windowHeight = window.screen.height;

/* Settings Variables */
let show24Details = true;
let showMap = false;
let showCommingDays = true;
let showMeteors = true;
let showApod = false;
let useUnsplashBackgrounds = true;
let language = 'de';
let refreshInterval = 5;
let onlyBlackAndWhite = false;
let useLocationQuery = false;
let combineLocationWeather = false;
let use5050Query = false;
let formerImageWasLocation = false;
let preferredColor = 'black';
let usePreferredColor = false;
let panelBgColor = 'rgba(30, 30, 30, 0.6)';
let panelBgValues = { r: '30', g: '30', b: '30', a: '0.6' };
let units = 'C';
let fixedLocation = 'Mülheim (Ruhr)';
let useFixedLocation = false;

/* Settings Object - NOT YET IN USE! */
const settingsObj = {
    show24: true,
    showMap: true,
    showComingDays: true,
    showMap: false,
    showMeteors: true,
    showApod: false,
    useUnsplash: true,
    language: 'de',
    units: 'C',
    refreshInterval: 5,
    useLocation: false,
    combineLocationWeather: false,
    use5050: false,
    onlyBlackAndWhite: false,
    usePreferredColor: false,
    preferredColor: 'black',
    panelBackground: { r: '30', g: '30', b: '30', a: '0.6' },
    fixedLocation: 'Mülheim (Ruhr)',
    useFixedLocation: false
};

/* Information about the Authors of the static Background Images */
let backgroundAuthors = new Map([
    ['Ash', { name: 'Yosh Ginsu', link: 'https://unsplash.com/@yoshginsu' }],
    ['Clear', { name: 'Patrick Fore', link: 'https://unsplash.com/@patrickian4' }],
    ['Clouds', { name: 'Billy Huynh', link: 'https://unsplash.com/@billy_huy' }],
    ['Drizzle', { name: 'Anant Chandra', link: 'https://unsplash.com/@anant347' }],
    ['Dust', { name: 'Jessica Knowlden', link: 'https://unsplash.com/@mybibimbaplife'}],
    ['Fog', { name: 'Annie Spratt', link: 'https://unsplash.com/@anniespratt' }],
    ['Haze', { name: 'Alex Gindin', link: 'https://unsplash.com/@alexgindin' }],
    ['Mist', { name: 'Chris Lawton', link: 'https://unsplash.com/@chrislawton' }],
    ['Rain', { name: 'Alessio Lin', link: 'https://unsplash.com/@lin_alessio'}],
    ['Sand', { name: 'Keith Hardy', link: 'https://unsplash.com/@keithhardy2001' }],
    ['Smoke', { name: 'Corina Rainer', link: 'https://unsplash.com/@corinarainer' }],
    ['Snow', { name: 'Filip Bunkens', link: 'https://unsplash.com/@thebeardbe' }],
    ['Squall', { name: 'Juan Gomez', link: 'https://unsplash.com/@nosoylasonia' }],
    ['Thunderstorm', { name: 'Cooper Baumgartner', link: 'https://unsplash.com/@cooper_baumgartner' }],
    ['Tornado', { name: 'Nikolas Noonan', link: 'https://unsplash.com/@nikolasnoonan' }]
]);

/* Map containing all Translations by language code key */
let i18nTranslations = new Map([
    ['en', {
        'Die nächsten 24 Stunden': 'The next 24 hours',
        'Die kommenden Tage': 'The coming days',
        'Stop/Start Hintergrundbilder': 'Stop/Start Background Images',
        'Gefühlt': 'Feels like',
        'Das Wetter': 'The Weather',
        'Luftfeuchtigkeit': 'Humidity',
        'Luftdruck': 'Pressure',
        'Regenrisiko': 'Risk of Rain',
        'Regenwahrscheinlichkeit': 'Risk of Rain',
        'Sonnenaufgang': 'Sunrise',
        'Sonnenuntergang': 'Sunset',
        'Einstellungen': 'Settings',
        'Anzeige': 'Display',
        'Zeige Tagesdetails': 'Show Next 24 hours',
        'Zeige Wetterkarte': 'Show Weathermap',
        'Zeige kommende Tage': 'Show the Coming days',
        'Zeige Meteoritenwarnung': 'Show Meteor Warning',
        'Zeige NASA Bild des Tages': 'Show NASA Image of the Day',
        'Unsplash Bildhintergrund': 'Unsplash Image Background',
        'Nutze Unsplash Hintergrundbilder': 'Use Unsplash Background',
        'Nutze Ort für Hintergrundbilder': 'Use Location for Background',
        'Kombiniere Ort und Wetter': 'Combine Location and Weather',
        '50/50 Ort/Wetter': '50/50 Location/Weather',
        'Nur Schwarz-Weiss Bilder': 'Only Black-and-White Images',
        'Eine Farbe bevorzugen': 'Prefer a Color',
        'Bevorzugte Farbe': 'Preferred Color',
        'Schwarz': 'Black',
        'Weiss': 'White',
        'Gelb': 'Yellow',
        'Orange': 'Orange',
        'Rot': 'Red',
        'Violett': 'Purple',
        'Magenta': 'Magenta',
        'Grün': 'Green',
        'Blaugrün': 'Teal',
        'Blau': 'Blue',
        'Sonstiges': 'Other',
        'Sprache': 'Language',
        'Deutsch': 'German',
        'Englisch': 'English',
        'Aktualisierung': 'Refresh',
        'Manuell': 'Manual',
        'Jede Minute': 'Every Minute',
        'Alle 2 Minuten': 'Every 2 Minutes',
        'Alle 5 Minuten': 'Every 5 Minutes',
        'Alle 10 Minuten': 'Every 10 Minutes',
        'Alle 15 Minuten': 'Every 15 Minutes',
        'Alle 30 Minuten': 'Every 30 Minutes',
        'Alle 45 Minuten': 'Every 45 Minutes',
        'Alle 60 Minuten': 'Every 60 Minutes',
        'Masseinheit': 'Unit',
        'Celsius': 'Celsius',
        'Fahrenheit': 'Fahrenheit',
        'Hintergrundfarbe Panels': 'Background Color Panels',
        'Deckkraft': 'Opacity',
        'Speichere momentanes Bild': 'Save Current Image',
        'Bitte geben Sie einen neuen Ort ein': 'Please enter a new Location',
        'Titel': 'The Weather',
        'Foto': 'Photograph',
        'von': 'by',
        'Verlauf Hintergrundbilder': 'Background Images History',
        'Bisherige Orte': 'Previous Locations',
        'Grad': 'Degrees'
    }],
    ['de', {
        'The next 24 hours': 'Die nächsten 24 Stunden',
        'The coming days': 'Die kommenden Tage',
        'Feels like': 'Gefühlt',
        'The Weather': 'Das Wetter',
        'Humidity': 'Luftfeuchtigkeit',
        'Pressure': 'Luftdruck',
        'Risk of Rain': 'Regenrisiko',
        'Sunrise': 'Sonnenaufgang',
        'Sunset': 'Sonnenuntergang',
        'Settings': 'Einstellungen',
        'Show Next 24 hours': 'Zeige Tagesdetails',
        'Show the coming days': 'Zeige kommende Tage',
        'Show Meteor Warning': 'Zeige Meteoritenwarnung',
        'Show NASA Image of the Day': 'Zeige NASA Bild des Tages',
        'Use Unsplash Background Images': 'Nutze Unsplash Hintergrundbilder',
        'Language': 'Sprache',
        'German': 'Deutsch',
        'English': 'Englisch',
        'Refresh': 'Aktualisierung',
        'Manual': 'Manuell',
        'Every Minute': 'Jede Minute',
        'Every 5 Minutes': 'Alle 5 Minuten',
        'Every 10 Minutes': 'Alle 10 Minuten',
        'Every 15 Minutes': 'Alle 15 Minuten',
        'Every 30 Minutes': 'Alle 30 Minuten',
        'Every 45 Minutes': 'Alle 45 Minuten',
        'Every 60 Minutes': 'Alle 60 Minuten',
        'Save Current Image': 'Speichere momentanes Bild',
        'Please enter a new Location': 'Bitte geben Sie einen neuen Ort ein',
        'Titel': 'Das Wetter'      
    }]
]);

let backgroundIsRunning = true;
let imageURL = '';

const weekdaysAbbr = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];

let placeTimeOffset = 0;

let imageHistory = [];
let locationHistory = new Map();

let refresh;
let forecastDays = [];

/* +++++ */

initializeSettings();
startRefresh();
disabledMechanics();
i18nTranslateAll();
updatePanelColors();
getData();

function getData() {
    getForecast();
    getAsteriods();
    equipListeners();
}

/* Get a random image from Unsplash fitting the current weather condition and/or the location */
function getBackgroundImage() {

    /* Randomly set the requested resultpage between 1 and 10 for greater variety */
    let page = '&page=' + Math.round((Math.random() * 9) + 1);

    let bw = '';
    let prefColor = '';

    if (onlyBlackAndWhite) {
        bw = '&color=black_and_white';
    }

    if (useLocationQuery) {
        if (use5050Query && formerImageWasLocation) {
            backgroundSearchString = '&query=' + currentConditions.mainWeather;
            formerImageWasLocation = false;
        } else if (combineLocationWeather) {
            backgroundSearchString = '&query=' + encodeURIComponent(place).replace(/[!'()*]/g, function(c) {
                return '%' + c.charCodeAt(0).toString(16);
            }) + '%20' + currentConditions.mainWeather;
            formerImageWasLocation = true;                      
        } else if (useFixedLocation) {
            backgroundSearchString = '&query=' + encodeURIComponent(fixedLocation).replace(/[!'()*]/g, function(c) {
                return '%' + c.charCodeAt(0).toString(16);
            });            
        } else {
            backgroundSearchString = '&query=' + encodeURIComponent(place).replace(/[!'()*]/g, function(c) {
                return '%' + c.charCodeAt(0).toString(16);
            });
            formerImageWasLocation = true;
        }

        let lastResults;
        if (useFixedLocation) {
            lastResults = locationHistory.get(fixedLocation).imagePages || 1;
        } else {
            lastResults = locationHistory.get(place).imagePages || 1;
        }

        if (lastResults > 1) {
            page = '&page=' + Math.round((Math.random() * (lastResults-1)) + 1);
        } else {
            page = '&page=1';
        }    
    }

    if (usePreferredColor) {
        prefColor = '&color=' + preferredColor;
    }

    let unsplashRequest = baseURLUnsplash + page + backgroundSearchString + bw + prefColor + '&client_id=' + apiKeyUnsplash;

    fetch(unsplashRequest, { mode: 'cors' })
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        console.log('+++ Images Response +++');
        console.log(response);

        let index = Math.round(Math.random() * (response.results.length-1));
        backgroundPath = response.results[index].urls.full + '&fit=crop&w=' + windowWidth + '&h=' + windowHeight;
        backgroundImage = {
            name: response.results[index].user.name,
            username: response.results[index].user.username,
            location: response.results[index].user.location,
            unsplashLink: response.results[index].user.links.html,
            fullImageLink: response.results[index].urls.full,
            imageDescription: response.results[index].description,
            imageAltDescription: response.results[index].alt_description,
            imageHTML: response.results[index].links.html,
            imageRegular: response.results[index].urls.regular,
            imageFull: response.results[index].urls.full,
            imageSmall: response.results[index].urls.small,
            userProfileImage: response.results[index].user.profile_image.medium
        };
        
        imageHistory.push(backgroundImage);
        if (imageHistory.length > 16) {
            imageHistory.shift();
        }
        localStorage.setItem('imageHistory', JSON.stringify(imageHistory));

        if (useLocationQuery) {
            if (useFixedLocation) {
                locationHistory.get(fixedLocation).imagePages = response.total_pages;
            } else {
                locationHistory.get(place).imagePages = response.total_pages;
            }
        }
        localStorage.setItem('locationHistory', JSON.stringify(Object.fromEntries(locationHistory)));

        changeBackground();
    });
}

/* Get NearEarthObjects for today from NASA */
function getAsteriods() {
    let requestDateNASA = new Date().toISOString().slice(0, 10);
    let asteriodsReq = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=' + requestDateNASA + '&end_date=' + requestDateNASA + '&api_key=' + apiKeyNASA;
    
    fetch(asteriodsReq, { mode: 'cors' })
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log('+++ Asteriods +++');
            console.log(response);
            dangerous = 0;
            dangerousMeteors = [];
            let neos = response.near_earth_objects;
            let single = neos[requestDateNASA];
            
            for (let i = 0; i < single.length; i++) {
                if (single[i].is_potentially_hazardous_asteriod) {
                    dangerous++;
                    dangerousMeteors.push(single[i]);
                }
            }
            meteors = single;
            updateMeteorDisplay();
        });
}

/* Get the Forecast for 5 days every 3 hours from Openweather */
function getForecast() {
    
    let reqQuery = 'q=' + place;
    let reqKey = '&appid=' + apiKeyOpenWeather;
    let reqUnits = '&units=metric';
    if (units === 'F') {
        reqUnits = '&units=imperial';
    } else if (units === 'K') {
        reqUnits = '';
    }
    let reqLang = '&lang=' + language;
    
    let forecastRequest = baseURLForecast + reqQuery + reqKey + reqUnits + reqLang;

    fetch(forecastRequest, { mode: 'cors' })
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            today = [];
            currentConditions = {};
            
            place = response.city.name;
            placeCountry = response.city.country;
            placeGeo = { lat: response.city.coord.lat, lon: response.city.coord.lon };
            placeTimeOffset = response.city.timezone;
            
            locationObj = { 
                name: response.city.name, 
                country: response.city.country, 
                timezoneOffset: response.city.timezone,
                lat: response.city.coord.lat,
                lon: response.city.coord.lon,
                count: 1,
                imagePages: 1
            };
            if (!locationHistory.get(response.city.name)) {
                locationHistory.set(response.city.name, locationObj);
            } else {
                locationHistory.get(response.city.name).count += 1;
            }
            localStorage.setItem('locationHistory', JSON.stringify(Object.fromEntries(locationHistory)));
            
            currentConditions = {
                temperature: response.list[0].main.temp,
                temperatureMax: response.list[0].main.temp_max,
                temperatureMin: response.list[0].main.temp_min,
                feelsLike: response.list[0].main.feels_like,
                humidity: response.list[0].main.humidity,
                pressure: response.list[0].main.pressure,
                mainWeather: response.list[0].weather[0].main,
                mainDescription: response.list[0].weather[0].description,
                mainIcon: response.list[0].weather[0].icon,
                windSpeed: response.list[0].wind.speed,
                windDirection: response.list[0].wind.deg,
                cloudiness: response.list[0].clouds.all,
                precipitation: Math.round(response.list[0].pop * 100),
                sunrise: new Date(response.city.sunrise * 1000),
                sunset: new Date(response.city.sunset * 1000)
            };

            /* Find first Midnight Forecast */
            let nextMidnightIndex = -1;
            let count = 0;
            while (nextMidnightIndex < 0) {
                if (response.list[count].dt_txt.substring(11) === '00:00:00') {
                    nextMidnightIndex = count;
                }
                count++;
            }

            /* Assemble an Object forecastDay with an Array Property holding all forecasts for one Day */
            /* THESE should be the Objects used in Display! */
            forecastDays = [];
            for (let m = nextMidnightIndex; m < response.list.length-8; m += 8) {
                let noonIcon = '';
                let eveningIcon = '';
                let dayCasts = [];
                let dayPops = [];
                let dayPressures = [];
                let dayHums = [];
                let dayTemps = [];
                let dayDescs = [];
                let dayFeelsLikes = [];

                for (let n = m; n < m+8; n++) {
                    let singleCast = {
                        dt_str: response.list[n].dt_txt,
                        temperature: response.list[n].main.temp,
                        humidity: response.list[n].main.humidity,
                        pressure: response.list[n].main.pressure,
                        pop: response.list[n].pop,
                        mainWeather: response.list[n].weather[0].main,
                        mainDesc: response.list[n].weather[0].description,

                    };
                    dayPops.push(response.list[n].pop);
                    dayPressures.push(response.list[n].main.pressure);
                    dayHums.push(response.list[n].main.humidity);
                    dayTemps.push(response.list[n].main.temp);
                    dayDescs.push(response.list[n].weather[0].description);
                    dayFeelsLikes.push(response.list[n].main.feels_like);

                    if (response.list[n].dt_txt.substring(11) === '12:00:00') {
                        noonIcon = response.list[n].weather[0].icon;
                    } else if (response.list[n].dt_txt.substring(11) === '21:00:00') {
                        eveningIcon = response.list[n].weather[0].icon;
                    }
                    dayCasts.push(singleCast);
                }
                let minAndMax = calculateMinMax(dayTemps);
                let day = {
                    dayDateString: response.list[m].dt_txt.substring(0, 10),
                    dayDate: response.list[m].dt_txt,
                    avTemperature: Number(calculateAverage(dayTemps).toFixed(1)),
                    avPop: Number(calculateAverage(dayPops).toFixed(1)),
                    avHum: Number(calculateAverage(dayHums).toFixed(1)),
                    avPress: Number(calculateAverage(dayPressures).toFixed(1)),
                    avFeelsLike: Number(calculateAverage(dayFeelsLikes).toFixed(1)),
                    dayCasts: dayCasts,
                    noonIcon: noonIcon,
                    eveningIcon: eveningIcon,
                    minTemperature: minAndMax.min,
                    maxTemperature: minAndMax.max,
                    dominantDesc: getDominantDescription(dayDescs)
                };
                
                forecastDays.push(day);
            }

            /* Assemble Forecast Objects for the next 24 hours (every 3 hours) */
            for (let i = 1; i < 9; i++) {
                let forecastItem = {
                    datetime: response.list[i].dt_txt,
                    temperature: response.list[i].main.temp,
                    temperatureMax: response.list[i].main.temp_max,
                    temperatureMin: response.list[i].main.temp_min,
                    feelsLike: response.list[i].main.feels_like,
                    humidity: response.list[i].main.humidity,
                    pressure: response.list[i].main.pressure,
                    mainWeather: response.list[i].weather[0].main,
                    mainDescription: response.list[i].weather[0].description,
                    mainIcon: response.list[i].weather[0].icon,
                    windSpeed: response.list[i].wind.speed,
                    windDirection: response.list[i].wind.deg,
                    cloudiness: response.list[i].clouds.all,
                    precipitation: Math.round(response.list[i].pop * 100)
                };
                today.push(forecastItem);
            }

            if (response.list[0].weather[0].main === 'Clear') {
                backgroundSearchString = '&query=Clear%20Sky';
            } else {
                backgroundSearchString = '&query=' + response.list[0].weather[0].main;
            }

            getBackgroundImage();
            updateDisplay();
        });
}

function updateDisplay() {
    let now = new Date();
    now.setMinutes(now.getMinutes()+now.getTimezoneOffset() + (placeTimeOffset/60));

    currentNow.innerHTML = weekdaysAbbr[now.getDay()] + ' ' + now.toLocaleString().slice(0, -3) + ' Uhr';
    currentLocation.innerHTML = '<i class="fa-solid fa-location-dot" style="font-size: 80%;"></i> ' + place + ' <span class="locationCountry">(' + placeCountry + ')</span>';
    currentTemperature.innerHTML = currentConditions.temperature.toFixed(1) + '&deg; ' + units;
    currentTemperature.title = currentConditions.temperatureMin.toFixed(1) + ' - ' + currentConditions.temperatureMax.toFixed(1) + String.fromCharCode(176) + ' ' + units + ' - ' + i18n('Gefühlt') + ' ' + currentConditions.feelsLike.toFixed(1) + String.fromCharCode(176) + ' ' + units;
    currentDescription.innerHTML = currentConditions.mainDescription;
    currentFeelsLike.innerHTML = '<span class="i18n" data-i18n-key="Gefühlt">Gefühlt</span> ' + currentConditions.feelsLike.toFixed(1) + '&deg;';
    currentHumidity.innerHTML = '<span class="i18n" data-i18n-key="Luftfeuchtigkeit">Luftfeuchtigkeit</span> ' + currentConditions.humidity + '%';
    currentPop.innerHTML = '<span class="i18n" data-i18n-key="Regenrisiko">Regenrisiko</span> ' + currentConditions.precipitation + '%';
    currentPressure.innerHTML = '<span class="i18n" data-i18n-key="Luftdruck">Luftdruck</span> ' + currentConditions.pressure + ' hPa';
    currentSunrise.innerHTML = '<span class="i18n" data-i18n-key="Sonnenaufgang">Sonnenaufgang</span>: ' + currentConditions.sunrise.toLocaleTimeString().substring(0, 5) + ' Uhr';
    currentSunset.innerHTML = '<span class="i18n" data-i18n-key="Sonnenuntergang">Sonnenuntergang</span>: ' + currentConditions.sunset.toLocaleTimeString().substring(0, 5) + ' Uhr';
    currentIcon.src = 'http://openweathermap.org/img/wn/' + currentConditions.mainIcon + '@4x.png';

    updateForecastDisplay();
    updateTodayDisplay();
    updateMeteorDisplay();
}

function updateForecastDisplay() {
    if (showCommingDays) {
        theNext4Display.style.visibility = 'visible';
        currentForecastDisplay.innerHTML = '';
        console.log(forecastDays);
        forecastDays.forEach(day => {
            let newDay = document.createElement('div');
            newDay.classList.add('forecastDay');
            newDay.id = 'forecast_' + day.dayDateString;

            let newDate = document.createElement('div');
            newDate.classList.add('forecastDate');
            let forecastDay = new Date(day.dayDate);
            console.log(forecastDay);
            newDate.innerHTML = weekdaysAbbr[forecastDay.getDay()] + ' ' + forecastDay.getDate() + '.' + (forecastDay.getMonth()+1) + '.';
            newDay.appendChild(newDate);

            let newNoonIcon = document.createElement('img');
            newNoonIcon.src = 'http://openweathermap.org/img/wn/' + day.noonIcon + '.png';
            newDay.appendChild(newNoonIcon);

            let newEveIcon = document.createElement('img');
            newEveIcon.classList.add('eveIcon');
            newEveIcon.src = 'http://openweathermap.org/img/wn/' + day.eveningIcon + '.png';
            newDay.appendChild(newEveIcon);

            let newTemp = document.createElement('div');
            newTemp.classList.add('forecastTemperature');
            newTemp.innerHTML = day.maxTemperature + '&deg; <span class="minTemp"> / ' + day.minTemperature.toFixed(1) + '&deg;</span>';
            newDay.appendChild(newTemp);

            let newDesc = document.createElement('div');
            newDesc.classList.add('forecastDescription');
            newDesc.textContent = day.dominantDesc;
            newDay.appendChild(newDesc);

            let newRisk = document.createElement('div');
            newRisk.classList.add('forecastRain');
            newRisk.innerHTML = '&empty; Regenrisiko ' + day.avPop + '%';
            newDay.appendChild(newRisk);
            currentForecastDisplay.appendChild(newDay);
        });
    } else {
        theNext4Display.style.visibility = 'hidden';
    }
    
}

function updateTodayDisplay() {
    if (show24Details) {
        theNext24Display.style.visibility = 'visible';
        todayDisplay.innerHTML = '';
        for (let i = 0; i < today.length; i++) {
            let newHour = document.createElement('div');
            newHour.classList.add('todayHour');
            
            let nowTime = new Date(today[i].datetime);
            
            let newHead = document.createElement('div');
            newHead.textContent = nowTime.toLocaleTimeString().substring(0,2)+' Uhr';
            newHead.classList.add('todayTime');
            newHour.appendChild(newHead);
            
            let newIcon = document.createElement('img');
            newIcon.src = 'http://openweathermap.org/img/wn/' + today[i].mainIcon + '.png';
            newHour.appendChild(newIcon);
            
            let newTemp = document.createElement('div');
            newTemp.classList.add('todayTemperature');
            newTemp.innerHTML = today[i].temperature.toFixed(1) + '&deg;';
            newTemp.title = i18n('Gefühlt') + ' ' + today[i].feelsLike.toFixed(1) + ' '+ i18n('Grad');
            newHour.appendChild(newTemp);
            
            let newDesc = document.createElement('div');
            newDesc.classList.add('todayDesc');
            newDesc.innerHTML = today[i].mainDescription;
            newHour.appendChild(newDesc);

            let newPop = document.createElement('div');
            newPop.classList.add('todayPop');
            newPop.innerHTML = '<span class="i18n">Regenrisiko</span> ' + today[i].precipitation + '%';
            newHour.appendChild(newPop);

            todayDisplay.appendChild(newHour);
        }
    } else {
        theNext24Display.style.visibility = 'hidden';
    }
    
}

function updateMeteorDisplay() {    
    if (showMeteors) {
        meteorsDisplay.style.display = 'contents';
        meteorsMessage.innerHTML = '';
        if (dangerous > 0) {
            meteorsMessage.innerHTML = `Heute sind ${meteors.length} Asterioden unterwegs. Davon sind ${dangerous} gefährlich nah.`;
            meteorIcon.style.color = 'red';
        } else {
            meteorsMessage.innerHTML = `Heute sind ${meteors.length} Asterioden unterwegs, keiner davon ist gefährlich.`;
            meteorIcon.style.color = 'rgb(150, 200, 70)';
        }
    } else {
        meteorsDisplay.style.display = 'none';
    }
    
}

function changeBackground() {
    if (useUnsplashBackgrounds) {
        allTainer.style.backgroundImage = "url('"+ backgroundPath +"')";
        let footerText = '';
        if (backgroundImage.imageDescription) {
            if (backgroundImage.imageDescription.length > 60) {
                let dispStr = '';
                let words = backgroundImage.imageDescription.split(' ');
                while (dispStr.length < 60) {
                    dispStr += words.shift() + ' ';
                }
                footerText += '&laquo;' + dispStr + '... &raquo;<br>';
            } else {
                footerText += '&laquo;' + backgroundImage.imageDescription + '&raquo;<br>';
            }
        } else if (backgroundImage.imageAltDescription) {
            if (backgroundImage.imageAltDescription > 60) {
                let dispStr = '';
                let words = backgroundImage.imageAltDescription.split(' ');
                while (dispStr.length < 60) {
                    dispStr += words.shift() + ' ';
                }
                footerText += '&laquo;' + dispStr + '... &raquo;<br>';
            } else {
                footerText += '&laquo;' + backgroundImage.imageAltDescription + '&raquo;<br>';
            }
        }
        footerText += '<a href="' + backgroundImage.imageHTML + '" target="_blank" class="linkNoUnder">Foto</a> von <a href="' + backgroundImage.unsplashLink + '" target="_blank">' + backgroundImage.name + '</a>';
        if (backgroundImage.location) {
            footerText += ' aus ' + backgroundImage.location;
        }
        imageCaption.innerHTML = footerText;
    } else {
        allTainer.style.backgroundImage = "url('./images/" + currentConditions.mainWeather + ".jpg')";
        let footerText = 'Foto von <a href="' + backgroundAuthors.get(currentConditions.mainWeather)['link'] + '" target="_blank">' + backgroundAuthors.get(currentConditions.mainWeather)['name'] + '</a>';
        imageCaption.innerHTML = footerText;
    }   
}

function changeRefreshInterval() {
    clearInterval(refresh);
    if (refreshInterval >= 1) {
        refresh = setInterval(getData, 60000 * refreshInterval);
    }
}

function stopRefresh() {
    clearInterval(refresh);
}

function startRefresh() {
    clearInterval(refresh);
    if (refreshInterval >= 1) {
        refresh = setInterval(getData, 60000 * refreshInterval);
    }    
}

function handlePlayPause() {
    if (backgroundIsRunning) {
        stopRefresh();
        backgroundIsRunning = false;
        imageControls.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
        startRefresh();
        backgroundIsRunning = true;
        imageControls.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
}

function toggleMenu() {
    if (menu.style.visibility === 'hidden') {
        menu.style.visibility = 'visible';
    } else {
        menu.style.visibility = 'hidden';
    }
}

/* Handles ALL events inside the settings menu */
function handleSettingsChange(e) {
    switch (e.target.id) {
        case 'show24':
            show24Details = e.target.checked;
            localStorage.setItem('show24', show24Details.toString());
            updateDisplay();
            break;
        case 'showMap':
            showMap = e.target.checked;
            localStorage.setItem('showMap', showMap.toString());
            updateDisplay();
            break;
        case 'show4':
            showCommingDays = e.target.checked;
            localStorage.setItem('show4', showCommingDays.toString());
            updateDisplay();
            break;
        case 'showMeteors':
            showMeteors = e.target.checked;
            localStorage.setItem('showMeteors', showMeteors.toString());
            updateDisplay();
            break;
        case 'showApod':
            showApod = e.target.checked;
            localStorage.setItem('showApod', showApod.toString());
            updateDisplay();
            break;
        case 'showUnsplashBackground':
            useUnsplashBackgrounds = e.target.checked;

            disabledMechanics();
            localStorage.setItem('showUnsplashBackground', useUnsplashBackgrounds.toString());
            changeBackground();
            break;
        case 'language':
            language = e.target.value;
            localStorage.setItem('language', language);
            i18nTranslateAll();
            break;
        case 'reloadInterval':
            console.log('Interval changed!');
            if (e.target.value === 'manual') {
                stopRefresh();
            } else {
                refreshInterval = Number.parseInt(e.target.value);
                changeRefreshInterval();
            }            
            localStorage.setItem('reloadInterval', refreshInterval.toString());            
            break;
        case 'blackAndWhiteUnsplash':
            onlyBlackAndWhite = e.target.checked;
            localStorage.setItem('blackAndWhiteUnsplash', onlyBlackAndWhite.toString());
            if (onlyBlackAndWhite) {
                document.querySelector('#usePreferredColor').disabled = true;
                document.querySelector('#preferredColor').disabled = true;
            } else {
                document.querySelector('#usePreferredColor').disabled = false;
                document.querySelector('#preferredColor').disabled = false;
            }
            getData();
            break;
        case 'useLocationQuery':
            useLocationQuery = e.target.checked;
            if (useLocationQuery) {
                use5050Checkbox.disabled = false;
                combineLocWeatherCheckbox.disabled = false;
            } else {
                use5050Checkbox.disabled = true;
                combineLocWeatherCheckbox.disabled = true;
            }
            localStorage.setItem('useLocationQuery', useLocationQuery.toString());
            getData();
            break;
        case 'combineLocationWeatherQuery':
            combineLocationWeather = e.target.checked;
            localStorage.setItem('combineLocationWeather', combineLocationWeather.toString());
            if (combineLocationWeather) {
                use5050Checkbox.checked = false;
            }
            getData();
            break;
        case 'useFiftyFiftyQuery':
            use5050Query = e.target.checked;
            localStorage.setItem('useFiftyFiftyQuery', use5050Query.toString());
            if (use5050Query) {
                combineLocWeatherCheckbox.checked = false;
            }
            getData();
            break;
        case 'preferredColor':
            preferredColor = e.target.value;
            localStorage.setItem('preferredColor', preferredColor);
            getData();
            break;
        case 'usePreferredColor':
            usePreferredColor = e.target.checked;
            if (usePreferredColor) {
                prefColorSelect.disabled = false;
                onlyBlackAndWhite = false;
                bwCheckbox.checked = false;
            } else {
                prefColorSelect.disabled = true;
            }
            localStorage.setItem('usePreferredColor', usePreferredColor.toString());
            getData();
            break;
        case 'panelBackground':
            console.log('Farbwert: ' + e.target.value);
            let t = e.target.value.substring(1);
            let r = '0x' + t.substring(0, 2);
            let g = '0x' + t.substring(2, 4);
            let b = '0x' + t.substring(4, 6);
            
            panelBgValues.r = Number(r).toString();
            panelBgValues.g = Number(g).toString();
            panelBgValues.b = Number(b).toString();

            let opVal = document.querySelector('#panelOpacity').value;
            let backString = 'rgba(' + Number(r) + ', ' + Number(g) + ', ' + Number(b) + ', ' + (opVal/100).toFixed(2) + ')';
            panelBgColor = backString;
            updatePanelColors();
            break;
        case 'panelOpacity':
            panelBgValues.a = (e.target.value/100).toFixed(2).toString();
            updatePanelColors();
            break;
        case 'units':
            units = e.target.value;
            console.log("HI from units!");
            console.log(units);
            localStorage.setItem('units', e.target.value);
            getData();
            break;
        case 'fixedLocationSelect':
            fixedLocation = e.target.value;
            localStorage.setItem('fixedLocation', fixedLocation);
            getData();
            break;
        case 'useFixedLocation':
            console.log('HI! (from useFixed!)');
            useFixedLocation = e.target.checked;
            localStorage.setItem('useFixedLocation', useFixedLocation.toString());
            disabledMechanics();
            getData();
            break;
    }
}

function updatePanelColors() {
    let backString = 'rgba(' + panelBgValues.r + ', ' + panelBgValues.g + ', ' + panelBgValues.b + ', ' + panelBgValues.a + ')';
    document.querySelector('#currentWeather').style.backgroundColor = backString;
    document.querySelector('#theNext4').style.backgroundColor = backString;
    document.querySelector('#theNext24').style.backgroundColor = backString;
    panelBgColor = backString;
    localStorage.setItem('panelBGString', panelBgColor);
    localStorage.setItem('panelBgValues', JSON.stringify(panelBgValues)); 
}

function equipListeners() {
    let settings = document.querySelectorAll('.controlledInput');
    settings.forEach(item => item.addEventListener('change', handleSettingsChange));
}

function showInput() {
    let full = document.createElement('div');
    full.id = 'locationInputTainer';

    let locDiv = document.createElement('div');
    locDiv.id = 'inputTainer';
    let locInput = document.createElement('input');
    locInput.type = 'text';
    locInput.placeholder = i18n('Bitte geben Sie einen neuen Ort ein');
    
    locInput.id= 'locationInput';
    locInput.addEventListener('keydown', catchReturn);
    locDiv.appendChild(locInput);

    let locButton = document.createElement('button');
    locButton.type = 'button';
    locButton.id = 'locationBtn';
    locButton.textContent = 'Los!';
    locButton.addEventListener('click', setLocation);
    locDiv.appendChild(locButton);

    full.appendChild(locDiv);

    let locHis = document.createElement('div');
    locHis.id = 'locationHistory';

    let locHisHead = document.createElement('h3');
    locHisHead.textContent = 'Bisherige Orte';
    locHis.appendChild(locHisHead);

    if (locationHistory.size > 0) {
        const sortedLH = new Map([...locationHistory.entries()].sort((a, b) => b[1].count - a[1].count));
        sortedLH.forEach(hisItem => {
            let locItem = document.createElement('div');
            locItem.classList.add('locationHistoryItem');

            let locName = document.createElement('div');
            locName.innerHTML = '<i class="fa-solid fa-location-dot"></i> <span title="Bisher '+ hisItem.count + ' Mal aufgerufen">' + hisItem.name + '</span> (' + hisItem.country + ')';
            locItem.appendChild(locName);

            let locGeo = document.createElement('div');
            locGeo.classList.add('locationItemGeo');
            locGeo.innerHTML = hisItem.lat + ', ' + hisItem.lon;
            locItem.appendChild(locGeo);

            locItem.addEventListener('click', function() {
                document.querySelector('#locationInput').value = hisItem.name;
                setLocation();
            })
            locHis.appendChild(locItem);
        });
    } else {
        locHis.textContent = 'Bisher sind keine anderen Orte verwendet worden.';
    }

    full.appendChild(locHis);

    document.querySelector('#currentWeather').appendChild(full);
    locInput.focus();
}

function catchReturn(e) {
    if (e.key === 'Enter') {
        setLocation();
    }
}

function setLocation() {
    if (document.querySelector('#locationInput').value) {
        place = document.querySelector('#locationInput').value;
        getData();
    }
    document.querySelector('#locationInputTainer').remove();
    console.log('+++ Location History +++');
    console.log(locationHistory);
}

/* Translates a single token into the globally selected language */
function i18n(str) {
    if (language === 'de') {
        return str;
    }
    return i18nTranslations.get(language)[str];
}

/* Translates the whole App */
function i18nTranslateAll() {
    let nodeItems = document.querySelectorAll('[data-i18n-key]');
    nodeItems.forEach(node => {
        let token = node.getAttribute('data-i18n-key');
        node.textContent = i18n(token);
    });
    document.title = i18nTranslations.get(language)['Titel'];
}

/* Initializes the settings inputs AND Local Storage */
function initializeSettings() {
    if (!localStorage.getItem('show24')) {
        populateStorage();
    } else {
        loadStorage();
    }
    
    const sortedLH = new Map([...locationHistory.entries()].sort((a, b) => b[1].count - a[1].count));
    sortedLH.forEach(hisItem => {
        let newOp = document.createElement('option');
        newOp.value = hisItem.name;
        newOp.textContent = hisItem.name;
        document.querySelector('#fixedLocationSelect').appendChild(newOp);    
    });

    document.querySelector('#show24').checked = show24Details;
    document.querySelector('#showMap').checked = showMap;
    document.querySelector('#show4').checked = showCommingDays;
    document.querySelector('#showMeteors').checked = showMeteors;
    document.querySelector('#showApod').checked = showApod;
    document.querySelector('#showUnsplashBackground').checked = useUnsplashBackgrounds;
    document.querySelector('#useLocationQuery').checked = useLocationQuery;
    document.querySelector('#combineLocationWeatherQuery').checked = combineLocationWeather;
    document.querySelector('#useFiftyFiftyQuery').checked = use5050Query;
    document.querySelector('#blackAndWhiteUnsplash').checked = onlyBlackAndWhite;
    document.querySelector('#usePreferredColor').checked = usePreferredColor;
    document.querySelector('#preferredColor').value = preferredColor;
    document.querySelector('#reloadInterval').value = refreshInterval;
    document.querySelector('#language').value = language;
    document.querySelector('#units').value = units;
    document.querySelector('#fixedLocationSelect').value = fixedLocation;
    document.querySelector('#useFixedLocation').checked = useFixedLocation;
    
    /* let colorSelectVal = '#' + Number(panelBgValues.r).toString(16) + Number(panelBgValues.g).toString(16) + Number(panelBgValues.b).toString(16);
    console.log('Wert für ColorSelect ' + colorSelectVal);
    document.querySelector('#panelBackground').value = colorSelectVal;
    updatePanelColors(); */
}

function populateStorage() {
    localStorage.setItem('show24', show24Details.toString());
    localStorage.setItem('showMap', showMap.toString());
    localStorage.setItem('show4', showCommingDays.toString());
    localStorage.setItem('showMeteors', showMeteors.toString());
    localStorage.setItem('showApod', showApod.toString());
    localStorage.setItem('showUnsplashBackground', useUnsplashBackgrounds.toString());
    localStorage.setItem('useLocationQuery', useLocationQuery.toString());
    localStorage.setItem('useFiftyFiftyQuery', use5050Query.toString());
    localStorage.setItem('combineLocationWeather', combineLocationWeather.toString());
    localStorage.setItem('blackAndWhiteUnsplash', onlyBlackAndWhite.toString());
    localStorage.setItem('usePreferredColor', usePreferredColor.toString());
    localStorage.setItem('preferredColor', preferredColor);
    localStorage.setItem('reloadInterval', refreshInterval.toString());
    localStorage.setItem('language', language);
    localStorage.setItem('panelBGString', panelBgColor);
    localStorage.setItem('panelBgValues', JSON.stringify(panelBgValues));
    localStorage.setItem('units', units);
    localStorage.setItem('imageHistory', JSON.stringify(imageHistory));
    localStorage.setItem('locationHistory', JSON.stringify(locationHistory));
    localStorage.setItem('useFixedLocation', useFixedLocation.toString());
    localStorage.setItem('fixedLocation', fixedLocation);
    console.log('LocalStorage has been populated!');
}

function loadStorage() {
    show24Details = localStorage.getItem('show24') === 'true';
    showMap = localStorage.getItem('showMap') === 'true';
    showCommingDays = localStorage.getItem('show4') === 'true';
    showMeteors = localStorage.getItem('showMeteors') === 'true';
    showApod = localStorage.getItem('showApod') === 'true';
    useUnsplashBackgrounds = localStorage.getItem('showUnsplashBackground') === 'true';
    useLocationQuery = localStorage.getItem('useLocationQuery') === 'true';
    combineLocationWeather = localStorage.getItem('combineLocationWeather') === 'true';
    use5050Query = localStorage.getItem('useFiftyFiftyQuery') === 'true';
    onlyBlackAndWhite = localStorage.getItem('blackAndWhiteUnsplash') === 'true';
    usePreferredColor = localStorage.getItem('usePreferredColor') === 'true';
    preferredColor = localStorage.getItem('preferredColor');
    refreshInterval = Number.parseInt(localStorage.getItem('reloadInterval'));
    language = localStorage.getItem('language');
    panelBgColor = localStorage.getItem('panelBGString');
    panelBgValues = JSON.parse(localStorage.getItem('panelBgValues'));
    units = localStorage.getItem('units');
    imageHistory = JSON.parse(localStorage.getItem('imageHistory')) || [];
    locationHistory = new Map(Object.entries(JSON.parse(localStorage.getItem('locationHistory')))) || new Map();
    useFixedLocation = localStorage.getItem('useFixedLocation') === 'true';
    fixedLocation = localStorage.getItem('fixedLocation');
    console.log('LocalStorage has been read!');
}

/* Takes care of the logic of enabled/disabled inputs and labels in relation to selections */
function disabledMechanics() {
    if (usePreferredColor) {
        prefColorSelect.disabled = false;
        onlyBlackAndWhite = false;
        bwCheckbox.checked = false;
    } else {
        prefColorSelect.disabled = true;
    }

    if (use5050Query) {
        combineLocWeatherCheckbox.checked = false;
    }

    if (combineLocationWeather) {
        use5050Checkbox.checked = false;
    }

    if (useLocationQuery) {
        use5050Checkbox.disabled = false;
        combineLocWeatherCheckbox.disabled = false;
    } else {
        use5050Checkbox.disabled = true;
        combineLocWeatherCheckbox.disabled = true;
    }

    if (onlyBlackAndWhite) {
        document.querySelector('#usePreferredColor').disabled = true;
        document.querySelector('#preferredColor').disabled = true;
    } else {
        document.querySelector('#usePreferredColor').disabled = false;
        document.querySelector('#preferredColor').disabled = false;
    }

    if (!useUnsplashBackgrounds) {
        useLocCheckbox.disabled = true;
        combineLocWeatherCheckbox.disabled = true;
        use5050Checkbox.disabled = true;
        bwCheckbox.disabled = true;
        usePrefColorCheckbox.disabled = true;
        prefColorSelect.disabled = true;
        document.querySelector('#reloadInterval').disabled = true;
        document.querySelector('#useFixedLocation').disabled = true;
        document.querySelector('#fixedLocationSelect').disabled = true;

        document.querySelector('#useLocationQueryLabel').classList.add('disabledLabel');
        document.querySelector('#useFixedLocationLabel').classList.add('disabledLabel');
        document.querySelector('#fixedLocationSelectLabel').classList.add('disabledLabel');
        document.querySelector('#combineLocationWeatherQueryLabel').classList.add('disabledLabel');
        document.querySelector('#useFiftyFiftyQueryLabel').classList.add('disabledLabel');
        document.querySelector('#blackAndWhiteUnsplashLabel').classList.add('disabledLabel');
        document.querySelector('#usePreferredColorLabel').classList.add('disabledLabel');
        document.querySelector('#preferredColorLabel').classList.add('disabledLabel');
        document.querySelector('#info5050').classList.add('disabledLabel');
        document.querySelector('#infoPreferred').classList.add('disabledLabel');
    } else {
        useLocCheckbox.disabled = false;
        if (useLocationQuery) {
            use5050Checkbox.disabled = false;
            combineLocWeatherCheckbox.disabled = false;
        }
        bwCheckbox.disabled = false;
        usePrefColorCheckbox.disabled = false;
        prefColorSelect.disabled = false;
        document.querySelector('#reloadInterval').disabled = false;
        document.querySelector('#useFixedLocation').disabled = false;
        document.querySelector('#fixedLocationSelect').disabled = false;

        document.querySelector('#useLocationQueryLabel').classList.remove('disabledLabel');
        document.querySelector('#useFixedLocationLabel').classList.remove('disabledLabel');
        document.querySelector('#fixedLocationSelectLabel').classList.remove('disabledLabel');
        document.querySelector('#combineLocationWeatherQueryLabel').classList.remove('disabledLabel');
        document.querySelector('#useFiftyFiftyQueryLabel').classList.remove('disabledLabel');
        document.querySelector('#blackAndWhiteUnsplashLabel').classList.remove('disabledLabel');
        document.querySelector('#usePreferredColorLabel').classList.remove('disabledLabel');
        document.querySelector('#preferredColorLabel').classList.remove('disabledLabel');
        document.querySelector('#info5050').classList.remove('disabledLabel');
        document.querySelector('#infoPreferred').classList.remove('disabledLabel');
    }

    if (useFixedLocation) {
        document.querySelector('#fixedLocationSelect').disabled = false;
        document.querySelector('#fixedLocationSelectLabel').classList.remove('disabledLabel');
    } else {
        document.querySelector('#fixedLocationSelect').disabled = true;
        document.querySelector('#fixedLocationSelectLabel').classList.add('disabledLabel');
    }
}

function showImageHistory() {
    let imgsBtn = document.querySelector('#imagesBtn').cloneNode(true);
    imgsBtn.id = 'closeImagesBtn';
    imgsBtn.addEventListener('click', closeImageHistory);

    let outerDiv = document.createElement('div');
    outerDiv.id = 'outerImages';

    let imgsHeader = document.createElement('h1');
    imgsHeader.textContent = 'Verlauf Hintergrundbilder';
    outerDiv.appendChild(imgsHeader);

    imgsDiv = document.createElement('div');
    imgsDiv.id = 'images';

    if (imageHistory.length > 0) {
        imageHistory.reverse().forEach(img => {
            let newImgDiv = document.createElement('div');
            newImgDiv.classList.add('imageHistoryItem');
            newImgDiv.addEventListener('click', () => { window.open(img.imageHTML); });
            
            let newImg = new Image();
            newImg.classList.add('imageHistoryItemImage');
            /* newImg.src = img.imageSmall + '&fit=crop&w=' + Number.parseInt(windowWidth/7) + '&h=' + Number.parseInt(windowHeight/7); */
            newImg.src = img.imageFull + '&fit=clip&w=250&h=180';
            
            console.log(newImg.src);
            newImgDiv.appendChild(newImg);

            let newInfo = document.createElement('div');
            newInfo.classList.add('imageHistoryItemInfo');

            let newDesc = document.createElement('div');
            newDesc.classList.add('imageHistoryDescription');
            if (img.imageDescription) {
                newDesc.innerHTML = img.imageDescription.length < 60 ? img.imageDescription : img.imageDescription.substring(0, 60) + '...';
            }

            let newDesc2 = document.createElement('div');
            newDesc2.classList.add('imageHistoryDescription');
            if (img.imageAltDescription) {
                newDesc2.innerHTML = img.imageAltDescription.length < 60 ? img.imageAltDescription : img.imageAltDescription.substring(0, 60) + '...';
            }

            let newAuthorInfo = document.createElement('div');
            newAuthorInfo.classList.add('authorInfo');
            newAuthorInfo.addEventListener('click', () => { window.open(img.unsplashLink); });

            let newAuthorName = document.createElement('div');
            newAuthorName.innerHTML = 'Von <a href="' + img.unsplashLink + '" target="_blank" class="linkNoUnder">' + img.name + '</a>';
            newAuthorName.classList.add('authorName');

            let newAuthorImage = new Image();
            newAuthorImage.src = img.userProfileImage;
            newAuthorImage.classList.add('authorImage');
            
            newAuthorInfo.appendChild(newAuthorName);
            newAuthorInfo.appendChild(newAuthorImage);

            newInfo.appendChild(newAuthorInfo);            
            newInfo.appendChild(newDesc);
            newInfo.appendChild(newDesc2);

            newImgDiv.appendChild(newInfo);
            imgsDiv.appendChild(newImgDiv);
        });
    }
    outerDiv.appendChild(imgsDiv);
    outerDiv.appendChild(imgsBtn);
    allTainer.appendChild(outerDiv);
}

function closeImageHistory() {
    document.querySelector('#outerImages').remove();
}

function calculateAverage(arr) {
    let n = arr.length;
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += arr[i];
    }
    return (sum / n);
}

function calculateMinMax(arr) {
    let min = 1000;
    let max = -1000;

    arr.forEach(num => {
        if (num > max) { max = num; }
        if (num < min) { min = num; }
    });

    return { min: min, max: max };
}

/* Calculates the string with the most repetitions */ 
function getDominantDescription(arr) {
    let descs = new Map();
    arr.forEach(desc => {
        if (!descs.get(desc)) {
            descs.set(desc, 1);
        } else {
            descs.set(desc, descs.get(desc)+1);
        }
    });
    const sortedDescs = new Map([...descs.entries()].sort((a, b) => b[1] - a[1]));
    return Array.from(sortedDescs).shift()[0];
}

/* Returns an ordered list of option nodes for location selects */
function compileLocationOptions() {
    const sortedLH = new Map([...locationHistory.entries()].sort((a, b) => b[1].count - a[1].count));
    let sortedOptions = [];
    sortedLH.forEach(hisItem => {
        let newOp = document.createElement('option');
        newOp.value = hisItem.name;
        newOp.textContent = hisItem.name;
        sortedOptions.push(newOp);    
    });
    return sortedOptions;
}

/* Marks the current weather location as fixed */
function toggleFixedPlace() {

}