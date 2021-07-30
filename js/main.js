const CACHE_NAME = 'tasks';
const MIN_TASKS = 2;
const CLICK_SOUND = new Audio('assets/tick.mp3');

const COLORS = [
	['#00A1FE'], // can add two colors for gradients
	'#1EE5CE', 
	'#60D838',
	'#F9E231',
	'#FF634D',
	'#EE5FA7',
	// '#0376BB',
	// '#05A89D',
	// '#1EB100',
	// '#F7BA00',
	// '#ED230D',
	// '#CA2A7A',
]

const TASKS = [
	'Make lunch',
	'Make bed',
	'Clean living room',
	'Clean bedroom',
	'Wipe counters',
	'Recycling',
	'Wipe table',
	'Put away dishes',
	'Laundry',
	'Clean entry',
	'Water plants',
	'Clean bathroom mirror',
	'Clean bathroom sink',
	'Clean toilet',
	'Pick up toys',
	'Clean closet',
	'Sweep kitchen',
]


const wheelContainer = document.getElementById('wheel');
const spinButton = document.getElementById('spin-button');
const resetButton = document.getElementById('reset-button');
const powerSlider = document.getElementById('power-slider');
const powerValue = document.getElementById('power-value');
const subheader = document.getElementById('subheader');

let colorIndex = 0,
	wheelPower = 1,
	wheelSpinning = false,
	wheel;
	
	
function getUsedTasks () {
		
	let data = localStorage.getItem(CACHE_NAME);

	if (data && data.length) {
		return JSON.parse(data);
	} else {
		return []
	}

}

function saveUsedTask (task) {

	let tasks = getUsedTasks();

	if (tasks.length === TASKS.length - MIN_TASKS) {
		localStorage.setItem(CACHE_NAME, JSON.stringify([]) );
	} else {
		tasks.push(task)
		localStorage.setItem(CACHE_NAME, JSON.stringify(tasks) );
	}


}

function playSound() {
	// function soundEndedHandler () {
	// 	CLICK_SOUND.removeEventListener('ended', soundEndedHandler);
	// 	wheelContainer.classList.remove('spinning');
	// }
	// wheelContainer.classList.add('spinning');
	CLICK_SOUND.pause();
	CLICK_SOUND.currentTime = 0;
	CLICK_SOUND.play();
	// CLICK_SOUND.addEventListener('ended', soundEndedHandler);
}

function updatePower (power) {
	powerValue.textContent = power
	wheelPower = Math.ceil(power/10);
	console.log(powerValue, power, wheelPower);
}

function startSpin() {
	if (wheelSpinning == false) {
		wheel.animation.spins = Math.round(wheelPower * 2);
		wheel.startAnimation();
		wheelSpinning = true;
	}
}

function resetWheel() {
	location.reload();
}

function wheelFinishedHandler(task) {

	saveUsedTask(task.data);
	// wheelContainer.classList.remove('spinning')
	msg = `Your task is: <em>${task.text.toLowerCase()}</em>!`;
	console.log(msg);
	subheader.innerHTML = msg;
	// setTimeout(resetWheel, 2000);
}

function getTasks () {
	let used = getUsedTasks();
	return TASKS.filter( task => !used.includes(task) );
}

// EVENT HANDLERS
function powerSliderChangeEventHandler (e) {
	updatePower(e.target.value);
}

function spinButtonEventHandler (e) {
	e.preventDefault(e);
	startSpin();
}

function resetButtonEventHandler (e) {
	e.preventDefault(e);
	resetWheel();
}

function initLiseners () {
	powerSlider.addEventListener('input', powerSliderChangeEventHandler);
	spinButton.addEventListener('click', spinButtonEventHandler);
	resetButton.addEventListener('click', resetButtonEventHandler);
}

(async function () {


	// let myFont = new FontFace(
	// 	"Fredoka One",
	// 	"url(https://fonts.gstatic.com/s/fredokaone/v8/k3kUo8kEI-tA1RRcTZGmTlHGCaen8wf-.woff2)"
	// );

	// let font = await myFont.load()

	// document.fonts.add(font);
	
	const tasks = getTasks();

	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	const canvasCenter = canvas.height / 2;

	wheel = new Winwheel({
		outerRadius: 400, // Set outer radius so wheel fits inside the background.
		innerRadius: 5, // Make wheel hollow so segments don't go all way to center.
		textFontSize: 25, // Set default font size for the segments.
		textFontFamily: 'Impact',
		textOrientation: 'vertical', // Make text vertial so goes down from the outside of wheel.
		textAlignment: 'outer', // Align text to outside of wheel.
		numSegments: tasks.length, // Specify number of segments.
		segments: tasks.map( (task, i) => {

			let radGradient,
				color = COLORS[colorIndex];

			if (Array.isArray(color)) {

				if (color.length > 1) {
					radGradient = ctx.createRadialGradient(canvasCenter, canvasCenter, 0, canvasCenter, canvasCenter, canvas.height*.5);
					radGradient.addColorStop(0, color[0]);
					radGradient.addColorStop(1, color[1]);
				} else {
					color = COLORS[0];
				}

			}
	
			let data = {
				fillStyle: radGradient || color,
				// fillStyle: COLORS[colorIndex],
				data: task,
				text: task.toUpperCase(),
				textFillStyle: '#FFF',
				textFontFamily: 'Arial',
			};
	
			if (task.length > 12) {
				data.textFontSize = 19;
			}
	
			colorIndex = colorIndex >= COLORS.length-1 ? 0 : colorIndex+1
	
			return data;
	
		}),
		animation: {
			type: 'spinToStop',
			duration: 10, // Duration in seconds.
			spins: 3, // Default number of complete spins.
			callbackFinished: wheelFinishedHandler,
			callbackSound: playSound, // Function to call when the tick sound is to be triggered.
			soundTrigger: 'pin' // Specify pins are to trigger the sound, the other option is 'segment'.
		},
		pins: {
			number: tasks.length,
			fillStyle: '#000',
			outerRadius: 2,
		}
	});	
	
	initLiseners();
	
	// document.getElementById('pw1').click();

})();
