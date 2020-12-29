const BUTTONS = document.querySelector(`#btns`);
const INPUT = document.querySelector(`#input`);
const OUTPUT = document.querySelector(`#output`);
const BTNLIST = [
	`1`,
	`2`,
	`3`,
	`4`,
	`5`,
	`6`,
	`7`,
	`8`,
	`9`,
	`0`,
	`decimal`,
	`add`,
	`subtract`,
	`multiply`,
	`divide`,
	`power`,
	`backspace`,
	`equals`,
	`openbracket`,
	`closebracket`,
];

for (let button of BTNLIST) {
	let btnObject = document.createElement(`div`);
	btnObject.setAttribute(`id`, `b${button}`);
	btnObject.classList.add(`button`);
	btnObject.classList.add(`transition`);
	btnObject.textContent = btnObject.getAttribute(`id`).slice(-1);
	BUTTONS.appendChild(btnObject);
}

let replaceText = (before, after) => {
	document.querySelector(`#b${before}`).textContent = after;
};

replaceText(`decimal`, `.`);
replaceText(`add`, `+`);
replaceText(`subtract`, `-`);
replaceText(`multiply`, `x`);
replaceText(`divide`, `/`);
replaceText(`power`, `^`);
replaceText(`equals`, `=`);
replaceText(`openbracket`, `(`);
replaceText(`closebracket`, `)`);
replaceText(`backspace`, `<`);

const BTNITEM = document.querySelectorAll(`.button`);
let md, ts;
for (let button of BTNITEM) {
	let rgx1 = /^[0-9\(\)\.]+$/;
	if (rgx1.test(button.textContent)) {
		button.addEventListener(`click`, () => {
			INPUT.value = INPUT.value + button.textContent;
			INPUT.focus();
		});
	}
	let rgx2 = /^[x\+\-\/\^]$/;
	if (rgx2.test(button.textContent)) {
		button.addEventListener(`click`, () => {
			if (!rgx2.test(INPUT.value.slice(-2, -1))) {
				INPUT.value = INPUT.value + ` ${button.textContent} `;
			} else {
				INPUT.value =
					INPUT.value.slice(0, -3) + ` ${button.textContent} `;
			}
			INPUT.focus();
		});
	}
	let rgx3 = /^[\<]$/;
	if (rgx3.test(button.textContent)) {
		button.addEventListener(`click`, () => {
			if (INPUT.value.slice(-1) == ` `) {
				INPUT.value = INPUT.value.slice(0, -3);
			} else {
				INPUT.value = INPUT.value.slice(0, -1);
			}
			if (INPUT.value.length === 0) OUTPUT.textContent = ``;
			INPUT.focus();
		});
		button.addEventListener(`mousedown`, () => {
			md = setTimeout(() => {
				INPUT.value = "";
				OUTPUT.textContent = "";
			}, 600);
		});
		button.addEventListener(`mouseup`, () => {
			clearTimeout(md);
			md = null;
			INPUT.focus();
		});
		button.addEventListener(`touchstart`, () => {
			ts = setTimeout(() => {
				INPUT.value = "";
				OUTPUT.textContent = "";
			}, 600);
		});
		button.addEventListener(`touchend`, () => {
			clearTimeout(ts);
			ts = null;
			INPUT.focus();
		});
	}
	let rgx4 = /^[\=]$/;
	if (rgx4.test(button.textContent)) {
		button.addEventListener(`click`, () => {
			try {
				let parser = math.parser();
				let calc = parser.evaluate(INPUT.value.replace(/[x]/g, `*`));
				if (typeof calc === "object") {
					OUTPUT.textContent =
						math.round(calc.entries[0] * 1000) / 1000;
				} else if (typeof calc === "number") {
					OUTPUT.textContent = math.round(calc * 1000) / 1000;
				} else {
					OUTPUT.textContent = "Invalid expression!";
				}
				INPUT.focus();
			} catch {
				OUTPUT.textContent = "Invalid expression!";
				INPUT.focus();
			}
		});
	}
}

let tabooKeys = [`Shift`, `Control`, `Command`, `Alt`];
INPUT.addEventListener(`keydown`, (e) => {
	if (e.key === `Enter` || e.key === `=`) {
		try {
			let parser = math.parser();
			let calc = parser.evaluate(INPUT.value.replace(/[x]/g, `*`));
			if (typeof calc === "object") {
				OUTPUT.textContent = math.round(calc.entries[0] * 1000) / 1000;
			} else if (typeof calc === "number") {
				OUTPUT.textContent = math.round(calc * 1000) / 1000;
			} else {
				OUTPUT.textContent = "Invalid expression!";
			}
		} catch {
			OUTPUT.textContent = "Invalid expression!";
		}
	} else if (e.key === `Backspace` || e.key === `Delete`) {
		INPUT.value = INPUT.value.slice(0, -1);
		if (INPUT.value.length === 0) OUTPUT.textContent = ``;
	} else if (!tabooKeys.includes(e.key)) {
		INPUT.value = INPUT.value + e.key;
	}
});

INPUT.addEventListener(`keyup`, (e) => {
	if (e.key === `=`) INPUT.value = INPUT.value.replace(/=/g, ``);
});
