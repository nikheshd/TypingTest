/*
When the text in the HTML paragraph element with id quoteDisplay and the value entered in HTML textarea element with id quoteInput are not the same, and the HTML button element with id submitBtn is clicked an error message should be shown in the HTML paragraph element with id result
When the text in the HTML paragraph element with id quoteDisplay and the value entered in HTML textarea element with id quoteInput are not the same, and the HTML button element with id submitBtn is clicked the timer should be running
When the text in HTML paragraph element with id quoteDisplay is entered in HTML textarea element, and the HTML button element with id submitBtn is clicked a success message should be shown in HTML paragraph element with id result
The HTML paragraph element with id timer should always have numbers greater than or equals to 0
When the text in HTML paragraph element with id quoteDisplay is entered in HTML textarea element, and the HTML button element with id submitBtn is clicked the timer should stop
When the reset button is clicked, an HTTP request should be made to get a random quotation from the given URL and the value in the HTML paragraph element with id quoteDisplay should be replaced with quotation received in the response
When page is opened, an HTTP request should be made to get a random quotation from the given URL and the HTML paragraph element with id quoteDisplay should have the quotation received in the response.
*/

let testing = false;
let timer = document.getElementById("timer");
let quoteDisplay = document.getElementById("quoteDisplay");
let result = document.getElementById("result");
let quoteInput = document.getElementById("quoteInput");
let submitBtn = document.getElementById("submitBtn");
let resetBtn = document.getElementById("resetBtn");
let spinner = document.getElementById("spinner");
let speedTypingTest = document.getElementById("speedTypingTest");
let speedel = document.getElementById("speed");
let countdown = -1;
let hspeedel = document.getElementById("hspeed");
let avgspeedel = document.getElementById("avgspeed");
let speed_data = [];
let curquote;
let hspeed = 0;
let avgspeed = 0;
let intervalId;
resetBtn.textContent = "Start";
timer.textContent = "0";
quoteDisplay.textContent = "\"The sentence to be typed will be displayed here.\""


function countWords(str) {
    const arr = str.split(' ');
    return arr.filter(word => word !== '').length;
}

function get_average(arr){
    var sum = 0;
    for (var i of arr) {
        sum += i;
    }
    return Math.ceil(sum / arr.length);
}

function getquote() {
    let options = {
        method: "GET",
    };
    fetch("https://apis.ccbp.in/random-quote", options)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonData) {
            spinner.classList.add("d-none");
            quoteDisplay.classList.remove("d-none");
            quoteDisplay.textContent = jsonData.content;
            curquote = jsonData.content;
        });
}
function resetting() {
    if(resetBtn.textContent=="Start"){
        intervalId = setInterval(function () {
            countdown = countdown + 1;
            timer.textContent = countdown;
        }, 1000);
        resetBtn.textContent = "Reset";
    }
    result.textContent = "";
    quoteInput.value = "";
    clearInterval(intervalId);
    countdown = -1;
    intervalId = setInterval(function () {
        countdown = countdown + 1;
        timer.textContent = countdown;
    }, 1000);
}

resetBtn.addEventListener("click", function () {
    getquote();
    speedel.textContent = "- WPM";
    spinner.classList.remove("d-none");
    quoteDisplay.classList.add("d-none");
    resetting();
});

function submitInput() {
    if(testing) curquote="1 2 3 4 5";
    if(resetBtn.textContent == "Start"){
        result.textContent = "Press Start button to start the typing test.";
    }else if (quoteInput.value === curquote) {
        if (countdown === -1) {
            result.textContent = "You already typed the correct sentence.";
        } else {
            clearInterval(intervalId);
            let wordscnt = countWords(quoteInput.value);
            result.textContent = "You typed in " + countdown + " seconds.";
            let curSpeed = (wordscnt * 60 / countdown);
            let speed = 0;
            let cur_hspeed = hspeed>curSpeed?hspeed: curSpeed;
            let displaySpeedId = setInterval(function () {
                speed = speed + 1;
                speedel.textContent = speed + " WPM";
                if (hspeed < speed) {
                    hspeed = speed;
                    hspeedel.textContent = "*" + hspeed + " WPM";
                }
                if (speed > curSpeed) {
                    speedel.textContent = curSpeed + " WPM";
                    hspeedel.textContent = cur_hspeed + " WPM";
                    hspeed = cur_hspeed;
                    clearInterval(displaySpeedId);
                }
            }, 10);
            speed_data.push(curSpeed);
            let cur_avg = get_average(speed_data);
            if(speed_data.length==1){
                cur_avg = curSpeed;
            }
            avgspeed = cur_avg;
            avgspeedel.textContent = avgspeed + " WPM";
            countdown = -1;
        }
    } else {
        result.textContent = "You typed incorrect sentence.";
    }
}

submitBtn.addEventListener("click", submitInput);

quoteInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitBtn.click();
    }else if(event.altKey && event.key === "r"){
        event.preventDefault();
        resetBtn.click();
    }
});


// getquote();
// let intervalId = setInterval(function () {
//     countdown = countdown + 1;
//     timer.textContent = countdown;
// }, 1000);