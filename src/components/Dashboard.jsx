import React, { useEffect } from "react";
import "../css/body.css";
import "../css/banners.css";
import "../css/rectangles.css";
import "../css/circles.css";

export default function Dashboard({ sensorData = [] }) {
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

  const hasSensorData = Array.isArray(sensorData) && sensorData.length > 0;

  const insideSensor = hasSensorData
    ? sensorData.find(device => device.last_co2 != null || device.last_ch2o != null || device.last_voc != null || device.last_humidity != null || device.last_pm25 != null || device.last_noise != null)
    : undefined;
  const outsideSensor = hasSensorData
    ? sensorData.find(device => device !== insideSensor && (device.last_cpm != null || device.factor != null))
    : undefined;

  const primarySensor = insideSensor || sensorData[0] || {};
  const secondarySensor = outsideSensor || sensorData.find(device => device !== primarySensor) || primarySensor || {};

  const co2Value = toNumber(primarySensor.last_co2 || primarySensor.last_co2_raw || 0);
  const ch2oValue = toNumber(primarySensor.last_ch2o || 0);
  const noiseValue = toNumber(primarySensor.last_noise || 0);
  const humidityValue = toNumber(primarySensor.last_humidity || 0);
  const pressureValue = toNumber(primarySensor.last_pressure ? primarySensor.last_pressure / 100 : 0);
  const vocValue = toNumber(primarySensor.last_voc || 0);
  const pm10Value = toNumber(primarySensor.last_pm10 || 0);
  const pm25Value = toNumber(primarySensor.last_pm25 || 0);
  const pm1Value = toNumber(primarySensor.last_pm1 || 0);
  const temperatureInsideValue = toNumber(primarySensor.last_temperature || 0);
  const temperatureOutsideValue = toNumber(secondarySensor.last_temperature || 0);
  const cpmValue = toNumber(secondarySensor.last_cpm || 0);
  const radiationValue = cpmValue && secondarySensor.factor ? cpmValue * toNumber(secondarySensor.factor) : 0;

  const insideTemperatureText = `${formatValue(temperatureInsideValue, 1)} 'C`;
  const outsideTemperatureText = `${formatValue(temperatureOutsideValue, 1)} 'C`;
  const humidityText = `${formatValue(humidityValue, 1)}%`;
  const noiseText = `${formatValue(noiseValue, 1)} dB`;
  const vocText = `${formatValue(vocValue)}`;
  const ch2oText = `${formatValue(ch2oValue)} ppb`;
  const pressureText = `${formatValue(pressureValue, 2)} Pa`;
  const pm1Text = `${formatValue(pm1Value)} µg/m³`;
  const pm25Text = `${formatValue(pm25Value)} µg/m³`;
  const pm10Text = `${formatValue(pm10Value)} µg/m³`;
  const radiationText = `${formatValue(radiationValue, 2)} uSv/h`;
  const cpmText = `${formatValue(cpmValue)} cpm`;
  const detectorText = secondarySensor.detector || primarySensor.detector || 'Unknown';
  const cityText = (secondarySensor.city || primarySensor.city || 'Timişoara').toUpperCase();
  const countryText = (secondarySensor.country || primarySensor.country || 'RO').toUpperCase();
  const locationText = `${cityText}, ${countryText}`;

  useEffect(() => {
    if (Array.isArray(sensorData) && sensorData.length > 0) {
      window.__sensorData = sensorData;
    }
  }, [sensorData]);

  useEffect(() => {
    // Guard: don't re-initialize if circles already drawn (React Strict Mode)
    const c0 = document.getElementById('c0');
    if (c0 && c0.querySelector('svg')) return;
    // Prevent duplicate initialization across hot-reloads or multiple mounts
    if (window.__cadet_scripts_initialised) return;

    // All vanilla JS scripts that depend on React-rendered DOM elements.
    // They use document.addEventListener("DOMContentLoaded", ...) internally,
    // so we load them dynamically AFTER React has mounted, then dispatch
    // the event to trigger their initialization.
    const scriptSrcs = [
      '/js/plus.js',
      '/js/api/date.js',
      '/js/controller.js',
      ...Array.from({ length: 19 }, (_, i) => `/js/circles/c${i}.js`),
    ];

    let loaded = 0;
    const total = scriptSrcs.length;
    const scriptElements = [];

    const onScriptReady = () => {
      loaded++;
      if (loaded === total) {
        // All scripts loaded and registered their DOMContentLoaded listeners.
        // Only dispatch DOMContentLoaded once per page lifecycle.
        if (!window.__cadet_domcontent_dispatched) {
          window.__cadet_domcontent_dispatched = true;
          document.dispatchEvent(new Event('DOMContentLoaded'));
        }
        // Mark scripts as initialised so re-mounts won't re-add them.
        window.__cadet_scripts_initialised = true;
      }
    };

    if (window.__cadet_scripts_initialised) {
      return;
    }

    if (window.__cadet_scripts_loading) {
      return;
    }

    window.__cadet_scripts_loading = true;

    scriptSrcs.forEach(src => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        onScriptReady();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = false; // preserve execution order
      script.onload = onScriptReady;
      script.onerror = onScriptReady; // Don't block on missing scripts
      document.head.appendChild(script);
      scriptElements.push(script);
    });

    // SiriWave initialization (library is loaded globally via index.html)
    if (window.SiriWave) {
      const c9El = document.getElementById("container-9");
      const c8El = document.getElementById("container-8");
      if (c9El && !c9El.querySelector('canvas')) {
        new window.SiriWave({
          style: "ios9",
          container: c9El,
          speed: 0.05,
          amplitude: 0.7,
        });
      }
      if (c8El && !c8El.querySelector('canvas')) {
        new window.SiriWave({
          style: "ios9",
          container: c8El,
          speed: 0.05,
          amplitude: 0.7,
        });
      }
    }
    return () => {
      // Keep injected scripts in the DOM to avoid duplicate global declarations
      // during React StrictMode mount/unmount cycles.
    };
  }, []);

  // Widget definitions rendered from fetched sensor data.
  const rightWidgets = [
    {
      id: 'rrectangle1',
      icon: 'https://img.icons8.com/ios/100/gas-industry.png',
      title: 'CH2O',
      current: `${formatValue(ch2oValue)}ppm`,
      max: '20ppm',
      min: '0.0ppm',
      progress: `${Math.min(100, Math.max(0, (ch2oValue / 20) * 100)).toFixed(1)}%`
    },
    {
      id: 'rrectangle2',
      icon: 'https://img.icons8.com/ios-glyphs/30/audio-wave--v1.png',
      title: 'NOISE',
      current: `${formatValue(noiseValue)}db`,
      max: '90db',
      min: '20db',
      progress: `${Math.min(100, Math.max(0, ((noiseValue - 20) / 70) * 100)).toFixed(1)}%`
    },
    {
      id: 'rrectangle3',
      icon: 'https://img.icons8.com/ios/100/hygrometer.png',
      title: 'HUMIDITY',
      current: `${formatValue(humidityValue, 1)}%`,
      max: '100%',
      min: '0%',
      progress: `${Math.min(100, Math.max(0, humidityValue)).toFixed(1)}%`
    },
    {
      id: 'rrectangle4',
      icon: 'https://img.icons8.com/ios/100/atmospheric-pressure.png',
      title: 'PRESSURE',
      current: `${formatValue(pressureValue, 2)} Pa`,
      max: '1.05k Pa',
      min: '0.90k Pa',
      progress: `${Math.min(100, Math.max(0, ((pressureValue - 0.9) / 0.2) * 100)).toFixed(1)}%`
    }
  ];

  const leftWidgets = [
    {
      id: 'lrectangle1',
      icon: 'https://img.icons8.com/ios/50/greenhouse-effect.png',
      title: 'VOC',
      current: `${formatValue(vocValue)}`,
      max: '500k',
      min: '1k',
      progress: `${Math.min(100, Math.max(0, (vocValue / 500000) * 100)).toFixed(1)}%`
    },
    {
      id: 'lrectangle2',
      icon: 'https://img.icons8.com/ios/50/particles.png',
      title: 'PM10',
      current: `${formatValue(pm10Value)}g/m³`,
      max: '100 g/m³',
      min: '0 g/m³',
      progress: `${Math.min(100, Math.max(0, (pm10Value / 100) * 100)).toFixed(1)}%`
    },
    {
      id: 'lrectangle3',
      icon: 'https://img.icons8.com/ios/50/particulate-matter-10.png',
      title: 'PM2.5',
      current: `${formatValue(pm25Value)}g/m³`,
      max: '100 g/m³',
      min: '0 g/m³',
      progress: `${Math.min(100, Math.max(0, (pm25Value / 100) * 100)).toFixed(1)}%`
    },
    {
      id: 'lrectangle4',
      icon: 'https://img.icons8.com/ios/50/microorganisms.png',
      title: 'PM1',
      current: `${formatValue(pm1Value)}g/m³`,
      max: '100 g/m³',
      min: '0 g/m³',
      progress: `${Math.min(100, Math.max(0, (pm1Value / 100) * 100)).toFixed(1)}%`
    }
  ];

  return (
    <>

    {/* Background */}
    <div className="container"></div>

    {/* Middle Section */}
    {/* ORANGE = rgb(252, 104, 6) */}
    {/* CYAN = rgb(252, 104, 6) */}

    <div className="ccontainer">
      <div className="center-container">
        <div className="overlay-text">
          <div className="main">
            <span className="number">{formatValue(co2Value)}</span>
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

    {/* Rectangles and Info Section */}
    <div className="rrectangles">
      {rightWidgets.map(w => (
        <div className="grid-info-group" key={w.id}>
          <div className="grid-info-pair">
            <div className="rrectangle" id={w.id}>
              <img src={w.icon} alt={w.title} className="icon" />
            </div>
            <div className="right-square">
              <div className="title">{w.title}</div>
              <div className="data">
                <div className="row">
                  <span className="label">CURRENT</span>
                  <span className="value">{w.current}</span>
                </div>
                <div className="row">
                  <span className="label">MAX</span>
                  <span className="value">{w.max}</span>
                </div>
                <div className="row">
                  <span className="label">MIN</span>
                  <span className="value">{w.min}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress">
              <span className="progress-value-left">{w.progress}</span>
              <span className="progress-value-right"></span>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="lrectangles">
      {leftWidgets.map(w => (
        <div className="grid-info-group" key={w.id}>
          <div className="grid-info-pair">
            <div className="lrectangle" id={w.id}>
              <img src={w.icon} alt={w.title} className="icon" />
            </div>
            <div className="right-square">
              <div className="title">{w.title}</div>
              <div className="data">
                <div className="row">
                  <span className="label">CURRENT</span>
                  <span className="value">{w.current}</span>
                </div>
                <div className="row">
                  <span className="label">MAX</span>
                  <span className="value">{w.max}</span>
                </div>
                <div className="row">
                  <span className="label">MIN</span>
                  <span className="value">{w.min}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress">
              <span className="progress-value-left">{w.progress}</span>
              <span className="progress-value-right"></span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Top Banner */}
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
        <p>FINISH THE PENTAGON</p>
        <p>BUILD ANOTHER PC</p>
        <p>INSTALL WINDOWS</p>
        <p>REVIEW THE DRONE</p>
        <p>POST THE VIDEO</p>
      </div>
    </div>

    {/* Bottom Banner */}
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
          <h1>{hasSensorData ? formatValue(radiationValue, 2) : "0.56"}</h1>
        </div>
      </div>
    </div>

    <div className="circle-container-right">
      <div className="text-wrap-right">
        <span style={{ "--angle": "-35deg", color: "rgb(252, 104, 6)" }}>PENTAGON</span>
        <span style={{ "--angle": "-32deg" }}>BUNKER TEMP</span>
        <span style={{ "--angle": "-26deg", fontSize: "2.2rem" }}>{hasSensorData ? insideTemperatureText : "15 'C"}</span>

        <span style={{ "--angle": "-18deg", fontSize: "0.65rem" }}>{hasSensorData ? `Humidity: ${humidityText}` : "Humidity: 74%"}</span>
        <span style={{ "--angle": "-15.5deg", fontSize: "0.65rem" }}
          >{hasSensorData ? `Feels Like: ${formatValue(temperatureInsideValue - 2, 1)} 'C` : "Feels Like: 13C"}</span
        >
        <span style={{ "--angle": "-13deg", fontSize: "0.65rem" }}
          >{hasSensorData ? `CH2O: ${ch2oText}` : "CH2O: 0 ppb"}</span
        >
        <span style={{ "--angle": "-10.5deg", fontSize: "0.65rem" }}>{hasSensorData ? `Noise: ${noiseText}` : "Noise: 20 dB"}</span>
        <span style={{ "--angle": "-8deg", fontSize: "0.65rem" }}
          >{hasSensorData ? `Pressure: ${pressureText}` : "Pressure: 760 MMHG"}</span
        >
        <span style={{ "--angle": "-5.5deg", fontSize: "0.65rem" }}>{hasSensorData ? `PM2.5: ${pm25Text}` : "PM2.5: 0 µg/m³"}</span>
        <span style={{ "--angle": "-3deg", fontSize: "0.65rem" }}>{hasSensorData ? `PM1: ${pm1Text}` : "PM1: 0 µg/m³"}</span>

        <span style={{ "--angle": "2deg", fontSize: "0.75rem", color: "rgb(252, 104, 6)" }}
          >TONIGHT</span
        >
        <span style={{ "--angle": "5deg", fontSize: "0.7rem" }}>8'</span>
        <span style={{ "--angle": "7.5deg", fontSize: "0.7rem" }}>CLEAR</span>

        <span
          style={{ "--angle": "10.5deg", fontSize: "0.75rem", color: "rgb(252, 104, 6)" }}
          >TOMORROW</span
        >
        <span style={{ "--angle": "13.5deg", fontSize: "0.7rem" }}>JANUARY 4 2025</span>
        <span style={{ "--angle": "16deg", fontSize: "0.7rem" }}>12'</span>
        <span style={{ "--angle": "18.5deg", fontSize: "0.7rem" }}>SUNNY</span>

        <span
          style={{ "--angle": "21.5deg", fontSize: "0.75rem", color: "rgb(252, 104, 6)" }}
          >MONDAY</span
        >
        <span style={{ "--angle": "24.5deg", fontSize: "0.7rem" }}>JANUARY 5 2025</span>
        <span style={{ "--angle": "27deg", fontSize: "0.7rem" }}>9'</span>
        <span style={{ "--angle": "29.5deg", fontSize: "0.7rem" }}>SUNNY</span>
      </div>
    </div>

    <div className="circle-container-left">
      <div className="text-wrap-left">
        <span style={{ "--angle": "25deg", color: "rgb(252, 104, 6)" }}
          >{hasSensorData && (secondarySensor.city || primarySensor.city) ? `${(secondarySensor.city || primarySensor.city).toUpperCase()}, ${(secondarySensor.country || primarySensor.country || 'RO').toUpperCase()}` : "TIMISOARA, RO"}</span
        >
        <span style={{ "--angle": "22deg" }}>OUTSIDE TEMP</span>
        <span style={{ "--angle": "16deg", fontSize: "2.2rem" }}>{hasSensorData ? outsideTemperatureText : "6 'C"}</span>

        <span style={{ "--angle": "9deg", fontSize: "0.75rem", color: "rgb(252, 104, 6)" }}
          >RADIATION</span
        >
        <span style={{ "--angle": "5.5deg", fontSize: "0.65rem" }}>{hasSensorData ? radiationText : "0.56 uSv/h"}</span>
        <span style={{ "--angle": "3deg", fontSize: "0.65rem" }}>{hasSensorData ? `CPM: ${cpmText}` : "CPM: 0"}</span>
        <span style={{ "--angle": "0.5deg", fontSize: "0.65rem" }}>{hasSensorData ? `Detector: ${detectorText}` : "Detector: SBM20"}</span>
        <span style={{ "--angle": "-2deg", fontSize: "0.65rem" }}>{hasSensorData ? `Location: ${locationText}` : "TIMISOARA, RO"}</span>
        <span style={{ "--angle": "-4.5deg", fontSize: "0.65rem" }}>PM1: {hasSensorData ? pm1Text : '0 µg/m³'}</span>
        <span style={{ "--angle": "-7deg", fontSize: "0.65rem" }}>PM2.5: {hasSensorData ? pm25Text : '0 µg/m³'}</span>
      </div>
    </div>

    
  
    </>
  );
}
