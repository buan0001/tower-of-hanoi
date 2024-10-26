window.addEventListener("load", start);

function start() {
  console.log("Js is running");
  const nodes = document.querySelectorAll(".ring");
  nodes.forEach((node, index) => {
    const heightVal = index+1*20 + "px"
    console.log("Heigh val:",heightVal);
    
    node.style.setProperty("--RING_HEIGHT", heightVal);
  });

  const btn = document.querySelector("#btn")
  btn.addEventListener("click", test)

  // const node = document.querySelector("#test")
  // const node = document.querySelector(".ring.large")

  // node.style.setProperty("--RING_HEIGHT", "40px")
}

function test(e) {
    const pin1 = document.querySelector("#pin1")
    const pin2 = document.querySelector("#pin2")
    const node = document.querySelector("#test")
    pin2.appendChild(node)
}