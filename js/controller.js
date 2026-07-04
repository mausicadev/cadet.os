let currentBackground = null;

function setBlueBackgroundOnRefresh() {
  const container = document.querySelector(".container");
  if (container) {
    if (currentBackground) {
      currentBackground.style.opacity = "0";
      setTimeout(() => {
        currentBackground.remove();
        createNewBackground("blue");
        changeTextColorToBlue();
      }, 1000);
    } else {
      createNewBackground("blue");
      changeTextColorToBlue();
    }
  }
}

function addOrangeBackgroundToContainer() {
  if (!startMorphing && !isInFastSpin) {
    startMorphing = true;
    isInFastSpin = true;
    isIdleRotationActive = false;
    requestAnimationFrame(animate);
    fastSpin();

    const container = document.querySelector(".container");
    if (container) {
      if (currentBackground) {
        currentBackground.style.opacity = "0";
        setTimeout(() => {
          currentBackground.remove();
          createNewBackground("orange");
          changeTextColorToOrange();
        }, 1000);
      } else {
        createNewBackground("orange");
        changeTextColorToOrange();
      }
    }
  }
}

function addBlueBackgroundToContainer() {
  if (startMorphing) {
    smoothTransitionBackToIdle(); 
  }
  if (currentBackground) {
      currentBackground.style.opacity = "0";
      setTimeout(() => {
          currentBackground.remove();
          createNewBackground("blue");
          changeTextColorToBlue();
      }, 1000);
  } else {
      createNewBackground("blue");
      changeTextColorToBlue();
  }
}

function createNewBackground(color) {
  const container = document.querySelector(".container");
  const afterElement = document.createElement("div");
  afterElement.style.position = "absolute";
  afterElement.style.top = "0";
  afterElement.style.left = "0";
  afterElement.style.right = "0";
  afterElement.style.bottom = "0";

  if (color === "orange") {
    afterElement.style.background =
      "radial-gradient(circle, rgba(252, 104, 6, 0.6) 0%, transparent 60%)";
    afterElement.style.maskImage = "radial-gradient(circle, transparent 0%, black 20%)";
  } else if (color === "blue") {
    afterElement.style.background =
      "radial-gradient(circle, rgba(0, 255, 225, 0.25) 0%, transparent 70%)";
  }

  afterElement.style.opacity = "0";
  afterElement.style.transition = "background 1s ease-in-out, mask-image 1s ease-in-out, opacity 1s ease-in-out";

  container.appendChild(afterElement);
  currentBackground = afterElement;
  setTimeout(() => {
    afterElement.style.opacity = "1";
  }, 60);
}

function changeTextColorToOrange() {
  const overlayTextElements = document.querySelectorAll(".overlay-text");
  overlayTextElements.forEach((element) => {
    element.style.transition = "color 1s ease-in-out, text-shadow 1s ease-in-out";
    element.style.color = "#FC6806";
    element.style.textShadow = "0 0 10px rgba(252, 104, 6, 1)";
  });
}

function changeTextColorToBlue() {
  const overlayTextElements = document.querySelectorAll(".overlay-text");
  overlayTextElements.forEach((element) => {
    element.style.transition = "color 1s ease-in-out, text-shadow 1s ease-in-out";
    element.style.color = "#68fff0";
    element.style.textShadow = "0 0 1px rgba(104, 255, 240, 1)";
  });
}

function changeProgressBarColors(newBarColor, newProgressColor, progressElement) {
  progressElement.style.transition = "background-color 0.5s ease-in-out";
  progressElement.style.backgroundColor = newProgressColor;
  const progressBarElement = progressElement.closest('.progress-bar');
  progressBarElement.style.transition = "background-color 0.5s ease-in-out";
  progressBarElement.style.backgroundColor = newBarColor;
}

document.addEventListener("DOMContentLoaded", setBlueBackgroundOnRefresh);
