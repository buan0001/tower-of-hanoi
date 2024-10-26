import Stack from "./Stack.js";

window.addEventListener("load", start);

const RING_AMOUNT = 3;
let moves_used = 0;
const pins = { pin1: new Stack(), pin2: new Stack(), pin3: new Stack() };
// const pin1 = new Stack();
// const pin2 = new Stack();
// const pin3 = new Stack();

function start() {
  const pins = document.querySelectorAll(".pin");

  pins.forEach((pin) => {
    pin.addEventListener("click", () => pinClicked(pin.id));
  });
  document.querySelector("#solve-btn").addEventListener("click", solveTowers);

  createRings();
  updateDisplay();
}

function createRings() {
  for (let index = 0; index < RING_AMOUNT; index++) {
    pins.pin1.push(RING_AMOUNT - index);
    // console.log(pins.pin1.size());
  }
}

function updateDisplay() {
  document.querySelector("#moves-display").innerHTML = moves_used;
  for (const pin in pins) {
    const firstPin = document.querySelector(`#${pin}`);

    firstPin.innerHTML = "";
    // console.log(pin);
    let nextNode = pins[pin].peek(); // pins[pin]
    let hiddenRings = pins[pin].size() - 1;
    while (nextNode) {
      const element = document.createElement("div");
      element.classList.add("ring");
      element.style.setProperty("--RING_WIDTH", nextNode.data * 28 + "px");
      // element.style.setProperty("--RING_BOTTOM", (hiddenRings - nextNode.data) * 30 + "px");
      element.style.setProperty("--RING_BOTTOM", hiddenRings-- * 30 + "px");
      firstPin.insertAdjacentElement("beforeend", element);

      nextNode = nextNode.next;
    }

    // const amountOfRings = pins[pin].size();
    // for (let index = 0; index < amountOfRings; index++) {
    //   const element = document.createElement("div");

    //   element.classList.add("ring");
    //   element.style.setProperty("--RING_WIDTH", (index + 1) * 27 + "px");
    //   element.style.setProperty("--RING_BOTTOM", (amountOfRings - index - 1) * 30 + "px");

    //   firstPin.insertAdjacentElement("beforeend", element);
    //   console.log("Element:", element);
    // }
  }
}

function toggleSelectedDisplay(pinName) {
  const firstPin = document.querySelector(`#${pinName}`);
  const firstRing = firstPin.firstElementChild;
  firstRing.classList.toggle("selected");
}

let selected = null;
function pinClicked(pinId) {
  console.log("pin clicked, event:", pinId);

  if (selected) {
    const newStack = pins[pinId];
    if (newStack == selected) {
      toggleSelectedDisplay(pinId);
      selected = null;
      return;
    }
    const ringToMove = selected.peek();
    if (ringToMove?.data < newStack.peek()?.data || newStack.peek() == null) {
      const movingRing = selected.pop();
      newStack.push(movingRing.data);
      moves_used++;
      updateDisplay();
      selected = null;
      if (newStack == pins["pin3"] && newStack.size() == RING_AMOUNT) {
        console.log("you win!");
      }
    }
  } else {
    selected = pins[pinId];
    toggleSelectedDisplay(pinId);
  }
}


// TODO: Make solver

function solveTowers(){
  console.log("solving towers!");
  
}