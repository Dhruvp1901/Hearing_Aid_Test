# Coding Kodiaks

This project is a web application which can perform the Digit Triplet Hearing Test in the language Setswana, which is spoken in Botswana.

## Team Information

- **Team ID:** [[team-id (TA's internal id)]]
- **Team Name:** Coding Kodiaks
- **Problem/Project name:** Digit Triplet Test

## Members

- Divyessh Maheshwari (email: dm568522@ohio.edu, gh: [Divyessh](https://github.com/Divyessh))
- Dhruv Patel (email: dp856122@ohio.edu, gh: [Dhruvp1901](https://github.com/Dhruvp1901))
- Sophia Zumwalt (email: sz533522@ohio.edu, gh: [sophia-zumwalt](https://github.com/sophia-zumwalt))
- William Meyer (email: wm975122@ohio.edu, gh: [William-Meyer](https://github.com/William-Meyer))

## About this project

The Digit Triplet Test plays three spoken digits simultaneously against background noise, requiring users to correctly identify them to progress. It begins at a Signal-to-Noise Ratio (SNR) of 10 dB, with noise levels fixed and speech levels adjusted dynamically. Correct responses reduce the SNR (making the test harder), while incorrect responses increase it (making it easier). The test requires a minimum of 12 reversals, with the final results based on 8 reversals. Participants who correctly identify over 50% of the triplets pass the hearing test; otherwise, a medical consultation is recommended.

## Platform

The programming languages used were HTML/CSS (for frontend UI and page structure) and JavaScript (for audio processing and general logic).

## Frameworks/Tools

The tools used were React.js, and also an Audio Processing library called howler.js in order to incorporate the audio. Electron was used to package everything together, and Chrome DevTools and Lighthouse were used for profiling and static analysis. GitHub was used for version control.

## How to build/compile

for the browser version you can simply open a live server from VScode and it should work. For the electron version make sure you have electron installed and npm installed. Adjust the package file start command such that "start": "electron ." and run npm start.
