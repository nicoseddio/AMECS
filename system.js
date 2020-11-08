// AMECS subsystem
//https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies

let consolediv = document.getElementById('console');
let button_test = document.getElementById('testbutton');
let audioCtx = new(window.AudioContext || window.webkitAudioContext)();

let current_melody = random_melody();

button_test.addEventListener("click", evt => {
    playMelody();
});

log(`begin operation: influence.integrate(Cytus);`);
log(current_melody.toString());

async function log(s) {
    consolediv.innerHTML += `<p>> ${s} </p>`;
}

// function playMelody(melody = random_melody()) {
//     for (note in melody) {
//         playNote(freq(note));
//     }
// }
// function playNote(frequency, length = 1) {
//     // create Oscillator node
//     let oscillator = audioCtx.createOscillator();
  
//     oscillator.type = 'sine';
//     oscillator.frequency.value = frequency; // value in hertz
//     let gainNode = audioCtx.createGain();
//     gainNode.gain.value = .25;
//     oscillator.connect(gainNode);
//     gainNode.connect(audioCtx.destination);
//     oscillator.start();
//     oscillator.stop(audioCtx.currentTime + length);

// }

/**
 * Get the pitch frequency in herzs (with custom concert tuning) from a midi number
 *
 * This function is currified so it can be partially applied (see examples)
 *
 * @param {Float} tuning - the frequency of A4 (null means 440)
 * @param {Integer} midi - the midi number
 * @return {Float} the frequency of the note
 *
 * @example
 * // 69 midi is A4
 * freq(null, 69) // => 440
 * freq(444, 69) // => 444
 *
 * @example
 * // partially applied
 * var freq = require('midi-freq')(440)
 * freq(69) // => 440
 * 
 * Author: https://github.com/danigb/midi-freq
 */
function freq (tuning, midi) {
    tuning = tuning || 440
    if (arguments.length > 1) return freq(tuning)(midi)

    return function (m) {
        return m === 0 || (m > 0 && m < 128) ? Math.pow(2, (m - 69) / 12) * tuning : null
    }
}

function midi_to_freq(midi_note) {
    return Math.pow(2, (midi_note - 69) / 12) * 440;
}
function random_melody(base_note = 69, melody_length = 16) {
    let melody = [];
    for (i = 0; i < melody_length; i++) {
        melody.push([base_note+random_scale_note(),4])
    }
    console.log(melody);
    return melody;
}
function random_scale_note(scale_length = 12, type = 'major') {
    let note = Math.floor(Math.random() * scale_length);
    if (type === 'major') if ([1,3,6,8,10].includes(note)) note -= 1;
    if (type === 'minor') if ([1,4,6,9,11].includes(note)) note -= 1;
    return note;
}








// // create web audio api context
// var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

function playNote(frequency, duration) {
  // create Oscillator node
  var oscillator = audioCtx.createOscillator();

  oscillator.type = 'square';
  oscillator.frequency.value = frequency; // value in hertz
  oscillator.connect(audioCtx.destination);
  oscillator.start();

  setTimeout(
    function() {
      oscillator.stop();
      playMelody();
    }, duration);
}

function playMelody() {
  if (notes.length > 0) {
    note = notes.pop();
    playNote(midi_to_freq(note[0]), 1000 * 256 / (note[1] * tempo));
  }
}

notes = current_melody;
// notes = [
//   [659, 4],
//   [659, 4],
//   [659, 4],
//   [523, 8],
//   [0, 16],
//   [783, 16],
//   [659, 4],
//   [523, 8],
//   [0, 16],
//   [783, 16],
//   [659, 4],
//   [0, 4],
//   [987, 4],
//   [987, 4],
//   [987, 4],
//   [1046, 8],
//   [0, 16],
//   [783, 16],
//   [622, 4],
//   [523, 8],
//   [0, 16],
//   [783, 16],
//   [659, 4]
// ];

notes.reverse();
tempo = 100;