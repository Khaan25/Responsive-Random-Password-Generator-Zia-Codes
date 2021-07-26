// CLEAR CONSOLE ON EVERY REFRESH
console.clear()

// RANGE SLIDER PROPERTIES
// FILL => TRAILING COLOR
// BACKGORUND => DEFAULT RANGE SLIDER BACKGROUND COLOR
const silderProps = {
	fill: 'hsl(var(--hue-color), 91%, 46%)',
	background: 'hsla(var(--hue-color), 0%, 100%, .214)',
},
	// SELECTING RANGE SLIDER CONTAINER WHICH WILL AFFECT THE LENGTH PROPERTY OF PASSWORD
	slider = document.querySelector('.range__slider'),
	sliderValue = document.querySelector('.length__title') // TEXT WO:: SHOW THE VALUE OF RANGE SLIDER

slider.querySelector('input').addEventListener('input', event => {
	sliderValue.setAttribute('data-length', event.target.value)
	applyFill(event.target)
})
// SELECTING RANGE INPUT & PASSSING T IN APPLYFILL
applyFill(slider.querySelector('input'))
// RESPONSIBLE FOR CREATING TRAILING COLOR AND SETTING FILL
function applyFill(slider) {
	const percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min),
		bg = `linear-gradient(90deg, ${silderProps.fill} ${percentage}%, ${silderProps.background} ${percentage + 0.1}%)`
	slider.style.background = bg
	sliderValue.setAttribute('data-length', slider.value)
}

// OBEJECT OF ALL FUNCTIONS THAT WE WILL USES TO CREATE RANDOM LETTERSS OF PASSWORD
const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol,
}

// RANDOM MORE SECURE VALUE
function secureMathRandom() {
	return window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1)
}

// GENERATOR FUNCTIONS (RESPSONSIBLE TO RETURN VALIE THAT WILL BE USED TO CREATE PASSWORD)
function getRandomLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
}
function getRandomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}
function getRandomNumber() {
	return String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48)
}
function getRandomSymbol() {
	const symbols = '~!@#$%^&*()_+{}":?><;.,'
	return symbols[Math.floor(Math.random() * symbols.length)]
}

// VIEWBOX (RESULT WILL BE SHOWN)
const resultEl = document.getElementById('result'),
	// INPUT SLIDER (CHANGE THE LENGTH OF THE PASSWORD)
	lengthEl = document.getElementById('slider'),
	// CHECKBOXES REPRESENTING THE OPTIONS THAT IS RESPONSIBLE TO CREATE DIFFERENT TYPE OF PASSWORD BASED ON USER
	uppercaseEl = document.getElementById('uppercase'),
	lowercaseEl = document.getElementById('lowercase'),
	numberEl = document.getElementById('number'),
	symbolEl = document.getElementById('symbol'),
	// BUTTON TO GENERATE PASSWORD
	generateBtn = document.getElementById('generate'),
	// BUTTON TO COPY THE PASSWORD
	copyBtn = document.getElementById('copyBtn'),
	// RESULT VIEWBOX CONTAINER
	resultContainer = document.querySelector('.result'),
	// TEXT INFO SHOWN AFTER THE GENERATE BUTTON IS CLICKED
	copyInfo = document.querySelector('.result__info.right'),
	// TEXT APPEAR AFTER THE COPY BUTTON IS CLICKED
	copiedInfo = document.querySelector('.result__info.left')

// IF THIS VARIABLE IS TRUE THEN COPY BUTTON WILL APPEAR (OR SHOULD CLICK IT FIRSTLY)
let generatedPassword = false

// UPDATE THE CSS PROPS oF COPY BUTTON
// GETTING THE BOUNDS OF RESULT VIEWBOX CONTAINER
let resultContainerBound = {
	left: resultContainer.getBoundingClientRect().left,
	top: resultContainer.getBoundingClientRect().top,
}

// UPDATE THE POSITION OF THE COPY BUTTON BASE ON MOUSE MOVEMENTS
resultContainer.addEventListener('mousemove', e => {
	resultContainerBound = {
		left: resultContainer.getBoundingClientRect().left,
		top: resultContainer.getBoundingClientRect().top,
	}
	if (generatedPassword) {
		copyBtn.style.opacity = '1'
		copyBtn.style.pointerEvents = 'all'
		copyBtn.style.setProperty('--x', `${e.x - resultContainerBound.left}px`)
		copyBtn.style.setProperty('--y', `${e.y - resultContainerBound.top}px`)
	} else {
		copyBtn.style.opacity = '0'
		copyBtn.style.pointerEvents = 'none'
	}
})
window.addEventListener('resize', e => {
	resultContainerBound = {
		left: resultContainer.getBoundingClientRect().left,
		top: resultContainer.getBoundingClientRect().top,
	}
})

// COPY TO CLIPBOARD
copyBtn.addEventListener('click', () => {
	const txtArea = document.createElement('textarea'),
		password = resultEl.innerText
	if (!password || password == 'CLICK GENERATE') {
		return
	}
	txtArea.value = password
	document.body.appendChild(txtArea)
	txtArea.select()
	document.execCommand('copy')
	txtArea.remove()

	copyInfo.style.transform = 'translateY(200%)'
	copyInfo.style.opacity = '0'
	copiedInfo.style.transform = 'translateY(0%)'
	copiedInfo.style.opacity = '0.75'
})

// WHEN GENERATE IS CLICKED PASSWORD ID GENERATED
generateBtn.addEventListener('click', () => {
	const lenght = +lengthEl.value,
		hasLower = lowercaseEl.checked,
		hasUpper = uppercaseEl.checked,
		hasNumber = numberEl.checked,
		hasSymbol = symbolEl.checked
	generatedPassword = true
	resultEl.innerText = generatePassword(lenght, hasLower, hasUpper, hasNumber, hasSymbol)
	copyInfo.style.transform = 'translateY(0%)'
	copyInfo.style.opacity = '0.75'
	copiedInfo.style.transform = 'translateY(200%)'
	copiedInfo.style.opacity = '0'
})

// FUNCTION RESPONSIBLE TO GENERATE PASSWORD & RETURNING IT
function generatePassword(length, lower, upper, number, symbol) {
	let generatedPassword = ''
	const typesCount = lower + upper + number + symbol
	const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0])
	if (typesCount === 0) {
		return ''
	}
	for (let i = 0; i < length; i++) {
		typesArr.forEach(type => {
			const funcName = Object.keys(type)[0]
			generatedPassword += randomFunc[funcName]()
		})
	}
	return generatedPassword.slice(0, length)
		.split('').sort(() => Math.random() - 0.5)
		.join('')
}

// FUNCTION THAT ENSURES THAT ATLEAST ONE CHECKBOX IS SELECTED (LAST CHECKBOX WILL BE DISABLED)
function disableOnlyCheckBox() {
	let totalChecked = [uppercaseEl, lowercaseEl, numberEl, symbolEl].filter(el => el.checked)
	totalChecked.forEach(el => {
		if (totalChecked.length == 1) {
			el.disabled = true
		} else {
			el.disabled = false
		}
	})
}

[uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
	el.addEventListener('click', () => {
		disableOnlyCheckBox()
	})
})