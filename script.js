let footsteps = document.getElementById("footsteps");
let thud = document.getElementById("thud");
let doorOpening = document.getElementById("door-opening");
let stepCounter = 0;
let currentRoom = 1;

document.body.addEventListener('keydown', (event) => {
	if(event.key == 'w') {

		if(stepCounter <= 150) {
		  footsteps.play();
		  stepCounter += 1;
		}

		else if(stepCounter > 150 && currentRoom == 1) {
		  footsteps.pause();
		  thud.play();
		}
	}

	else if(event.key == " " && stepCounter > 150 && currentRoom == 1) {
		doorOpening.play();
		currentRoom = 2;
		stepCounter = 0;
	}

})

document.body.addEventListener('keyup', (event) => {
  if(event.key == 'w') {
	  footsteps.pause();
  }
})
