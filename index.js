import {
  playThreeDigitNumberWithSNR,
  increaseNoise,
  decreaseNoise,
  snrDb,
} from "./audio.js";

import { newLog, downloadLogs } from "./log.js";
import { generateNums } from "./generateNums.js";
const NUM_REVERSALS = 10;
const MEAN_REVERSALS = 8;

let numbers = [];
let key = [];
let trend = -1; //default
let switches = 0;
let score = 0;
let len = 0;
let index = 1;
let snrArray = [];

/**
 *  This is a function that generates three unique digits then interfaces with teh audio.js file to play the audio based on the random digits generated
 *  @return an array of the three nums generated
 */

async function playAudio(nums) {
  disableAllButtons();
  await playThreeDigitNumberWithSNR(nums);
  enableAllButtons();
}
/** simple function that loops through all buttons and disables them */
function disableAllButtons() {
  let buttons = document.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
}

/** simple function that enables all buttons */
function enableAllButtons() {
  let buttons = document.getElementsByTagName("button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
  }
}

/**
 * This function starts the test, logs necesary info, and generates the random numbers
 * @param e event of a button press
 */
async function start_test(e) {
  try {
    electronWrite("test");
  } catch {}
  let logSting = "Index\tNumber_Displayed\tSNR\tNumber_Entered";
  // console.log(lsogSting);
  newLog(logSting);
  e.hidden = true;
  key = await generateNums();
  await playAudio(key);
}

/** this function occures when the check button is clicked and handles updating the score, generating new digits, adjusting the audio, end test logic,  */
async function checkClicked() {
  let nString = ""; //string of entered number
  let keyString = "";
  let isEqual = true;
  if (numbers.length != 3) {
    isEqual = false;
  } else {
    for (let i = 0; i < 3; i++) {
      nString += numbers[i];
      keyString += key[i];
      if (numbers[i] != key[i]) {
        isEqual = false;
      }
    }
  }
  let snr = 0;
  if (isEqual == true) {
    snr = increaseNoise();
    // alert("correct");
    //correct
    if (trend == 0) {
      switches++;
      score++;
      //abstraction for audio
    } else {
      score++;
      //audio abstraction
    }
    trend = 1;
  } else {
    snr = decreaseNoise();
    // alert("incorrect");
    if (trend == 1) {
      trend = 0;
      switches++;
      score--;
      //abstraction for audio
    } else {
      score--;
      //audio abstraction
    }
    trend = 0;
    //incorrects
  }
  snrArray.push(snr);
  //console.log("Index    Number_Displayed    SNR     Number_Entered")
  let logString = index + "\t" + keyString + "\t" + snr + "\t" + nString;
  // console.log(logString);
  newLog(logString);
  index++;
  if (switches == NUM_REVERSALS) {
    let mean = 0;
    if (snrArray.length != 0) {
      let sum = 0;
      for (let i = NUM_REVERSALS - MEAN_REVERSALS; i < snrArray.length; i++) {
        sum += snrArray[i];
      }
      mean = sum / snrArray.length;
    }
    //window.location.href = "results.html?score=" + score;
    let logString = "________________________________________________________";
    // console.log(logString);
    newLog(logString);
    logString = "Mean SNR : " + mean.toFixed(2);
    // console.log(logString);
    newLog(logString);
    document.body.innerHTML =
      '<h1>Test Complete Return Home / Re Feditse</h1> <button  class = "home" onclick=" returnToMain()">Return to Main Menu / Boel morago</button>';
    downloadLogs();
  } else {
    key = await generateNums();
    await playAudio(key);
    document.getElementById("displayText").innerHTML = "";
    len = 0;
  }
  numbers = [];
}
/**
 * This function provides the logic for checking what button is pressed as well as deleting numbers
 * @param e event of a button press
 */
async function clickHandler(e) {
  let buttons = document.getElementsByTagName("button");
  if (e.value == 10) {
    document.getElementById("displayText").innerHTML = "";
    len = 0;
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false;
    }
    await checkClicked();
    return;
  }
  if (e.value == 11) {
    if (len == 0) return;
    numbers.pop();
    let str = document.getElementById("displayText").innerHTML.split("");

    document.getElementById("displayText").innerHTML = "";
    let newStr = "";
    for (let i = 0; i < len - 1; i++) {
      newStr += str[i];
    }
    let val = str[len - 1];
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].value == val) {
        buttons[i].disabled = false;
      }
    }
    document.getElementById("displayText").innerHTML = newStr;
    len--;
    return;
  }
  if (len > 2) return;
  len++;
  numbers.push(e.value);
  document.getElementById("displayText").innerHTML += e.value;
  //   buttons = document.getElementsByTagName("button");
  //e.disabled = true;
}

window.start_test = start_test;
window.clickHandler = clickHandler;
