import React, { useEffect } from "react";
import "../css/body.css";
import "../css/banners.css";
import "../css/rectangles.css";
import "../css/circles.css";

export default function Dashboard() {
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
      '/js/api/urad.js',
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

    scriptSrcs.forEach(src => {
      // Skip if a script tag with same src already exists on the page
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        // Consider it loaded to avoid blocking
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
      // Clean up scripts we added to avoid duplication on StrictMode re-mounts
      scriptElements.forEach(s => s && s.parentNode && s.parentNode.removeChild(s));
    };
  }, []);

  // Widget definitions to avoid copy/paste duplicates
  const rightWidgets = [
    {
      id: 'rrectangle1',
      icon: 'https://img.icons8.com/ios/100/gas-industry.png',
      title: 'CH2O',
      current: '9ppm',
      max: '20ppm',
      min: '0.0ppm',
      progress: '39.3%'
    },
    {
      id: 'rrectangle2',
      icon: 'https://img.icons8.com/ios-glyphs/30/audio-wave--v1.png',
      title: 'NOISE',
      current: '34db',
      max: '90db',
      min: '20db',
      progress: '72.7%'
    },
    {
      id: 'rrectangle3',
      icon: 'https://img.icons8.com/ios/100/hygrometer.png',
      title: 'HUMIDITY',
      current: '71.5%',
      max: '100%',
      min: '0.0%',
      progress: '73.1%'
    },
    {
      id: 'rrectangle4',
      icon: 'https://img.icons8.com/ios/100/atmospheric-pressure.png',
      title: 'PRESSURE',
      current: "1.0k Pa",
      max: '1.1k Pa',
      min: '0.9k Pa',
      progress: '53.4%'
    }
  ];

  const leftWidgets = [
    {
      id: 'lrectangle1',
      icon: 'https://img.icons8.com/ios/50/greenhouse-effect.png',
      title: 'VOC',
      current: '176k',
      max: '300k',
      min: '10k',
      progress: '45.1%'
    },
    {
      id: 'lrectangle2',
      icon: 'https://img.icons8.com/ios/50/particles.png',
      title: 'PM10',
      current: '22 g/m²',
      max: '100 g/m²',
      min: '0.0 g/m²',
      progress: '32.8%'
    },
    {
      id: 'lrectangle3',
      icon: 'https://img.icons8.com/ios/50/particulate-matter-10.png',
      title: 'PM2.5',
      current: '20 g/m²',
      max: '100 g/m²',
      min: '0.0 g/m²',
      progress: '87.9%'
    },
    {
      id: 'lrectangle4',
      icon: 'https://img.icons8.com/ios/50/microorganisms.png',
      title: 'PM1',
      current: '16 g/m²',
      max: '100.0 g/m²',
      min: '0.0 g/m²',
      progress: '13.4%'
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
            <span className="number">199</span>
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
          <h1>0.56</h1>
        </div>
      </div>
    </div>

    <div className="circle-container-right">
      <div className="text-wrap-right">
        <span style={{ "--angle": "-35deg", color: "rgb(252, 104, 6)" }}>PENTAGON</span>
        <span style={{ "--angle": "-32deg" }}>BUNKER TEMP</span>
        <span style={{ "--angle": "-26deg", fontSize: "2.2rem" }}>15 'C</span>

        <span style={{ "--angle": "-18deg", fontSize: "0.65rem" }}>Humidity: 74x</span>
        <span style={{ "--angle": "-15.5deg", fontSize: "0.65rem" }}
          >Feels Like: 13C</span
        >
        <span style={{ "--angle": "-13deg", fontSize: "0.65rem" }}
          >Precipitation: 0x</span
        >
        <span style={{ "--angle": "-10.5deg", fontSize: "0.65rem" }}>Wind: 20 KMH</span>
        <span style={{ "--angle": "-8deg", fontSize: "0.65rem" }}
          >Pressure: 760 MMHG</span
        >
        <span style={{ "--angle": "-5.5deg", fontSize: "0.65rem" }}>Sunrise: 06:10</span>
        <span style={{ "--angle": "-3deg", fontSize: "0.65rem" }}>Sunset: 18:58</span>

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
          >TIMISOARA, RO</span
        >
        <span style={{ "--angle": "22deg" }}>OUTSIDE TEMP</span>
        <span style={{ "--angle": "16deg", fontSize: "2.2rem" }}>6 'C</span>

        <span style={{ "--angle": "9deg", fontSize: "0.75rem", color: "rgb(252, 104, 6)" }}
          >PASSIONS</span
        >
        <span style={{ "--angle": "5.5deg", fontSize: "0.65rem" }}>CAR LOVER</span>
        <span style={{ "--angle": "3deg", fontSize: "0.65rem" }}>PC BUILDER</span>
        <span style={{ "--angle": "0.5deg", fontSize: "0.65rem" }}>GAMER</span>
        <span style={{ "--angle": "-2deg", fontSize: "0.65rem" }}>BUNKER BUILDER</span>
        <span style={{ "--angle": "-4.5deg", fontSize: "0.65rem" }}>BIKE LOVER</span>
        <span style={{ "--angle": "-7deg", fontSize: "0.65rem" }}>ENGINEER?</span>
      </div>
    </div>

    
  
    </>
  );
}
