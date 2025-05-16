export const audioContext = new (window.AudioContext || window.webkitAudioContext)();
export let snrDb = 6; // Default SNR in decibels

// Function to load a .wav file
/**
 * function that loads an audio file 
 * @param url url of wav file to be loaded
 * @returns returns the arrayBuffer of the .wav file
 */
async function loadAudioFile(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}

/**
 * function to play white noise
 * @param length time whit noise is to be played
 * @param context context for noise to be played in 
 * @returns returns the arrayBuffer of the noise 
 */
function generateWhiteNoise(length, context) {
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1; // Generate random values between -1 and 1
  }

  return buffer;
}

//** function to increase noise by 2db */
export function increaseNoise() {
  snrDb -= 2; // Decrease SNR by 2 dB
  return snrDb + 2;
}

/** function to decrease noise by 2db */
export function decreaseNoise() {
  snrDb += 2; // Increase SNR by 2 dB
  return snrDb - 2;
}

/**
 * function to handle audio control flow
 * @param audioContext context audio is to be played in 
 * @returns a function to create a timeout 
 */
async function playStartingMessage(audioContext) {
  const audioFileUrl = `./audio_files/start.wav`; // Replace with actual file path for each digit
  const arrayBuffer = await loadAudioFile(audioFileUrl);
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const duration = audioBuffer.duration * 1000;
  const gainSignal = audioContext.createGain();

  // Set the gain of the signal (original sound) and the noise
  gainSignal.gain.value = 1;

  // Create audio sources for the signal and the noise
  const sourceSignal = audioContext.createBufferSource();
  sourceSignal.buffer = audioBuffer;

  // Connect the signal and noise to gain nodes
  sourceSignal.connect(gainSignal);

  // Connect the gain nodes to the audio destination (speakers)
  gainSignal.connect(audioContext.destination);

  // Start playback
  sourceSignal.start();
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/** 
 * function to play a digit with a given snrDb
 * @param digit the digit to be played
 * @param snrDb the current snrDB
 * @param audioContext the context to play the audio in
 * @returns function to create a timeout
 */
async function playDigitWithNoise(digit, snrDb, audioContext) {
  const audioFileUrl = `./audio_files/${digit}.wav`; // Replace with actual file path for each digit
  const arrayBuffer = await loadAudioFile(audioFileUrl);
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const duration = audioBuffer.duration * 1000;

  const gainSignal = audioContext.createGain();

  // Convert the SNR from dB to linear scale
  const snrLinear = Math.pow(10, snrDb / 20);

  // Set the gain of the signal (original sound) and the noise
  gainSignal.gain.value = snrLinear;

  // Create audio sources for the signal and the noise
  const sourceSignal = audioContext.createBufferSource();
  sourceSignal.buffer = audioBuffer;

  // Connect the signal and noise to gain nodes
  sourceSignal.connect(gainSignal);

  // Connect the gain nodes to the audio destination (speakers)
  gainSignal.connect(audioContext.destination);

  // Start playback
  sourceSignal.start();
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/** 
 * function to play white noise between digits
 * @param {*} snrDb snr of white noise
 * @param {*} gapDuration length to be played
 * @param {*} audioContext context for audio to be played
 * @returns function to wait for noise to be finished 
 */
function playWhiteNoiseDuringGap(snrDb, gapDuration, audioContext) {
  const noiseBuffer = generateWhiteNoise(
    (gapDuration * audioContext.sampleRate) / 1000,
    audioContext
  ); // Generate noise for the gap duration
  const gainNoise = audioContext.createGain();

  // Convert SNR from dB to linear scale
  const snrLinear = Math.pow(10, snrDb / 20);
  gainNoise.gain.value = 1 / snrLinear;

  // Create a source for the noise
  const sourceNoise = audioContext.createBufferSource();
  sourceNoise.buffer = noiseBuffer;

  // Connect the noise to the audio destination
  sourceNoise.connect(gainNoise);
  gainNoise.connect(audioContext.destination);

  // Start the noise and stop it after the gap
  sourceNoise.start();
  return new Promise((resolve) => {
    sourceNoise.onended = resolve; // Wait until the noise finishes
  });
}

/**
 * function to play all three digits with noise 
 * @param digitTriplet digits to be played
 */
export async function playThreeDigitNumberWithSNR(digitTriplet) {
  await playStartingMessage(audioContext);

  const noiseFileUrl = `./audio_files/noise.wav`;
  const noiseArrayBuffer = await loadAudioFile(noiseFileUrl);
  const noiseBuffer = await audioContext.decodeAudioData(noiseArrayBuffer);
  // const noiseBuffer = generateWhiteNoise(
  //   (gapDuration * audioContext.sampleRate) / 1000,
  //   audioContext
  // ); // Generate noise for the gap duration

  // Create a source for the noise
  const sourceNoise = audioContext.createBufferSource();
  sourceNoise.buffer = noiseBuffer;

  // Connect the noise to the audio destination
  sourceNoise.connect(audioContext.destination);

  // Start the noise and stop it after the gap
  sourceNoise.start();

  // await playWhiteNoiseDuringGap(snrDb, 800, audioContext);
  // Play each digit with a 300 ms gap in between
  for (let i = 0; i < digitTriplet.length; i++) {
    const digit = digitTriplet[i];
    await playDigitWithNoise(digit, snrDb, audioContext); // Play the digit
  }
  new Promise((resolve) => {
    setTimeout(sourceNoise.stop(), 500); // Wait until the noise finishes
  });
}
