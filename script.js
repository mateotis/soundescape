// First step is defining all the audio we use - and there's a lot!
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

// As well as some variables we'll refer to
let stepCounter = 0;
let currentRoom = 0;

let specialEvent = true;
let dialoguePlayed = false;

const password = [0, 0, 0, 0];

//room 0 - title screen
document.body.addEventListener('click', (event) => {
    if (currentRoom == 0) {
        $("#intro").fadeOut(); //fade out title screen
        currentRoom = 1;
        alarmClock.play();

        setTimeout(function () {
            $("#guide-1-1").fadeIn(function () { //show the "wake up" message
                setTimeout(function () {
                    $("#guide-1-2").fadeIn(); //show the press "space" message
                }, 1000);
            });
        }, 2000);
    }
})

// when you press w, you "move forward"
// it counts the steps you take so events will trigger when a certain step threshold is reached, giving the illusion of movement/progress
document.body.addEventListener('keydown', (event) => { // This is an absolutely massive function, but we did our best to structure it efficiently

    if (event.key == "w" && currentRoom != 0 && currentRoom != 5 && specialEvent == false) { // We can walk freely most times, with a few exceptions
        $("#guide-2").fadeOut(); //hides listen message
        $(".help-box").fadeIn(); //shows the help button in top corner
        footsteps.play();
        stepCounter += 1;
	}

	//room 1 - bedroom
    if (currentRoom == 1) {
        if (event.key == "w") {
            if(stepCounter == 15){
                oct4.play();
            }
            if (stepCounter == 100) {
                bump.volume = 0.7; // Because the glass shattering was a little too loud...
                bump.play(); //glass shatter sound
                if(stepCounter == 15){
                    oct4.play();
                }
            } else if (stepCounter > 200) { //you have reached the elevator door
                footsteps.pause();
                thud.play(); //you are walking into a wall silly
                specialEvent = true; // The special event flag is used to lock us in one event or another without being able to move
            }
        } else if (event.key == " ") { //turn off alarm, get up
            if (stepCounter == 0) { //if space is pressed with no footsteps (aka at the start), turn off alarm, else, open elevator
                alarmClock.pause();
                thud.play(); // you smack the alarm clock
                $("#guide-1").fadeOut(); //hide all the intro text
                specialEvent = false;

                up.play(); //get up
                up.loop = false;

                setTimeout(function () {
                    $("#guide-2-1").fadeIn(function () { //show press "w" message
                        setTimeout(function () {
                            $("#guide-2-2").fadeIn(); //show "listen" message
                        }, 1000);
                    });
                }, 2000); // We make judicious use of timeouts in this site, syncing up our scarce visuals with the sounds (or just for dramatic effect)

            } else if (stepCounter >= 200) { //open elevator, move to next room
                elevatorOpen.play();
                currentRoom = 2;
                stepCounter = 0;
                specialEvent = false;

                setTimeout(function () {
                    $("#room2").fadeIn();
                    $("#guide-3-1").fadeIn(); //show button help message
                }, 4000);
            }
        }

    }
    //room 2 - elevator
    else if (currentRoom == 2) {
        let pressedKey = parseInt(event.key);
        if (pressedKey == 7) { //if 7 is pressed, proceed to next room
            realButtonClick.play(); // The real click comes from the same root sound as the fake one, but pitched down in Audacity
            elevatorMove.play();

            $("#guide-3-1").fadeOut();
            currentRoom = 3;
            stepCounter = 0;

            for (let i = 0; i < 9; i++) {
                let buttonElem = document.getElementsByClassName("button")[i];
                if (i === 6) {
                    $(buttonElem).css('color', 'yellow'); //right button glows yellow when pressed
                } else {
                    $(buttonElem).animate({opacity: 0}); //fade out wrong button when right one is pressed
                }
            }
            setTimeout(function () {
                $("#room2").fadeOut();
            }, 28000); // waiting in the elevator
        } else if (!isNaN(pressedKey) && pressedKey != 0) { //fade out wrong button if clicked
            fakeButtonClick.play();
            let buttonElement = document.getElementsByClassName("button")[pressedKey - 1]; // The number on the button corresponds to its order in the HTML, so we can use it as a handy index
            $(buttonElement).animate({opacity: 0}); // Doing this instead of fadeOut() keeps the hidden element's "place" in the display
        }
    }
    //room 3 - friends place
    else if (currentRoom == 3) {
        // start dialogue with friend
        if (stepCounter > 30 && dialoguePlayed == false) {
            dialogue.play();
            specialEvent = true;
            dialoguePlayed = true;
            setTimeout(function () { // Wait for the dialogue to end; no escape until then!
                specialEvent = false;
            }, 40000);
        } else if (stepCounter > 80) { //open door to room 4 when dialogue is over
            footsteps.pause();
            thud.play();
            specialEvent = true;
            if (event.key == " ") { //open the door
                doorOpening.play();

                setTimeout(function () {
                    stepCounter = 0;
                    currentRoom = 4;
                    specialEvent = false;
                }, 3000);
            }
        }
    }
    //room 4 - auditorium
    else if (currentRoom == 4) { //start playing the components to the "song", gets louder as you walk more
        if (stepCounter > 20) {
            piano.volume = Math.min((stepCounter * 1.0) / 200, 1.0); //converts step to float percentage to make the sounds louder as you get closer
            piano.play();
        }
        if (stepCounter > 120) {
            drums.volume = Math.min((stepCounter * 1.0) / 300, 1.0); // The min function makes sure we don't overflow above 100% volume
            drums.play();
        }
        if (stepCounter > 220) {
            violin.volume = Math.min((stepCounter * 1.0) / 400, 1.0);
            violin.play();
        }
        if (stepCounter > 400) { //music stops when at door
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
    //room 5 - escape!
    else if (currentRoom == 5) {
        if (event.key == "w") {
            $("#guide-4-1").fadeIn(); //message about inputting numbers
        }

        let pressedKey = parseInt(event.key); // Parse the input key, make sure it's a number
        if (!isNaN(pressedKey) && pressedKey != 0) {
            for (let i = 0; i < 4; i++) { // Iterate over the number pads
                if (document.getElementsByClassName("number")[i].innerHTML == 0) { // If any of them are 0 (the default value), insert the input number there
                    document.getElementsByClassName("number")[i].innerHTML = pressedKey;
                    password[i] = pressedKey;

                    if (i == 3) { //correct code is 4713
                        // 4 on alarm clock
                        // 7 on elevator
                        // 1 spoon of sugar
                        // 3 instruments playing
                        if (password[0] == 4 && password[1] == 7 && password[2] == 1 && password[3] == 3) { //right password! you're free!
							realButtonClick.play();
							currentRoom = 6;
							specialEvent = true;
							setTimeout(function(){
								$(".help-box").fadeOut();
								$("#hints").hide();
								$("#room5").fadeOut(function() {
									$("#room6").fadeIn();
								});
							}, 1000);
                        } else { //wrong password! reset numbers
                            thud.play();
                            for (let j = 0; j < 4; j++) {
                                document.getElementsByClassName("number")[j].innerHTML = 0;
                            }
                        }
                    }

                    break;
                }
            }
        }

        if (event.key == "Backspace") { //you can delete a number you input - it always deletes the first non-zero value
            for (let i = 3; i > -1; i--) { // This is the first time in my life that I've written a DECREMENTING for loop
                if (document.getElementsByClassName("number")[i].innerHTML != 0) {
                    document.getElementsByClassName("number")[i].innerHTML = 0;
                    password[i] = 0;
                    break;
                }
            }
        }
    }
})

document.body.addEventListener('keyup', (event) => { //pause footsteps when not pressing w
    if (event.key == 'w') {
        footsteps.pause();
    }
})

$(document).ready(function () { //interaction with help box in top right
    $(document).on('mousemove', (event) => {
        let offset = $(".help-box").offset(); // Where is the element relative to the top-left of the page
        let height = $(".help-box").height(); // Element height
        let width = $(".help-box").width(); // Element width

        if (offset.left < event.clientX && event.clientX < (offset.left + width) && offset.top < event.clientY && event.clientY < (offset.top + height)) { // Hitbox math
            $('.help-text').css("opacity", "1");
        } else {
            $('.help-text').css("opacity", "0");
        }
    });
});

$(document).ready(function() { // Print your certificate of escape!
	$("#end").click(function() {
		window.print();
	});
});
