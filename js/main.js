const CACHE_NAME = 'tasks';
const MIN_TASKS = 2;
const CLICK_SOUND = new Audio('assets/tick.mp3');

const powerControlButton = document.querySelectorAll('.power-control');
const spinButton = document.getElementById('spin-button');
const resetButton = document.getElementById('reset-button');

const COLORS = [
	'#00A1FE',
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
	'Walk Stella',
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
]

let colorIndex = 0,
	wheelPower = 0,
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
	CLICK_SOUND.pause();
	CLICK_SOUND.currentTime = 0;
	CLICK_SOUND.play();
}

function powerSelected(powerLevel) {
	// console.log('powerSele', powerLevel);

	if (wheelSpinning == false) {

		powerControlButton[2].classList.remove("pw3");
		powerControlButton[1].classList.remove("pw2");
		powerControlButton[0].classList.remove("pw1");

		if (powerLevel >= 1) {
			powerControlButton[2].className = "pw3";
		}

		if (powerLevel >= 3) {
			powerControlButton[1].className = "pw2";
		}

		if (powerLevel >= 5) {
			powerControlButton[0].className = "pw1";
		}

		wheelPower = powerLevel;

	}
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
	console.log(`Your task this morning is ${task.text.toLowerCase()}!`);
	// setTimeout(resetWheel, 2000);
}

function getTasks () {
	let used = getUsedTasks();
	return TASKS.filter( task => !used.includes(task) );
}

function powerControlEventHandler (e) {
	e.preventDefault(e);
	powerSelected(e.target.dataset.power);
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
	powerControlButton.forEach( (btn) => {
		btn.addEventListener('click', powerControlEventHandler);
	});
	spinButton.addEventListener('click', spinButtonEventHandler);
	resetButton.addEventListener('click', resetButtonEventHandler);
}

(async function () {


	let myFont = new FontFace(
		"Fredoka One",
		"url(https://fonts.gstatic.com/s/fredokaone/v8/k3kUo8kEI-tA1RRcTZGmTlHGCaen8wf-.woff2)"
	);

	let font = await myFont.load()

	document.fonts.add(font);
	
	const tasks = getTasks();
	
	wheel = new Winwheel({
		outerRadius: 400, // Set outer radius so wheel fits inside the background.
		innerRadius: 5, // Make wheel hollow so segments don't go all way to center.
		textFontSize: 25, // Set default font size for the segments.
		textFontFamily: 'Impact',
		textOrientation: 'vertical', // Make text vertial so goes down from the outside of wheel.
		textAlignment: 'outer', // Align text to outside of wheel.
		numSegments: tasks.length, // Specify number of segments.
		segments: tasks.map( (task, i) => {
	
			let data = {
				fillStyle: COLORS[colorIndex],
				data: task,
				text: task.toUpperCase(),
				textFillStyle: '#FFF',
				textFontFamily: 'Fredoka One',
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
			fillStyle: 'silver',
			outerRadius: 3,
		}
	});	
	
	initLiseners();
	
	// document.getElementById('pw1').click();

})();
