import React, { useEffect } from "react";
import "../css/body.css";
import "../css/banners.css";
import "../css/rectangles.css";
import "../css/circles.css";

export default function Dashboard({ sensorData = [], launchOverrunActive = false, weatherForecast = [], ppmOverride = null, tasks = [] }) {
  const formatValue = (value, digits = 0, suffix = '') => {
    const number = Number(value);
    if (!Number.isFinite(number)) return `0${suffix}`;
    if (digits > 0) return `${number.toFixed(digits)}${suffix}`;
    if (Math.abs(number) > 999) return `${(number / 1000).toFixed(1)}k${suffix}`;
    return `${Math.round(number)}${suffix}`;
  };

  const toNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  // verificam daca avem ceva date primite de la senzori
  const hasData = Array.isArray(sensorData) && sensorData.length > 0;

  // cautam senzorii de interior si exterior
  const sensorIn = hasData
    ? sensorData.find(device => device.last_co2 != null || device.last_ch2o != null || device.last_voc != null || device.last_humidity != null || device.last_pm25 != null || device.last_noise != null)
    : undefined;
  const sensorOut = hasData
    ? sensorData.find(device => device !== sensorIn && (device.last_cpm != null || device.factor != null))
    : undefined;

  const main = sensorIn || sensorData[0] || {};
  const alt = sensorOut || sensorData.find(device => device !== main) || main || {};

  const co2 = toNumber(main.last_co2 || main.last_co2_raw || 0);
  const ch2o = toNumber(main.last_ch2o || 0);
  const noise = toNumber(main.last_noise || 0);
  const humidity = toNumber(main.last_humidity || 0);
  const pressure = toNumber(main.last_pressure ? main.last_pressure / 100 : 0);
  const voc = toNumber(main.last_voc || 0);
  const pm10 = toNumber(main.last_pm10 || 0);
  const pm25 = toNumber(main.last_pm25 || 0);
  const pm1 = toNumber(main.last_pm1 || 0);
  const tempIn = toNumber(main.last_temperature || 0);
  const tempOut = toNumber(alt.last_temperature || 0);
  const cpm = toNumber(alt.last_cpm || 0);
  const radVal = cpm && alt.factor ? cpm * toNumber(alt.factor) : 0;

  const tempInText = `${formatValue(tempIn, 1)} 'C`;
  const tempOutText = `${formatValue(tempOut, 1)} 'C`;
  const humText = `${formatValue(humidity, 1)}`;
  const noiseText = `${formatValue(noise, 1)} dB`;
  const vocText = `${formatValue(voc)}`;
  const ch2oText = `${formatValue(ch2o)} ppb`;
  const pressText = `${formatValue(pressure, 2)} Pa`;
  const pm1Text = `${formatValue(pm1)} ug/m`;
  const pm25Text = `${formatValue(pm25)} ug/m`;
  const pm10Text = `${formatValue(pm10)} ug/m`;
  const radText = `${formatValue(radVal, 2)} uSv/h`;
  const cpmText = `${formatValue(cpm)} cpm`;
  const detText = alt.detector || main.detector || 'Unknown';
  const cityText = (alt.city || main.city || 'Timişoara').toUpperCase();
  const countryText = (alt.country || main.country || 'RO').toUpperCase();
  const locText = `${cityText}, ${countryText}`;

  const getForecastDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();
  };
  
  const forecastTonightTemp = weatherForecast[1] ? `${Math.round(parseFloat(weatherForecast[1].temp))}'` : "8'";
  const forecastTonightCond = weatherForecast[1] ? weatherForecast[1].condition : "CLEAR";

  const forecastTomorrowDate = getForecastDate(1);
  const forecastTomorrowTemp = weatherForecast[2] ? `${Math.round(parseFloat(weatherForecast[2].temp))}'` : "12'";
  const forecastTomorrowCond = weatherForecast[2] ? weatherForecast[2].condition : "SUNNY";

  const forecastNextName = weatherForecast[3] ? weatherForecast[3].period : "MONDAY";
  const forecastNextDate = getForecastDate(2);
  const forecastNextTemp = weatherForecast[3] ? `${Math.round(parseFloat(weatherForecast[3].temp))}'` : "9'";
  const forecastNextCond = weatherForecast[3] ? weatherForecast[3].condition : "SUNNY";

  useEffect(() => {
    if (Array.isArray(sensorData) && sensorData.length > 0) {
      window.__sensorData = sensorData;
    }
  }, [sensorData]);

  // incarcam dinamic scripturile d3 si fisierele pt cercurile din dashboard
  useEffect(() => {
    const dashboardRoot = document.getElementById('c0');
    if (dashboardRoot?.querySelector('svg')) return;
    if (window.__cadet_scripts_initialised) {
      // Force trigger event if scripts were already initialized to draw the circles
      document.dispatchEvent(new Event('DOMContentLoaded'));
      return;
    }

    const scripts = [
      '/js/plus.js',
      '/js/api/date.js',
      '/js/controller.js',
      ...Array.from({ length: 19 }, (_, index) => `/js/circles/c${index}.js`)
    ];

    let loaded = 0;
    const total = scripts.length;

    const onReady = () => {
      loaded += 1;
      if (loaded !== total) return;

      if (!window.__cadet_domcontent_dispatched) {
        window.__cadet_domcontent_dispatched = true;
        document.dispatchEvent(new Event('DOMContentLoaded'));
      }

      window.__cadet_scripts_initialised = true;
    };

    if (window.__cadet_scripts_loading) {
      return;
    }

    window.__cadet_scripts_loading = true;

    scripts.forEach((src) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        onReady();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = onReady;
      script.onerror = onReady;
      document.head.appendChild(script);
    });

    if (window.SiriWave) {
      const waveContainerLeft = document.getElementById('container-9');
      const waveContainerRight = document.getElementById('container-8');

      if (waveContainerLeft && !waveContainerLeft.querySelector('canvas')) {
        new window.SiriWave({
          style: 'ios9',
          container: waveContainerLeft,
          speed: 0.05,
          amplitude: 0.7
        });
      }

      if (waveContainerRight && !waveContainerRight.querySelector('canvas')) {
        new window.SiriWave({
          style: 'ios9',
          container: waveContainerRight,
          speed: 0.05,
          amplitude: 0.7
        });
      }
    }
  }, []);

  const rightWidgets = [
    {
      id: 'rrectangle1',
      icon: 'https://img.icons8.com/ios/100/gas-industry.png',
      title: 'CH2O',
      current: `${formatValue(ch2o)}ppm`,
      max: '20ppm',
      min: '0.0ppm',
      progress: `${Math.min(100, Math.max(0, (ch2o / 20) * 100)).toFixed(1)}%`
    },
    {
      id: 'rrectangle2',
      icon: 'https://img.icons8.com/ios-glyphs/30/audio-wave--v1.png',
      title: 'NOISE',
      current: `${formatValue(noise)}db`,
      max: '90db',
      min: '20db',
      progress: `${Math.min(100, Math.max(0, ((noise - 20) / 70) * 100)).toFixed(1)}%`
    },
    {
      id: 'rrectangle3',
      icon: 'https://img.icons8.com/ios/100/hygrometer.png',
      title: 'HUMIDITY',
      current: `${formatValue(humidity, 1)}%`,
      max: '100%',
      min: '0%',
      progress: `${Math.min(100, Math.max(0, humidity)).toFixed(1)}%`
    },
    {
      id: 'rrectangle4',
      icon: 'https://img.icons8.com/ios/100/atmospheric-pressure.png',
      title: 'PRESSURE',
      current: `${formatValue(pressure, 2)} Pa`,
      max: '1.05k Pa',
      min: '0.90k Pa',
      progress: `${Math.min(100, Math.max(0, ((pressure - 0.9) / 0.2) * 100)).toFixed(1)}%`
    }
  ];

  const leftWidgets = [
    {
      id: 'lrectangle1',
      icon: 'https://img.icons8.com/ios/50/greenhouse-effect.png',
      title: 'VOC',
      current: `${formatValue(voc)}`,
      max: '500k',
      min: '1k',
      progress: `${Math.min(100, Math.max(0, (voc / 500000) * 100)).toFixed(1)}%`
    },
    {
      id: 'lrectangle2',
      icon: 'https://img.icons8.com/ios/50/particles.png',
      title: 'PM10',
      current: `${formatValue(pm10)}g/m³`,
      max: '100 g/m',
      min: '0 g/m',
      progress: `${Math.min(100, Math.max(0, (pm10 / 100) * 100)).toFixed(1)}%`
    },
    {
      id: 'lrectangle3',
      icon: 'https://img.icons8.com/ios/50/particulate-matter-10.png',
      title: 'PM2.5',
      current: `${formatValue(pm25)}g/m³`,
      max: '100 g/m',
      min: '0 g/m',
      progress: `${Math.min(100, Math.max(0, (pm25 / 100) * 100)).toFixed(1)}%`
    },
    {
      id: 'lrectangle4',
      icon: 'https://img.icons8.com/ios/50/microorganisms.png',
      title: 'PM1',
      current: `${formatValue(pm1)}g/m³`,
      max: '100 g/m',
      min: '0 g/m',
      progress: `${Math.min(100, Math.max(0, (pm1 / 100) * 100)).toFixed(1)}%`
    }
  ];

  return (
    <>

    <div className="container"></div>

    <div className="dashboard-center-scale">
      <div className="ccontainer">
        <div className="center-container">
          <div className="overlay-text">
            <div className="main">
              <span className="number">
                {ppmOverride !== null ? ppmOverride : formatValue(co2)}
              </span>
              <span className="unit">ppm</span>
            </div>
          </div>
        </div>
        <div id="c0"></div>
        <div id="c1"></div>
        <div id="c2"></div>
        <div id="c3"></div>
        <div id="c4"></div>
        <div id="c5"></div>
        <div id="c6"></div>
        <div id="c7"></div>
        <div id="c8"></div>
        <div id="c9"></div>
        <div id="c10"></div>
        <div id="c11"></div>
        <div id="c12"></div>
        <div id="c13"></div>
        <div id="c14"></div>
        <div id="c15"></div>
        <div id="c16"></div>
        <div id="c17"></div>
        <div id="c18"></div>
      </div>

      <div className="circle-container-right">
        <div className="text-wrap-right">
          <span className="orange-text" style={{ "--angle": "-35deg" }}>PENTAGON</span>
          <span style={{ "--angle": "-32deg" }}>BUNKER TEMP</span>
          <span style={{ "--angle": "-26deg", fontSize: "2.2rem" }}>{hasData ? tempInText : "15 'C"}</span>

          <span style={{ "--angle": "-18deg", fontSize: "0.65rem" }}>{`HUMIDITY: ${hasData ? humText : "74"}`}</span>
          <span style={{ "--angle": "-15.5deg", fontSize: "0.65rem" }}>{`FEELS LIKE: ${hasData ? `${formatValue(tempIn - 2, 1)} 'C` : "13 'C"}`}</span>
          <span style={{ "--angle": "-13deg", fontSize: "0.65rem" }}>PRECIPITATION: 0 </span>
          <span style={{ "--angle": "-10.5deg", fontSize: "0.65rem" }}>WIND: 28 KMH</span>
          <span style={{ "--angle": "-8deg", fontSize: "0.65rem" }}>{`PRESSURE: ${hasData ? pressText : "760 MMHG"}`}</span>
          <span style={{ "--angle": "-5.5deg", fontSize: "0.65rem" }}>SUNRISE: 06:18</span>
          <span style={{ "--angle": "-3deg", fontSize: "0.65rem" }}>SUNSET: 21:50</span>

          <span className="orange-text" style={{ "--angle": "2deg", fontSize: "0.75rem" }}>TONIGHT</span>
          <span style={{ "--angle": "5deg", fontSize: "0.7rem" }}>{forecastTonightTemp}</span>
          <span style={{ "--angle": "7.5deg", fontSize: "0.7rem" }}>{forecastTonightCond}</span>

          <span className="orange-text" style={{ "--angle": "10.5deg", fontSize: "0.75rem" }}>TOMORROW</span>
          <span style={{ "--angle": "13.5deg", fontSize: "0.65rem" }}>{forecastTomorrowDate}</span>
          <span style={{ "--angle": "16deg", fontSize: "0.7rem" }}>{forecastTomorrowTemp}</span>
          <span style={{ "--angle": "18.5deg", fontSize: "0.7rem" }}>{forecastTomorrowCond}</span>

          <span className="orange-text"style={{ "--angle": "21.5deg", fontSize: "0.75rem", color: "rgb(252, 104, 6)" }}>{forecastNextName}</span>
          <span style={{ "--angle": "24.5deg", fontSize: "0.65rem" }}>{forecastNextDate}</span>
          <span style={{ "--angle": "27deg", fontSize: "0.7rem" }}>{forecastNextTemp}</span>
          <span style={{ "--angle": "29.5deg", fontSize: "0.7rem" }}>{forecastNextCond}</span>
        </div>
      </div>

      <div className="circle-container-left">
        <div className="text-wrap-left">
          <span className="orange-text" style={{ "--angle": "25deg" }}
            >{hasData && (alt.city || main.city) ? `${(alt.city || main.city).toUpperCase()}, ${(alt.country || main.country || 'RO').toUpperCase()}` : "TIMISOARA, RO"}</span
          >
          <span style={{ "--angle": "22deg" }}>OUTSIDE TEMP</span>
          <span style={{ "--angle": "16deg", fontSize: "2.2rem" }}>{hasData ? tempOutText : "6 'C"}</span>

          <span className="orange-text" style={{ "--angle": "9deg", fontSize: "0.75rem" }}>SWEET BLAST</span>
          <span style={{ "--angle": "5deg", fontSize: "0.7rem" }}>SWEET PROPULSION</span>
          <span style={{ "--angle": "1deg", fontSize: "0.7rem" }}>STATUS: STANDBY</span>
          <span style={{ "--angle": "-3deg", fontSize: "0.7rem", color: "rgb(252, 104, 6)" }}>RUN "launch" CMD</span>
        </div>
      </div>
    </div>

    <div className="rrectangles">
      {rightWidgets.map((widget) => (
        <div className="grid-info-group" key={widget.id}>
          <div className="grid-info-pair">
            <div className="rrectangle" id={widget.id}>
              <img src={widget.icon} alt={widget.title} className="icon" />
            </div>
            <div className="right-square">
              <div className="title">{widget.title}</div>
              <div className="data">
                <div className="row">
                  <span className="label">CURRENT</span>
                  <span className="value">{widget.current}</span>
                </div>
                <div className="row">
                  <span className="label">MAX</span>
                  <span className="value">{widget.max}</span>
                </div>
                <div className="row">
                  <span className="label">MIN</span>
                  <span className="value">{widget.min}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: widget.progress }}>
              <span className="progress-value-left">{widget.progress}</span>
              <span className="progress-value-right"></span>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="lrectangles">
      {leftWidgets.map((widget) => (
        <div className="grid-info-group" key={widget.id}>
          <div className="grid-info-pair">
            <div className="lrectangle" id={widget.id}>
              <img src={widget.icon} alt={widget.title} className="icon" />
            </div>
            <div className="right-square">
              <div className="title">{widget.title}</div>
              <div className="data">
                <div className="row">
                  <span className="label">CURRENT</span>
                  <span className="value">{widget.current}</span>
                </div>
                <div className="row">
                  <span className="label">MAX</span>
                  <span className="value">{widget.max}</span>
                </div>
                <div className="row">
                  <span className="label">MIN</span>
                  <span className="value">{widget.min}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: widget.progress }}>
              <span className="progress-value-left">{widget.progress}</span>
              <span className="progress-value-right"></span>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="top-banner">
      <img src="assets/svg/banner.svg" alt="Top Banner Shape" className="svg-top" />
      <div className="date-info">
        <div className="month-year">
          <h1 id="month"></h1>
          <h3 id="year"></h3>
        </div>
        <div className="day">
          <h2 id="day"></h2>
        </div>
      </div>

      <div className="right-text">
        <p>TASK FOR TODAY</p>
        {tasks.slice(0, 5).map(task => (
          <p key={task.id} style={{ textDecoration: task.done ? 'line-through' : 'none', opacity: task.done ? 0.5 : 1 }}>
            {task.text}
          </p>
        ))}
        {tasks.length > 5 && <p>...</p>}
      </div>
    </div>

    <div className="bottom-banner">
      <img
        src="assets/svg/banner.svg"
        alt="Bottom Banner Shape"
        className="svg-bottom"
      />
      <div className="side-by-side-wrapper">
        <div id="container-9"></div>
        <div id="container-8"></div>
      </div>
      <img
        src="https://img.icons8.com/ios-filled/100/nuclear.png"
        alt="nuclear"
        className="rad"
      />
      <div className="rad-info">
        <div>
          <h3>uSv/h</h3>
          <h1>{hasData ? formatValue(radVal, 2) : "0.56"}</h1>
        </div>
      </div>
    </div>

    </>
  );
}
