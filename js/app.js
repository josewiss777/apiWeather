//Register variables and selectors
const form = document.querySelector('#form')
const divAlert = document.querySelector('.container__alert')
const btnWeather = document.querySelector('.container__btnWeather')
const showContainer = document.querySelector('#showContainer')
const showResult = document.querySelector('#showResult')
const bgcontainer = document.querySelector('.bgcontainer')


const infoResult = document.querySelector('.result__info')
const flexResult = document.querySelector('.result__flex')
const resultPhoto = document.querySelector('.result__photo')
const btnReset = document.querySelector('#btnReset')

//Register events
form.addEventListener('submit', showWeather);
btnReset.addEventListener('click', () => {
  location.reload();
})

//Register functions
function showWeather(e) {
  e.preventDefault()
  const country = document.querySelector('#country').value;
  const city = document.querySelector('#city').value;
  if(city === '' || country === '') {
    showError('Todos los campos son obligatorios')
    return;
  }
  btnWeather.disabled = true
  spinner()
  setTimeout(() => {
    const spinner = document.querySelector('.sk-cube-grid')
    spinner.remove()
    consultApi(city, country)
  }, 1500)
}

function consultApi( city, country ) {
  const idApi = 'd578e5f9f928f06a8d6daf2d3a695538'
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${idApi}`;
  fetch(url)
  .then( response => response.json())
  .then( data => {
    if( data.cod === "404") {
      showError('Esta ciudad no existe o no pertenece al país seleccionado')
      setTimeout(() => {
        form.reset()
        btnWeather.disabled = false;
      }, 2000)
      return;
    } 
    dataCountry(data)
  })
}

function dataCountry(data) {
  const { sys:{ country }} = data;
  switch (country){
    case 'CO':
      countrySelect = 'Colombia'
      addImages(data, countrySelect, country.toLowerCase( ));
      break;
    case 'AR':
      countrySelect = 'Argentina'
      addImages(data, countrySelect, country.toLowerCase( ));
      break;
    case 'ES':
      countrySelect = 'España'
      addImages(data, countrySelect, country.toLowerCase( ));
      break;
    case 'US':
      countrySelect = 'Estados Unidos'
      addImages(data, countrySelect, country.toLowerCase( ));
      break;
    case 'MX':
      countrySelect = 'México'
      addImages(data, countrySelect, country.toLowerCase( ));
      break;
    case 'PE':
      countrySelect = 'Perú'
      addImages(data, countrySelect, country.toLowerCase( ));
      break;
  }
}

function addImages(data, countrySelect, country ) {
  imagesArray = [];
  for ( let i = 1; i < 4; i++ ) {
    const img = document.createElement('img')
    img.alt = `Paisajes de ${countrySelect}`
    img.src = `../img/${country}/${country}${i}.webp`
    imagesArray.push(img)
  }    
  showHTML(data, imagesArray, countrySelect);
}

function showHTML(data, imagesArray, countrySelect) {
  const { name, main:{ temp, temp_min, temp_max } } = data;

  showContainer.classList.add('none')
  bgcontainer.classList.remove('none')
  showResult.classList.add('result')

  document.querySelector('.result__info p').innerHTML = `🌡️${kelvinCentigrade(temp)} &#8451 <span>Temperatura actual en ${name} - ${countrySelect}</span>`
  document.querySelector('.result__flex p:nth-child(1)').innerHTML = `🌡️${kelvinCentigradeMin(temp_min)} &#8451 <span>Temperatura mínima</span>`
  document.querySelector('.result__flex p:nth-child(2)').innerHTML = `🌡️${kelvinCentigradeMax(temp_max)} &#8451 <span>Temperatura máxima</span>`

  document.querySelector('.result__photo h2').textContent = `Bienvenid@ a ${countrySelect}`

  imagesArray.forEach( e => {
    const div = document.createElement('div')
    div.classList.add('swiper-slide')
    div.appendChild(e)
    document.querySelector('.swiper-wrapper').appendChild(div)
  });

  const swiper = new Swiper('.swiper', {
    createElements: true,
    effect: 'cube',
    autoplay: {
      delay: 5000
    },
    loop: true,
    pagination: true,
    grabCursor: true,
  })

  if ( kelvinCentigrade(temp) <= 18) {
    document.querySelector('.result__photo p').textContent = 'Hace frío, no olvides llevar abrigo  🥶'
  } else if ( kelvinCentigrade(temp) >= 19 && kelvinCentigrade(temp) <= 26 ) {
    document.querySelector('.result__photo p').textContent = 'Que buen clima !'
  } else if ( kelvinCentigrade(temp) >= 27) {
    document.querySelector('.result__photo p').textContent = 'Hace calor, no olvides usar bloqueador 🥵'
  }
}

//Support functions
const kelvinCentigrade = temp => parseInt( temp - 273.15 )
const kelvinCentigradeMin = temp_min => parseInt( temp_min - 273.15 )
const kelvinCentigradeMax = temp_max => parseInt( temp_max - 273.15 )

function showError(mensaje) {
  const alert = document.querySelector('.alert')
  if(!alert) {
    const paragraphAlert = document.createElement('p')
    paragraphAlert.textContent = mensaje;
    paragraphAlert.classList.add('alert')
    divAlert.appendChild(paragraphAlert)
    setTimeout(() => {
      paragraphAlert.remove()
    }, 2000)
  }
}

function spinner() {
  const divSpinner = document.createElement('div')
  divSpinner.classList.add('sk-cube-grid')
  const fragment = document.createDocumentFragment( )
  for( let i=1; i < 10; i++ ) {
    const div = document.createElement('div')
    div.classList.add('sk-cube', `sk-cube${i}`)
    fragment.appendChild(div)
  }
  divSpinner.appendChild(fragment)
  showContainer.insertBefore( divSpinner, showContainer.children[1] )
}