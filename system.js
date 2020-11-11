// AMECS subsystem
// https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
// https://modernweb.com/creating-sound-with-the-web-audio-api-and-oscillators/


let consolediv = document.getElementById('console');
log(`begin operation: influence.integrate(Cytus);`);

let button_play = document.getElementById('button_play');
let button_gen_mel = document.getElementById('button_gen_mel');
let button_gen_beat = document.getElementById('button_gen_beat');
let fader_main = document.getElementById("fader_main");
let audioCtx = new(window.AudioContext || window.webkitAudioContext)();

let current_melody = random_melody();
let tempo = 100;
let volume_main = fader_main.value/100;


button_play.addEventListener("click", evt => {
    playMelody(current_melody);
});
button_gen_mel.addEventListener("click", evt => {
    current_melody = random_melody();
});
button_gen_beat.addEventListener("click", evt => {
    current_melody = convert_all_to_note(random_beat());
});
fader_main.oninput = function() {
    volume_main = this.value/100;
}

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

function random_beat(beat_length = 16, note_length = 16, beat_note = 45, threshold = .5) {
    let beatmap = [];
    for (i = 0; i < beat_length; i++) {
        if (Math.random() > threshold) beatmap.push([beat_note,note_length]);
        else beatmap.push([0,note_length]);
    }
    log(`Beat generated: <br>${melody_to_string(beatmap)}`)
    return beatmap;
}

function convert_all_to_note(beatmap, note = 57, ignoreZero = false) {
    for (i in beatmap)
        if (beatmap[i][0] != 0 || ignoreZero)
            beatmap[i][0] = midi_to_freq(note);
    log(`Set all notes to ${note}`);
    return beatmap;
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
  gainNode.gain.value = volume_main;
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


// notes = current_melody;
// notes.reverse();