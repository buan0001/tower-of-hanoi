window.addEventListener("load", start);

const RING_AMOUNT = 5;

function start() {
  const nodes = document.querySelectorAll(".ring");
  const pins = document.querySelectorAll(".pin");

  pins.forEach((pin) => {
    pin.addEventListener("click", pinClicked);
  });
  console.log("nodes length", nodes.length);

  nodes.forEach((node, index) => {
    const widthVal = (index + 1) * 50 + "px";
    // const widthVal = (index+1)*20 + "px"
    const bottomVal = (nodes.length - index - 1) * 30 + "px";
    console.log("Heigh val:", widthVal);
    node.style.setProperty("--RING_WIDTH", widthVal);
    node.style.setProperty("--RING_BOTTOM", bottomVal);
  });

  createRings()
}

function createRings() {
  const firstPin = document.querySelector("#pin1");

  for (let index = 0; index < 5; index++) {
    const element = document.createElement("div");

    element.classList.add("ring")
    element.dataset.value = index
    element.style.setProperty("--RING_WIDTH", (index + 1) * 50 + "px");
    element.style.setProperty("--RING_BOTTOM", (RING_AMOUNT - index - 1) * 30 + "px");

    
    firstPin.insertAdjacentElement("beforeend", element)
    console.log("Element:",element);
  }
}

let selected = null;
function pinClicked(e) {
  console.log("pin clicked, event:", e);
  const pin = e.target;
  if (selected) {
    pin.appendChild(selected);
    selected.classList.remove("selected");
    updateRingPositions(pin);
    selected = null;
  } else {
    const topRing = pin.firstElementChild;
    const ringSize = topRing.dataset.value;
    console.log("Ring size:", ringSize);

    if (topRing) {
      topRing.classList.add("selected");
      selected = topRing;
    }
  }
}

function updateRingPositions(pin) {
  const rings = pin.querySelectorAll(".ring");
  rings.forEach((ring, index) => {
    const bottomVal = index * 30 + "px";
    ring.style.setProperty("--RING_BOTTOM", bottomVal);
  });
}
