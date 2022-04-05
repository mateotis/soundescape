let footsteps = document.getElementById("footsteps");
let bump = document.getElementById("bump");
let thud = document.getElementById("thud");
let up = document.getElementById("up");
let doorOpening = document.getElementById("door-opening");
let alarmClock = document.getElementById("alarmclock");

let elevatorOpen = document.getElementById("elevator-open");
let elevatorMove = document.getElementById("elevator-move");
let fakeButtonClick = document.getElementById("fake-button-click");
let realButtonClick = document.getElementById("real-button-click");

let talking = document.getElementById("talking");

let piano = document.getElementById("piano");
let drums = document.getElementById("drums");
let violin = document.getElementById("violin");

let stepCounter = 0;
let currentRoom = 0;


let specialEvent = true;
let alarmSilenced = false;


document.body.addEventListener('click', (event) => {
	if(currentRoom == 0) {
		$("#intro").fadeOut();
		currentRoom = 1;
		alarmClock.play();

		setTimeout(function(){
			$("#guide-1-1").fadeIn(function() {
				setTimeout(function(){
					$("#guide-1-2").fadeIn();
				}, 1000);
			});
		}, 2000);
	}
})

document.body.addEventListener('keydown', (event) => {

	if(event.key == "w" && currentRoom != 0 && specialEvent == false) {
		$("#guide-2").fadeOut();
		$(".help-box").fadeIn();
		footsteps.play();
		stepCounter += 1;
	}


	if(currentRoom == 1) {
		if(event.key == "w") {
			if(stepCounter == 75) {
				bump.volume = 0.7; // Because the glass shattering was a little too loud...
				bump.play();
			}
			else if(stepCounter > 150) {
				footsteps.pause();
				thud.play();
				specialEvent = true;
			}
		}

		else if(event.key == " ") {
			if(stepCounter == 0) {
				alarmClock.pause();
				thud.play();
				$("#guide-1").fadeOut();
				specialEvent = false;

				up.play();
				up.loop = false;

				setTimeout(function(){
					$("#guide-2-1").fadeIn(function() {
						setTimeout(function(){
							$("#guide-2-2").fadeIn();
						}, 1000);
					});
				}, 2000);
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
	else if(currentRoom == 2) {
		let pressedKey = parseInt(event.key);
		if(pressedKey == 7) {
			realButtonClick.play();
			elevatorMove.play();
			currentRoom = 3;
			for (let i=0; i<9; i++) {
				if (i === 6) {
					let buttonElem = document.getElementsByClassName("button")[i];
					$(buttonElem).css('color', 'yellow');
				}
				else {
					let buttonElem = document.getElementsByClassName("button")[i];
					$(buttonElem).animate({opacity: 0});
				}
			}
			setTimeout(function(){
				$("#room2").fadeOut();
			}, 28000);
		}
		else if(!isNaN(pressedKey) && pressedKey != 0) {
			fakeButtonClick.play();
			let buttonElement = document.getElementsByClassName("button")[pressedKey - 1]; // The number on the button corresponds to its order in the HTML, so we can use it as a handy index
			$(buttonElement).animate({ opacity: 0 }); // Doing this instead of fadeOut() keeps the hidden element's "place" in the display
		}
	}
	else if(currentRoom == 3) {
		talking.pause();
		let talkVolume = (stepCounter * 1.0) / 500;
		talking.volume = Math.min(talkVolume, 1.0);
		console.log(talking.volume);
		talking.play();

		if(event.key == "w") {
			stepCounter += 1;
		}
		else if(event.key == " ") {
			stepCounter = 0;
			currentRoom = 4;
			talking.pause();
			thud.play();
		}
	}
	else if(currentRoom == 4) {
		if(stepCounter > 20) {
			console.log(stepCounter + " starting piano");
			piano.volume = Math.min((stepCounter * 1.0) / 200, 1.0);
			piano.play();
		}
		if(stepCounter > 120) {
			console.log(stepCounter + " starting drums");
			drums.volume = Math.min((stepCounter * 1.0) / 300, 1.0);
			drums.play();
		}
		if(stepCounter > 220) {
			console.log(stepCounter + " starting violin");
			violin.volume = Math.min((stepCounter * 1.0) / 400, 1.0);
			violin.play();
		}
		if(stepCounter > 400) {
			thud.play();
			piano.pause();
			drums.pause();
			violin.pause();
			stepCounter = 0;
			currentRoom = 5;
		}
	}
	else if(currentRoom == 5) {
		if(event.key == "w") {
			$("#guide-3-1").fadeIn();
		}
	}


})

document.body.addEventListener('keyup', (event) => {
	if(event.key == 'w') {
		footsteps.pause();
	}
})

$(document).ready(function() {
	$(document).on('mousemove', (event) => {
		let offset = $(".help-box").offset(); // Where is the element relative to the top-left of the page
		let height = $(".help-box").height(); // Element height
		let width = $(".help-box").width(); // Element width

		if(offset.left < event.clientX && event.clientX < (offset.left + width) && offset.top < event.clientY && event.clientY < (offset.top + height)) { // The actual math - all these relations together ensure that our mouse is within said flashback prompt before triggering the flashback
			$('.help-text').css("opacity","1");
		}
		else {
			$('.help-text').css("opacity", "0");
		}
	});
});

$.keyframe.define([{
	name: 'flicker',
	'0%': {'filter': 'drop-shadow(0 0 0px rgba(255,255,0, 50))'},
	'20%': {'filter': 'drop-shadow(0 0 0.8rem rgba(255,255,0, 50))'},
	'58%': {'filter': 'drop-shadow(0 0 0.8rem rgba(255,255,0, 50))'},
	'60%': {'filter': 'none'},
	'62%': {'filter': 'drop-shadow(0 0 0.8rem rgba(255,255,0, 50))'},
	'70%': {'filter': 'none'},
	'72%': {'filter': 'drop-shadow(0 0 0.8rem rgba(255,255,0, 50))'},
	'100%': {'filter': 'drop-shadow(0 0 0.8rem rgba(255,255,0, 50))'}
}]);
