let footsteps = document.getElementById("footsteps");
let oct4 = document.getElementById("oct4");
let bump = document.getElementById("bump");
let thud = document.getElementById("thud");
let up = document.getElementById("up");
let alarmClock = document.getElementById("alarmclock");

let elevatorOpen = document.getElementById("elevator-open");
let elevatorMove = document.getElementById("elevator-move");
let fakeButtonClick = document.getElementById("fake-button-click");
let realButtonClick = document.getElementById("real-button-click");

let dialogue = document.getElementById("dialogue");
let doorOpening = document.getElementById("door-opening");

let piano = document.getElementById("piano");
let drums = document.getElementById("drums");
let violin = document.getElementById("violin");

let stepCounter = 0;
let currentRoom = 0;

let specialEvent = true;
let alarmSilenced = false;
let dialoguePlayed = false;

const password = [0, 0, 0, 0];

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

	if(event.key == "w" && currentRoom != 0 && currentRoom != 5 && specialEvent == false) {
		$("#guide-2").fadeOut();
		$(".help-box").fadeIn();
		footsteps.play();
		stepCounter += 1;
	}


	if(currentRoom == 1) {
		if(event.key == "w") {
			if(stepCounter == 15){
				oct4.play();
			}
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
					$("#guide-3-1").fadeIn();
				}, 4000);
			}
		}

	}
	else if(currentRoom == 2) {
		let pressedKey = parseInt(event.key);
		if(pressedKey == 7) {
			realButtonClick.play();
			elevatorMove.play();

			$("#guide-3-1").fadeOut();
			currentRoom = 3;
			stepCounter = 0;

			for (let i = 0; i < 9; i++) {
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
		console.log(stepCounter);

		if(stepCounter > 30 && dialoguePlayed == false) {
			console.log("Dialogue triggered");
			dialogue.play();
			specialEvent = true;
			dialoguePlayed = true;
			setTimeout(function() { // Wait for the dialogue to end; no escape until then!
				specialEvent = false;
			}, 40000);
		}
		else if(stepCounter > 80) {
			console.log("Room 3 door triggered");
			footsteps.pause();
			thud.play();
			specialEvent = true;
		}

		if(event.key == " ") {
			doorOpening.play();

			setTimeout(function() {
				stepCounter = 0;
				currentRoom = 4;
				specialEvent = false;
			}, 3000);
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

			$("#instructions").hide();
			$(".help-text").css("margin-top", "-10%"); // Fix misalignment of the hints box
			$("#hints").css("display", "block"); // For some reason, .show() sets it to inline instead of block, which is not good

			$("#room5").fadeIn();
		}
	}
	else if(currentRoom == 5) {
		if(event.key == "w") {
			$("#guide-4-1").fadeIn();
		}

		let pressedKey = parseInt(event.key);
		if(!isNaN(pressedKey) && pressedKey != 0) {
			console.log("Pressed key is " + pressedKey);
			for (let i = 0; i < 4; i++) {
				if(document.getElementsByClassName("number")[i].innerHTML == 0) {
					document.getElementsByClassName("number")[i].innerHTML = pressedKey;
					password[i] = pressedKey;
					console.log("Changed position " + i + " to " + pressedKey);

					if(i == 3) {
						if(password[0] == 4 && password[1] == 7 && password[2] == 1 && password[3] == 3) {
							realButtonClick.play();
							console.log("Correct password!");
							currentRoom = 6;
							setTimeout(function(){
								$("#room5").fadeOut(function() {
									$("#room6").fadeIn();
								});
							}, 1000);
						}
						else {
							thud.play();
							console.log("Wrong password!");
							for (let j = 0; j < 4; j++) {
								document.getElementsByClassName("number")[j].innerHTML = 0;
							}
						}
					}

					break;
				}
			}
		}

		if(event.key == "Backspace") {
			for (let i = 3; i > -1; i--) {
				if(document.getElementsByClassName("number")[i].innerHTML != 0) {
					document.getElementsByClassName("number")[i].innerHTML = 0;
					password[i] = 0;
					console.log("Removing number at index " + i);
					break;
				}
			}
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
