//CAMERA
let camera = document.querySelector("a-camera");

const tutorialWall = document.querySelector("#tutorialWall");
const tutorialMsgInicial = document.querySelector("#tutorialInicial");
const tutorialMsgMiddle = document.querySelector("#tutorialMiddle");
const tutorialMsgFinal = document.querySelector("#tutorialFinal");

//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//LVL1

/**
 * @class Grabbable objects inherit this class.
 * They need to be put in an array and looped through for the moving logic
 */
class grabbableObject {
  constructor(domElement, target = null) {
    this.domElement = document.querySelector(domElement);

    this.grabState = false;

    this.deposited = false;

    this.target = target;

    this.position = this.domElement.getAttribute("position");

    this.domElement.addEventListener("mousedown", () => {
      this.grabState = true;
    });

    this.domElement.addEventListener("mouseup", () => {
      this.grabState = false;
    });
  }
}

// LIST OF OBJECTS ADDED TO THE BOXES (IF THE TOTAL EQUALS THE AMOUNT NEEDED THAN YOU FINISH THE LEVEL)
let completed = [];

//FIRST LEVEL OBJECTS
let toyRecipient = document.querySelector("#toyRecipient");
//TOYS  ---> Need to be created in html <---
let toyCube = new grabbableObject("#toyCube");

let toyCube2 = new grabbableObject("#toyCube2");

let toyCube3 = new grabbableObject("#toyCube3");

let toycube4 = new grabbableObject("#toyCube4");

let toyCube5 = new grabbableObject("#toyCube5");

let toyCube6 = new grabbableObject("#toyCube6");

//TOYS ARRAY
let grabbableToysArray = [
  toyCube,
  toyCube2,
  toyCube3,
  toycube4,
  toyCube5,
  toyCube6,
];

//STARTING DOOR
let startingDoor = document.querySelector("#portaInicial");

let door1 = document.querySelector("#portaAvancar");

let doorFinal = document.querySelector("#portaAvancar2");

let room1Song = document.querySelector("#happySongPlay");

let room2Song = document.querySelector("#horrorSongPlay");

let wolf = document.querySelector("#wolf");

let cricket = document.querySelector("#cricket");

// Test to remove items from the inventory
deleteInventory = () => {
  // Clear the inventory array and update the inventory display
  completed = [];
  document.querySelector("#inventory").textContent = "Inventory: Empty";
};

const Room1 = () => {
  //TOYS LOGIC (GRABBING AND MOVING)
  grabbableToysArray.forEach((obj) => {
    if (!obj.deposited)
      if (obj.grabState) {
        // if object wasnt deposited
        // if object is being grabbed

        // Get the camera's position and rotation
        let cameraPos = camera.getAttribute("position");
        let cameraRot = camera.getAttribute("rotation");

        // Calculate the position of the object in front of the camera
        let x = cameraPos.x - Math.sin((cameraRot.y / 180) * Math.PI) * 3;
        let y = 1;
        let z = cameraPos.z - Math.cos((cameraRot.y / 180) * Math.PI) * 3;

        obj.domElement.setAttribute("position", { x: x, y: y, z: z });
        obj.domElement.setAttribute("rotation", { x: 0, y: cameraRot.y, z: 0 });

        //If it collides with the recipient it will enter a state where it can not move no more
        if (isColliding(obj.domElement, toyRecipient)) {
          let inventory = document.querySelector("#inventory");
          obj.deposited = true;
          obj.domElement.setAttribute("position", { x: 0, y: 100, z: 0 });
          obj.domElement.setAttribute("rotation", { x: 0, y: 0, z: 0 });

          completed.push(obj.domElement.id);
          inventory.textContent = `Inventory: ${completed.join(", ")}`;

          // PLAY SOUND IF OBJECT IS ADDED TO THE BOX
          toyRecipient.components.sound.playSound();

          if (completed.length == grabbableToysArray.length) {
            const successAudio = new Audio("Sounds/Success.mp3");
            successAudio.play();
          }
        }
      }
  });
};

//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//LVL2

class ClickableObject {
  constructor(domElement) {
    this.domElement = domElement;

    this.itemName = this.domElement.id;

    this.clicked = false;

    this.sound = this.domElement.getAttribute("sound");

    this.domElement.addEventListener("click", () => {
      if (!this.clicked) {
        domElement.setAttribute("position", "0 -100 0");
        this.clicked = true;
        currentCatchedItems++;
        console.log("sound attribute value:", this.sound);
        this.domElement.components.sound.playSound();
        if (maxItems - currentCatchedItems != 0) {
          HotColdMeter.textContent =
            "Good! Items missing:" + String(maxItems - currentCatchedItems);
        } else {
          HotColdMeter.textContent = "Well done! Every item was found";
        }
      }
    });
  }
}

class ProximityPanel {
  constructor(domElement) {
    this.domElement = domElement;

    this.proximityLevel = this.domElement.getAttribute("proximityLevel");

    this.item = this.domElement.getAttribute("item");
  }
}

//-----ITEMS INITIALIZATION---------
let ClickableItems = [...document.querySelector("#ClickableItems").children];

let ClickableItemsArray = [];
ClickableItems.forEach((item) => {
  ClickableItemsArray.push(new ClickableObject(item));
});

//-----PANELS INITIALIZATION---------
let Panels = [...document.querySelector("#panels").children];

let ProximityPanelsArray = [];

Panels.forEach((panel) => {
  ProximityPanelsArray.push(new ProximityPanel(panel));
});

//---End Condition Variables--
const maxItems = ClickableItemsArray.length;
let currentCatchedItems = 0;

//Indicator
const HotColdMeter = document.querySelector("#HotColdMeter");

let Room2 = () => {
  ClickableItemsArray.forEach((Item) => {
    ProximityPanelsArray.forEach((Panel) => {
      if (!Item.clicked && Panel.item == Item.itemName) {
        if (isColliding(Panel.domElement, camera)) {
          HotColdMeter.textContent = Panel.proximityLevel;
        }
      }
    });
  });

  //End condition
  if (maxItems == currentCatchedItems) {
  }
};

//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------

//START
window.onload = () => {
  loop();
};

//GAME LOGIC
loop = () => {
  Room1();

  Room2();

  window.requestAnimationFrame(loop);
};

portaInicial.addEventListener("click", () => {
  portaInicial.components.sound.playSound();
  room1Song.components.sound.playSound();
});

portaAvancar.addEventListener("click", () => {
  if (completed.length == grabbableToysArray.length) {
    portaAvancar.components.sound.playSound();
    portaAvancar.setAttribute("rotation", "0 90 0");
    portaAvancar.setAttribute("position", "0.750 1.75 17.764");
    room1Song.components.sound.pause();
    room2Song.components.sound.playSound();
    wolf.components.sound.playSound();
    cricket.components.sound.playSound();

    setTimeout(() => {
      deleteInventory();
    }, 1500);
  } else {
    const errorAudio = new Audio("Sounds/Error.mp3");
    errorAudio.play();
    console.log("time got removed");
  }
});

portaAvancar2.addEventListener("click", () => {
  portaAvancar2.components.sound.playSound();
});

const isColliding = (obj1, obj2) => {
  let bbox1 = new THREE.Box3().setFromObject(obj1.object3D);
  let bbox2 = new THREE.Box3().setFromObject(obj2.object3D);

  return bbox1.intersectsBox(bbox2);
};

// CROUCH WHEN PRESSINT CTRL

let isCrouching = false;

document.addEventListener("keydown", (event) => {
  if (event.code === "ShiftLeft") {
    isCrouching = true;
    camera.setAttribute("position", {
      x: camera.getAttribute("position").x,
      y: 1,
      z: camera.getAttribute("position").z,
    });
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "ShiftLeft") {
    isCrouching = false;
    camera.setAttribute("position", {
      x: camera.getAttribute("position").x,
      y: 3,
      z: camera.getAttribute("position").z,
    });
  }
});

tutorialWall.addEventListener("mouseenter", showTutorialMsg);

function showTutorialMsg() {
  console.log(tutorialMsgInicial);
  // tutorialMsgInicial.setAttribute();
  // tutorialMsgMiddle.setAttribute();
  // tutorialMsgFinal.setAttribute();
}

//Landing Page
const playBtn = document.querySelector("#playBtn");
const gameScene = document.getElementById("gameScene");

const horrorSong = new Audio("./Sounds/horrorSong.mp3");

let isMuted = false;

window.addEventListener("click", function () {
  horrorSong.play();
});

function toggleMute() {
  if (isMuted) {
    horrorSong.muted = false;
    horrorSong.currentTime = 0; // set playback time to zero
    isMuted = false;
    document.getElementById("muteBtn").innerText = "MUTE";
  } else {
    horrorSong.muted = true;
    isMuted = true;
    document.getElementById("muteBtn").innerText = "UNMUTE";
  }
}

playBtn.addEventListener("click", () => {
  gameScene.style.display = "block";
  horrorSong.muted = true;
  isMuted = true;
});

document.getElementById("muteBtn").addEventListener("click", toggleMute);
