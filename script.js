let footsteps = document.getElementById("footsteps");
let thud = document.getElementById("thud");
let doorOpening = document.getElementById("door-opening");
let alarmClock = document.getElementById("alarmclock");
let elevatorOpen = document.getElementById("elevator-open");
let elevatorMove = document.getElementById("elevator-move");
let talking = document.getElementById("talking");

let stepCounter = 0;
let currentRoom = 0;

let specialEvent = true;
let alarmSilenced = false;


document.body.addEventListener('click', (event) => {
	if(currentRoom == 0) {
		$("#intro").fadeOut();
		currentRoom = 1;
		alarmClock.play();
	}
})

document.body.addEventListener('keydown', (event) => {

	if(event.key == "w" && currentRoom != 0 && specialEvent == false) {
		footsteps.play();
		stepCounter += 1;
	}


	if(currentRoom == 1) {
		if(event.key == "w") {
			if(stepCounter > 150) {
				footsteps.pause();
				thud.play();
				specialEvent = true;
			}
		}

		else if(event.key == " ") {
			if(stepCounter == 0) {
				alarmClock.pause();
				thud.play();
				specialEvent = false;
			}
			else if(stepCounter >= 150) {
				elevatorOpen.play();
				currentRoom = 2;
				stepCounter = 0;
				specialEvent = false;

				setTimeout(function(){
				    $("#room2").fadeIn();
				}, 4000);
			}
		}

	}
	else if(currentRoom == 3) {
		talking.pause();
		let talkVolume = (stepCounter * 1.0) / 150;
		console.log((stepCounter * 1.0) / 150);
		//talking.volume = Math.min(talkVolume, 1);
		talking.volume = 0.1;
		talking.play();

		if(event.key == "w") {
			stepCounter += 1;
		}
	}


})

document.body.addEventListener('keyup', (event) => {
  if(event.key == 'w') {
	  footsteps.pause();
  }
})

$(document).ready(function() {
	$(".fake-button").click(function() {
		thud.play();
		let buttonIndex = parseInt($(this).text());
		let buttonElement = document.getElementsByClassName("button")[buttonIndex - 1]; // The number on the button corresponds to its order in the HTML, so we can use it as a handy index
		$(buttonElement).animate({ opacity: 0 }); // Doing this instead of fadeOut() keeps the hidden element's "place" in the display
	});
});

$(document).ready(function() {
	$(".real-button").click(function() {
		elevatorMove.play();
		currentRoom = 3;
	});
});
