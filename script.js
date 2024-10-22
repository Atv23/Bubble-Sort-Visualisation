let initialPositions = [];
let initialOrder = [];
let startTime, endTime;

function generateArray() {
  var size = parseInt(prompt("Enter size of the array (max 20):"));
  if (size > 20 || size < 0 || isNaN(size)) {
    alert("Please enter a valid size between 0 and 20.");
    return;
  }

  var container = document.getElementById("array");
  container.innerHTML = "";

  for (var i = 0; i < size; i++) {
    var value = parseInt(prompt(`Enter value for index ${i + 1} (0-20):`));
    value = Math.min(Math.max(value || 0, 0), 20);

    var block = document.createElement("div");
    block.classList.add("block");
    block.style.height = `${value * 20}px`;
    block.style.transform = `translateX(${i * 30}px)`;

    var blockLabel = document.createElement("label");
    blockLabel.classList.add("block_id");
    blockLabel.innerText = value;

    block.appendChild(blockLabel);
    container.appendChild(block);
  }

  initialPositions = Array.from(document.querySelectorAll(".block")).map(
    (block, index) => ({ block: block, position: index * 30 })
  );
  initialOrder = [...document.querySelectorAll(".block")];

  // Reset the timer when a new array is generated
  document.getElementById("timeElapsed").innerText = 0;
}

async function bubbleSort() {
  var blocks = document.querySelectorAll(".block");
  for (var i = 0; i < blocks.length; i++) {
    for (var j = 0; j < blocks.length - i - 1; j++) {
      blocks[j].style.backgroundColor = "#FF4949";
      blocks[j + 1].style.backgroundColor = "#FF4949";

      await new Promise((resolve) => setTimeout(resolve, 2000));

      var value1 = Number(blocks[j].childNodes[0].innerText);
      var value2 = Number(blocks[j + 1].childNodes[0].innerText);

      if (value1 > value2) {
        await swapBlocks(blocks[j], blocks[j + 1]);
        blocks = document.querySelectorAll(".block");
      }

      blocks[j].style.backgroundColor = "#6b5b95";
    }
    blocks[blocks.length - i - 1].style.backgroundColor = "#13CE66";
  }
}

async function selectionSort() {
  var blocks = document.querySelectorAll(".block");
  for (var i = 0; i < blocks.length; i++) {
    var minIndex = i;
    blocks[i].style.backgroundColor = "#FF4949";
    for (var j = i + 1; j < blocks.length; j++) {
      blocks[j].style.backgroundColor = "#FF4949";

      await new Promise((resolve) => setTimeout(resolve, 2000));

      var value1 = Number(blocks[minIndex].childNodes[0].innerText);
      var value2 = Number(blocks[j].childNodes[0].innerText);

      if (value2 < value1) {
        if (minIndex !== i) {
          blocks[minIndex].style.backgroundColor = "#6b5b95";
        }
        minIndex = j;
      } else {
        blocks[j].style.backgroundColor = "#6b5b95";
      }
    }

    if (minIndex !== i) {
      await swapBlocks(blocks[i], blocks[minIndex]);
      blocks = document.querySelectorAll(".block");
    }
    blocks[minIndex].style.backgroundColor = "#6b5b95";
    blocks[i].style.backgroundColor = "#13CE66";
  }
}

async function swapBlocks(block1, block2) {
  var parent = block1.parentNode;
  var nextSibling = block2.nextElementSibling;
  parent.insertBefore(block2, block1);
  parent.insertBefore(block1, nextSibling);

  var blocks = document.querySelectorAll(".block");
  blocks.forEach((block, index) => {
    block.style.transform = `translateX(${index * 30}px)`;
  });
}

function startSorting() {
  var algorithm = document.getElementById("sortingAlgorithm").value;
  startTime = new Date().getTime();

  if (algorithm === "bubbleSort") {
    bubbleSort().then(() => endSorting(algorithm));
  } else if (algorithm === "selectionSort") {
    selectionSort().then(() => endSorting(algorithm));
  }
}

function endSorting(algorithm) {
  endTime = new Date().getTime();
  var timeTaken = ((endTime - startTime) / 1000).toFixed(2);
  document.getElementById("timeElapsed").innerText = timeTaken;

  // Update comparison
  var comparison = document.getElementById("comparison");
  comparison.innerHTML = `${algorithm === "bubbleSort" ? "Bubble" : "Selection"} Sort took ${timeTaken} seconds.`;
}

function undoSort() {
  var container = document.getElementById("array");
  container.innerHTML = "";
  initialOrder.forEach((block, index) => {
    block.style.transform = `translateX(${initialPositions[index].position}px)`;
    block.style.backgroundColor = "#6b5b95";
    container.appendChild(block);
  });

  // Reset timer after resetting the array
  document.getElementById("timeElapsed").innerText = 0;
}
