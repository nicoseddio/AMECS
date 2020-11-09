// AMECS subsystem
// https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
// https://modernweb.com/creating-sound-with-the-web-audio-api-and-oscillators/


let consolediv = document.getElementById('console');
log(`begin operation: influence.integrate(Cytus);`);

let button_play = document.getElementById('button_play');
let button_gen_mel = document.getElementById('button_gen_mel');
let audioCtx = new(window.AudioContext || window.webkitAudioContext)();

let current_melody = random_melody();
let tempo = 100;


button_play.addEventListener("click", evt => {
    playMelody(current_melody);
});
button_gen_mel.addEventListener("click", evt => {
    current_melody = random_melody();
});

async function log(s) {
    consolediv.innerHTML += `<p>> ${s} </p>`;
}

function random_melody(base_note = 69, melody_length = 16) {
    let freqs_melody = [];
    for (i = 0; i < melody_length; i++) {
        scale_note = random_scale_note();
        if (scale_note == 0) freqs_melody.push([0, random_note_length(5,3)]);
        else freqs_melody.push([midi_to_freq(base_note+random_scale_note()+1),random_note_length()])
    }
    console.log(freqs_melody);
    log(`Melody generated: <br>${melody_to_string(freqs_melody)}`)
    return freqs_melody;
}
function midi_to_freq(midi_note) {
    return Math.pow(2, (midi_note - 69) / 12) * 440;
}
function random_scale_note(scale_length = 13, type = 'major') {
    let note = Math.floor(Math.random() * scale_length);
    if (type === 'major') if ([1,3,6,8,10].includes(note)) note -= 1;
    if (type === 'minor') if ([1,4,6,9,11].includes(note)) note -= 1;
    return note;
}
function random_note_length(exp = 3,th = 2) {
    return Math.pow(2, Math.floor(Math.random() * exp)+th);
}

function playMelody(melody) {
    var len = melody.length,
        melodycopy = new Array(len);
    for (var i=0; i<len; ++i)
        melodycopy[i] = melody[i].slice(0);
    if (melodycopy.length > 0) {
        note = melodycopy.pop();
        playNote(note[0], 1000 * 256 / (note[1] * tempo), melodycopy);
    }
}
function playNote(frequency, duration, melody) {
  var oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency; // value in hertz
  let gainNode = audioCtx.createGain();
  gainNode.gain.value = .35;
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
  setTimeout(
    function() {
      oscillator.stop();
      playMelody(melody);
    }, duration);
}

function melody_to_string(melody) {
    let s = "";
    for (l in melody) {
        s += `&emsp;&emsp;[ ${melody[l][0]}, ${melody[l][1]} ]<br>`
    }
    return s;
}


notes = current_melody;
notes.reverse();