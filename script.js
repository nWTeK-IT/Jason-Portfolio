// Mobile nav toggle (keyboard accessible)
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');

if (navToggle && primaryNav) {
	function setNav(open) {
		navToggle.setAttribute('aria-expanded', String(open));
		primaryNav.classList.toggle('show', open);
		primaryNav.setAttribute('aria-hidden', String(!open));
		if (open) primaryNav.querySelector('a')?.focus();
	}

	navToggle.addEventListener('click', () => setNav(primaryNav.classList.contains('show') === false));

	navToggle.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			setNav(primaryNav.classList.contains('show') === false);
		}
	});

	// Close nav with Escape
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && primaryNav.classList.contains('show')) {
			setNav(false);
			navToggle.focus();
		}
	});
}

// Contact form validation
const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');
const formSuccess = document.getElementById('form-success');

function showError(el, msg) {
	if (!el) return;
	el.textContent = msg;
}

function clearError(el) {
	if (!el) return;
	el.textContent = '';
}

function validateEmail(value) {
	// simple email check
	return /\S+@\S+\.\S+/.test(value);
}

if (form) {
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		let valid = true;
		clearError(nameError);
		clearError(emailError);
		clearError(messageError);
		formSuccess.textContent = '';

		if (!nameInput.value.trim()) {
			showError(nameError, 'Please enter your name.');
			nameInput.setAttribute('aria-invalid', 'true');
			valid = false;
		} else {
			nameInput.removeAttribute('aria-invalid');
		}

		if (!emailInput.value.trim()) {
			showError(emailError, 'Please enter your email.');
			emailInput.setAttribute('aria-invalid', 'true');
			valid = false;
		} else if (!validateEmail(emailInput.value.trim())) {
			showError(emailError, 'Please enter a valid email address.');
			emailInput.setAttribute('aria-invalid', 'true');
			valid = false;
		} else {
			emailInput.removeAttribute('aria-invalid');
		}

		// message is optional but show a short warning if too short
		if (messageInput.value && messageInput.value.trim().length < 5) {
			showError(messageError, 'Message is too short.');
			messageInput.setAttribute('aria-invalid', 'true');
			valid = false;
		} else {
			messageInput.removeAttribute('aria-invalid');
		}

		if (!valid) {
			// focus first invalid
			const firstInvalid = form.querySelector('[aria-invalid="true"]');
			firstInvalid?.focus();
			return;
		}

		// Simulate successful submission (since no backend)
		formSuccess.textContent = 'Message sent — thank you!';
		form.reset();
	});

	// Clear field errors on input
	[[nameInput, nameError], [emailInput, emailError], [messageInput, messageError]].forEach(([input, err]) => {
		input.addEventListener('input', () => {
			clearError(err);
			input.removeAttribute('aria-invalid');
			formSuccess.textContent = '';
		});
	});
}

// Optional: fetch a fun piece of advice from public API
const adviceBtn = document.getElementById('fetch-advice');
const adviceOutput = document.getElementById('advice-output');

async function fetchAdvice() {
	if (!adviceOutput) return;
	adviceOutput.textContent = 'Loading...';
	try {
		const res = await fetch('https://api.adviceslip.com/advice');
		if (!res.ok) throw new Error('Network response was not ok');
		const data = await res.json();
		adviceOutput.textContent = data?.slip?.advice || 'No advice found.';
	} catch (err) {
		adviceOutput.textContent = 'Could not load advice. Please try again later.';
		console.error(err);
	}
}

if (adviceBtn) {
	adviceBtn.addEventListener('click', fetchAdvice);
	adviceBtn.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			fetchAdvice();
		}
	});
}

// ---- Additional interactions to meet new requirements ----

// 1) Button changes content
const changeTextBtn = document.getElementById('change-text-btn');
const dynamicText = document.getElementById('dynamic-text');
if (changeTextBtn && dynamicText) {
	changeTextBtn.addEventListener('click', () => {
		dynamicText.textContent = 'Text updated! You clicked the button.';
	});
}

// 2) Style changes on input (live color preview)
const colorPicker = document.getElementById('color-picker');
const colorPreview = document.getElementById('color-preview');
if (colorPicker && colorPreview) {
	// update preview instantly while the user interacts
	colorPicker.addEventListener('input', (e) => {
		const color = e.target.value;
		colorPreview.style.backgroundColor = color;
		// ensure preview text remains readable by toggling text color
		const dark = (parseInt(color.slice(1), 16) < 0xffffff / 2);
		colorPreview.style.color = dark ? '#fff' : '#000';
	});
}

// 3) Dynamic list: add items (createElement + appendChild) and remove
const addItemBtn = document.getElementById('add-item');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');

function createListItem(text) {
	const li = document.createElement('li');
	li.textContent = text + ' ';

	const removeBtn = document.createElement('button');
	removeBtn.type = 'button';
	removeBtn.textContent = 'Remove';
	removeBtn.addEventListener('click', () => {
		li.remove();
	});

	li.appendChild(removeBtn);
	return li;
}

if (addItemBtn && itemInput && itemList) {
	addItemBtn.addEventListener('click', () => {
		const value = itemInput.value.trim();
		if (!value) return;
		const li = createListItem(value);
		itemList.appendChild(li);
		itemInput.value = '';
		itemInput.focus();
	});

	// Also allow Enter key on the input to add
	itemInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addItemBtn.click();
		}
	});
}


