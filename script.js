//CAMERA
let camera = document.querySelector("a-camera");

/**
 * @class Grabbable objects inherit this class.
 * They need to be put in an array and looped through for the moving logic
 */
class grabbableObject {
  constructor(domElement, inventory, target = null, id) {
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

    // create a separate inventory array for each object
    this.inventory = inventory;

    this.inventoryEl = document.querySelector("#inventory");

    this.id = id;

    this.domElement.addEventListener("click", () => {
      if (!this.deposited) {
        if (!this.inventory.includes(this.domElement.id)) {
          this.inventory.push(this.domElement.id);
          this.inventoryEl.textContent = `Inventory: ${this.inventory.join(
            ", "
          )}`;
          console.log(this.inventory);
        }
      }
    });
  }
}

// ITEMS THAT THE PLAYER HAS IN HIS INVENTORY
let inventory = [];

// LIST OF OBJECTS ADDED TO THE BOXES (IF THE TOTAL EQUALS THE AMOUNT NEEDED THAN YOU FINISH THE LEVEL)
let completed = [];

//FIRST LEVEL OBJECTS
let toyRecipient = document.querySelector("#toyRecipient");
//TOYS  ---> Need to be created in html <---
let toyCube = new grabbableObject("#toyCube", inventory);

let toyCube2 = new grabbableObject("#toyCube2", inventory);

//TOYS ARRAY
let grabbableToysArray = [toyCube, toyCube2];

// Test to remove items from the inventory
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    // Clear the inventory array and update the inventory display
    inventory = [];
    document.querySelector("#inventory").textContent = "Inventory: Empty";
  }
});

//START
window.onload = () => {
  loop();
};

//GAME LOGIC
loop = () => {
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
        let x = cameraPos.x - Math.sin((cameraRot.y / 180) * Math.PI) * 5;
        let y = 1;
        let z = cameraPos.z - Math.cos((cameraRot.y / 180) * Math.PI) * 5;

        obj.domElement.setAttribute("position", { x: x, y: y, z: z });
        obj.domElement.setAttribute("rotation", { x: 0, y: cameraRot.y, z: 0 });

        //If it collides with the recipient it will enter a state where it can not move no more
        if (isColliding(obj.domElement, toyRecipient)) {
          obj.deposited = true;
          obj.domElement.setAttribute("position", { x: 0, y: 100, z: 0 });
          obj.domElement.setAttribute("rotation", { x: 0, y: 0, z: 0 });
          completed.push(obj.domElement.id);
          if (completed.length == grabbableToysArray.length) {
            console.log("level completed!");
          }
        }
      }
  });

  window.requestAnimationFrame(loop);
};

isColliding = (obj1, obj2) => {
  let bbox1 = new THREE.Box3().setFromObject(obj1.object3D);
  let bbox2 = new THREE.Box3().setFromObject(obj2.object3D);

  return bbox1.intersectsBox(bbox2);
};
