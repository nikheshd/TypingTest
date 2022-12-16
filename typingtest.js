/*
When the text in the HTML paragraph element with id quoteDisplay and the value entered in HTML textarea element with id quoteInput are not the same, and the HTML button element with id submitBtn is clicked an error message should be shown in the HTML paragraph element with id result
When the text in the HTML paragraph element with id quoteDisplay and the value entered in HTML textarea element with id quoteInput are not the same, and the HTML button element with id submitBtn is clicked the timer should be running
When the text in HTML paragraph element with id quoteDisplay is entered in HTML textarea element, and the HTML button element with id submitBtn is clicked a success message should be shown in HTML paragraph element with id result
The HTML paragraph element with id timer should always have numbers greater than or equals to 0
When the text in HTML paragraph element with id quoteDisplay is entered in HTML textarea element, and the HTML button element with id submitBtn is clicked the timer should stop
When the reset button is clicked, an HTTP request should be made to get a random quotation from the given URL and the value in the HTML paragraph element with id quoteDisplay should be replaced with quotation received in the response
When page is opened, an HTTP request should be made to get a random quotation from the given URL and the HTML paragraph element with id quoteDisplay should have the quotation received in the response.
*/

let timer = document.getElementById("timer");
let quoteDisplay = document.getElementById("quoteDisplay");
let result = document.getElementById("result");
let quoteInput = document.getElementById("quoteInput");
let submitBtn = document.getElementById("submitBtn");
let resetBtn = document.getElementById("resetBtn");
let spinner = document.getElementById("spinner");
let speedTypingTest = document.getElementById("speedTypingTest");
let countdown = 0;
let curquote;

function countWords(str) {
    const arr = str.split(' ');
    return arr.filter(word => word !== '').length;
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
            speedTypingTest.classList.remove("d-none");
            quoteDisplay.textContent = jsonData.content;
            curquote = jsonData.content;
        });
    result.textContent = "";
    quoteInput.value = "";
    clearInterval(intervalId);
    countdown = -1;
    intervalId = setInterval(function () {
        countdown = countdown + 1;
        timer.textContent = countdown + " s";
    }, 1000);
}

resetBtn.addEventListener("click", function () {
    spinner.classList.remove("d-none");
    speedTypingTest.classList.add("d-none");
    getquote();
});

function submitInput() {
    if (quoteInput.value === curquote) {
        if (countdown === -1) {
            result.textContent = "You already typed the correct sentence.";
        } else {
            clearInterval(intervalId);
            let wordscnt = countWords(quoteInput.value);
            result.textContent = "You typed in " + countdown + " seconds. TYPING SPEED: " + Math.round(wordscnt * 600 /countdown) / 10 + "WPM";
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
    }
});

let intervalId = setInterval(function () {
    countdown = countdown + 1;
    timer.textContent = countdown + " s";
}, 1000);

getquote();