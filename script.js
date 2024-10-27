import Queue from "./Queue.js";
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
    pin.addEventListener("click", (e) => {
      console.log(e);
      console.log(e.target.firstChild);

      pinClicked(pin.id);
    });
  });
  document.querySelector("#solve-btn").addEventListener("click", autoSolve);
  document.querySelector("#reset-btn").addEventListener("click", resetGame);

  createRings();
  updateDisplay();
}

function moveRing(ring, targetPin) {
  // Save the initial X and Y coordinates since it will be lost on update
  const startRect = ring.getBoundingClientRect();
  // Update the display to change the ring's position
  updateDisplay();

  // Now the ring that has just moved will be the firstChild of the targetpin
  const targetRing = targetPin.firstChild;
  const endRect = targetRing.getBoundingClientRect();

  // We can then take the difference between the initial position and the new one
  const deltaX = startRect.left - endRect.left;
  const deltaY = startRect.top - endRect.top;

  targetRing.style.transition = "none";
  targetRing.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  // Force a reflow to apply the initial transform
  targetRing.getBoundingClientRect();

  // Apply the transition and move the targetRing to the target position
  targetRing.style.transition = "transform 0.5s ease";
  targetRing.style.transform = "translate(-50%, 0)";

  targetRing.addEventListener("transitionend", function onTransitionEnd() {
    targetRing.style.transition = "";
    targetRing.style.transform = "";
    targetRing.removeEventListener("transitionend", onTransitionEnd);
  });
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
  const selectedPin = document.querySelector(`#${pinName}`);
  // console.log("selected pin:", selectedPin);

  const firstRing = selectedPin.firstElementChild;
  firstRing.classList.toggle("selected");
}

let selected = null;
function pinClicked(pinId) {
  // console.log("pin clicked, event:", pinId);

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
      const selectedPin = document.querySelector(`#${pinId}`);
      const selectedRing = document.querySelector(".selected");
      movesCounter++;
      moveRing(selectedRing, selectedPin);
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
  for (const pin in pins) {
    while (pins[pin].pop());
  }
  if (solutionTimer) {
    clearTimeout(solutionTimer);
  }
  selected = null;
  movesCounter = 0;
  createRings();
  updateDisplay();
  solutionQueue = new Queue();
}

function autoSolve() {
  console.log("solving towers!");

  resetGame();

  recursiveSolver(RING_AMOUNT, "pin1", "pin3", "pin2");
  // recursiveSolver(RING_AMOUNT, pins["pin1"], pins["pin3"], pins["pin2"]);

  showSolution();
}

function recursiveSolver(rings, src, dest, aux) {
  if (rings == 1) {
    solutionQueue.enqueue(src);
    solutionQueue.enqueue(dest);
    return;
  } else {
    recursiveSolver(rings - 1, src, aux, dest);
    solutionQueue.enqueue(src);
    solutionQueue.enqueue(dest);
    recursiveSolver(rings - 1, aux, dest, src);
  }
  updateDisplay();
}
// function recursiveSolver(rings, src, dest, aux) {
//   if (rings == 1) {
//     const ring = src.pop();
//     dest.push(ring.data);
//     console.log(`Move ring 1 from ${src} to ${dest}`);
//     updateDisplay();
//     movesCounter++;
//     return;
//   } else {
//     recursiveSolver(rings - 1, src, aux, dest);
//     console.log(`Move ring ${rings} from ${src} to ${dest}`);
//     const ring = src.pop();
//     dest.push(ring.data);
//     movesCounter++;
//     updateDisplay();
//     recursiveSolver(rings - 1, aux, dest, src);
//   }
//   updateDisplay();
// }

let solutionQueue = new Queue();
let solutionTimer;
function showSolution() {
  if (solutionQueue.peek()) {
    // console.log(solutionQueue.peek());

    pinClicked(solutionQueue.dequeue().data);
    solutionTimer = setTimeout(showSolution, 500);
  }
}
