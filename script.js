import Stack from "./Stack.js";

window.addEventListener("load", start);

const RING_AMOUNT = 8;
let movesCounter = 0;
const pins = { pin1: new Stack("from"), pin2: new Stack("via"), pin3: new Stack("to") };
// const pin1 = new Stack();
// const pin2 = new Stack();
// const pin3 = new Stack();

function start() {
  const pins = document.querySelectorAll(".pin");

  pins.forEach((pin) => {
    pin.addEventListener("click", () => pinClicked(pin.id));
  });
  document.querySelector("#solve-btn").addEventListener("click", autoSolve);
  document.querySelector("#reset-btn").addEventListener("click", resetGame);

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
  document.querySelector("#moves-display").innerHTML = movesCounter;
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
      movesCounter++;
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

function resetGame() {
  console.log("reset clicked");

  for (const pin in pins) {
    while (pins[pin].pop());
  }

  movesCounter = 0;
  createRings();
  updateDisplay();
}

function autoSolve() {
  console.log("solving towers!");

    if (pins["pin1"].size() !== RING_AMOUNT) {
      resetGame()
    }
  recursiveSolver(RING_AMOUNT, pins["pin1"], pins["pin3"], pins["pin2"]);
}

//                             pin1, pin3, pin2
function recursiveSolver(rings, src, dest, aux) {
  if (rings == 1) {
    const ring = src.pop();
    dest.push(ring.data);
    console.log(`Move ring 1 from ${src} to ${dest}`);
    updateDisplay();
    movesCounter++;
    return;
  } else {
    recursiveSolver(rings - 1, src, aux, dest);
    console.log(`Move ring ${rings} from ${src} to ${dest}`);
    const ring = src.pop();
    dest.push(ring.data);
    movesCounter++;
    updateDisplay();
    recursiveSolver(rings - 1, aux, dest, src);
  }
  updateDisplay();
}

// const ring = src.pop();
// dest.push(ring.data);

// const nextRing = src.pop();
// aux.push(nextRing.data);

// const nextNext = dest.pop();
// aux.push(nextNext.data);

// const ringagain = src.pop();
// dest.push(ringagain.data);

// const ring1 = aux.pop();
// src.push(ring1.data);

// const ring2 = aux.pop();
// dest.push(ring2.data);

// const ring1again = src.pop();
// dest.push(ring1again.data);
// updateDisplay();
