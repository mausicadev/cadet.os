if (!window.__cadet_urad_loaded) {
  window.__cadet_urad_loaded = true;

  const thresholds = {
    humidity: { low: 30, high: 70 },
    ch2o: { low: 1, high: 20 },
    voc: { low: 1, high: 500 },
    pm10: { low: 0, high: 40 },
    pm25: { low: 0, high: 40 },
    pm1: { low: 0, high: 40 },
    pressure: { low: 0.90, high: 1.05 },
    noise: { low: 0, high: 70 }
  };

function changeProgressBarColors(color1, color2, progressElement) {
  progressElement.style.background = color1;
  progressElement.querySelector('.progress-bar-fill').style.background = color2;
}

function formatValue(value) {
  return value > 900 ? `${(value / 1000).toFixed(1)}k` : value;
}

function updateProgressBasedOnThreshold(currentValue, min, max, progressElement) {
  const progress = Math.max(0, Math.min(100, ((currentValue - min) / (max - min)) * 100));

  if (currentValue < min || currentValue > max) {
    changeProgressBarColors("rgba(240, 109, 27, 0.7)", "rgb(240, 110, 27)", progressElement);
  } else if (progress < 40) {
    changeProgressBarColors("rgba(73, 255, 255, 0.7)", "rgb(73, 255, 255)", progressElement);
  } else {
    changeProgressBarColors("rgba(73, 255, 255, 0.7)", "rgb(73, 255, 255)", progressElement);
  }
}

function fetchAndUpdateData() {
  fetch('https://api.jsonbin.io/v3/b/id', {
    method: 'GET',
    })
    .then(response => response.ok ? response.json() : Promise.reject('HTTP error'))
    .then(data => {
      //data = data.record;
      
      const deviceInside = data.find(device => device.id === "82000470"); 
      const deviceOutside = data.find(device => device.id === "1100016F");

      if (deviceInside) {
        const lastCO2Inside = deviceInside.last_co2 || 0;
        if (lastCO2Inside > 999 && !startMorphing) {
          addOrangeBackgroundToContainer();
        } else if (lastCO2Inside <= 999 && startMorphing) {
          addBlueBackgroundToContainer();
        }
        const lastTemperatureInside = formatValue(parseFloat(deviceInside.last_temperature).toFixed(1));
        const lastCH2O = formatValue(deviceInside.last_ch2o);
        const lastNoise = Math.round(deviceInside.last_noise);
        const lastHumidity = formatValue(parseFloat(deviceInside.last_humidity).toFixed(1));
        const lastPressure = formatValue((deviceInside.last_pressure / 100).toFixed(2));
        const lastVOC = formatValue(deviceInside.last_voc);
        const lastPM10 = formatValue(deviceInside.last_pm10);
        const lastPM25 = formatValue(deviceInside.last_pm25);
        const lastPM1 = formatValue(deviceInside.last_pm1);

        document.querySelector('.ccontainer .number').textContent = lastCO2Inside;
        document.querySelector('.circle-container-right span[style*="--angle: -26deg;"]').textContent = lastTemperatureInside + " 'C";
        document.querySelector('.rrectangles .grid-info-group:nth-of-type(1) .value').textContent = lastCH2O + "ppm";
        document.querySelector('.rrectangles .grid-info-group:nth-of-type(2) .value').textContent = lastNoise + "db";
        document.querySelector('.rrectangles .grid-info-group:nth-of-type(3) .value').textContent = lastHumidity + "%";
        document.querySelector('.rrectangles .grid-info-group:nth-of-type(4) .value').textContent = lastPressure + " Pa";
        document.querySelector('.lrectangles .grid-info-group:nth-of-type(1) .value').textContent = lastVOC;
        document.querySelector('.lrectangles .grid-info-group:nth-of-type(2) .value').textContent = lastPM10 + "g/m³";
        document.querySelector('.lrectangles .grid-info-group:nth-of-type(3) .value').textContent = lastPM25 + "g/m³";
        document.querySelector('.lrectangles .grid-info-group:nth-of-type(4) .value').textContent = lastPM1 + "g/m³";
      }

      if (deviceOutside) {
        const lastTemperatureOutside = formatValue(parseFloat(deviceOutside.last_temperature).toFixed(1));
        const lastRadiation = formatValue((deviceOutside.last_cpm * deviceOutside.factor).toFixed(2));

        document.querySelector('.circle-container-left span[style*="--angle: 16deg;"]').textContent = lastTemperatureOutside + " 'C";
        document.querySelector('.bottom-banner .rad-info h1').textContent = lastRadiation;
      }
      
      document.querySelectorAll('.grid-info-group').forEach(group => {
        const currentElement = group.querySelector('.data .row:nth-child(1) .value');
        const maxElement = group.querySelector('.data .row:nth-child(2) .value');
        const minElement = group.querySelector('.data .row:nth-child(3) .value');
        const progressElement = group.querySelector('.progress');
        const progressValueLeft = group.querySelector('.progress-value-left');
        const progressValueRight = group.querySelector('.progress-value-right');

        if (currentElement && maxElement && minElement && progressElement) {
          const current = parseFloat(currentElement.textContent.match(/[\d.]+/)[0]);
          const max = parseFloat(maxElement.textContent.match(/[\d.]+/)[0]);
          const min = parseFloat(minElement.textContent.match(/[\d.]+/)[0]);
          const title = group.querySelector('.title').textContent.trim().toLowerCase();

          if (!isNaN(current) && !isNaN(max) && !isNaN(min) && max > min) {
            const progress = ((current - min) / (max - min)) * 100;
            progressElement.style.width = `${progress}%`;
            progressValueLeft.textContent = `${progress.toFixed(1)}%`;

            if (progress < 10 || progress > 90) {
              progressValueRight.textContent = "";
            } else if(progress < 40){
              progressValueRight.textContent = "";
            } else {
              const complementaryProgress = 100 - progress;
              progressValueRight.textContent = `${complementaryProgress.toFixed(1)}%`;
            }

            if (thresholds[title]) {
              updateProgressBasedOnThreshold(current, thresholds[title].low, thresholds[title].high, progressElement);
            }
          } else {
            console.error('Valorile nu sunt valide:', { current, max, min });
          }
        } else {
          console.error('Elemente lipsă în grupul curent:', group);
        }
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}

setInterval(fetchAndUpdateData, 10000);
fetchAndUpdateData();
}
