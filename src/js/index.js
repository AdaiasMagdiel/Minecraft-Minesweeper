class Minesweeper {
	constructor() {
		this.canvas = document.querySelector('#board');
		let chance = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
		this.mines = this.generateMines(chance);
		this.board = this.generateBoard();
		this.gameStart = true;
		this.audio = this.createAudio();
	}
	restartButton() {
		document
			.querySelector('button#restart')
			.addEventListener('click', () => {
				location.reload();
			});
	}
	createImage(x, y) {
		let explosion = new Image(40, 40);
		explosion.src = 'src/images/explosion.gif';
		explosion.classList.add('move');
		explosion.style.top = `${x}px`;
		explosion.style.left = `${y}px`;
		document.body.appendChild(explosion);

		setTimeout(function() {
			document.body.removeChild(explosion);
		}, 2000);
	}
	createAudio() {
		let click = document.querySelector('audio#click');
		let explosion = document.querySelector('audio#explosion');

		return {
			click,
			explosion,
		};
	}
	generateMines(quantity) {
		let mines = [];

		while (mines.length !== quantity) {
			let mine1 = Math.floor(Math.random() * 10);
			let mine2 = Math.floor(Math.random() * 10);

			mines.push([mine1, mine2]);
			mines = mines.filter(value => {
				return value !== [mine1, mine2];
			});
		}

		return mines;
	}
	checkNextsFields() {
		for (let row = 0, rows = this.board.length; row < rows; row++) {
			for (
				let col = 0, cols = this.board[row].length;
				col < cols;
				col++
			) {
				if (
					this.board[row - 1] &&
					this.board[row - 1][col - 1] &&
					this.board[row - 1][col - 1] === 'x' &&
					this.board[row][col] !== 'x'
				) {
					this.board[row][col]++;
				}
				if (
					this.board[row - 1] &&
					this.board[row - 1][col] &&
					this.board[row - 1][col] === 'x' &&
					this.board[row][col] !== 'x'
				) {
					this.board[row][col]++;
				}
				if (
					this.board[row - 1] &&
					this.board[row - 1][col + 1] &&
					this.board[row - 1][col + 1] === 'x' &&
					this.board[row][col] !== 'x'
				) {
					this.board[row][col]++;
				}

				if (
					this.board[row] &&
					this.board[row][col - 1] &&
					this.board[row][col - 1] === 'x' &&
					this.board[row][col] !== 'x'
				) {
					this.board[row][col]++;
				}
				if (
					this.board[row] &&
					this.board[row][col + 1] &&
					this.board[row][col + 1] === 'x' &&
					this.board[row][col] !== 'x'
				) {
					this.board[row][col]++;
				}

				if (
					this.board[row + 1] &&
					this.board[row + 1][col - 1] &&
					this.board[row + 1][col - 1] === 'x' &&
					this.board[row][col] !== 'x'
				) {
					this.board[row][col]++;
				}
				if (
					this.board[row + 1] &&
					this.board[row + 1][col] &&
					this.board[row + 1][col] === 'x' &&
					this.board[row][col] !== 'x'
				) {
					this.board[row][col]++;
				}
				if (
					this.board[row + 1] &&
					this.board[row + 1][col + 1] &&
					this.board[row + 1][col + 1] === 'x' &&
					this.board[row][col] !== 'x'
				) {
					this.board[row][col]++;
				}
			}
		}
	}
	generateBoard() {
		let board = [];

		for (let row = 0; row < 10; row++) {
			board[row] = [];
			for (let col = 0; col < 10; col++) {
				if (
					this.mines
						.map(mine => JSON.stringify(mine))
						.includes(`[${row},${col}]`)
				) {
					board[row][col] = 'x';
				} else {
					board[row][col] = 0;
				}
			}
		}

		return board;
	}
	checkField = e => {
		this.audio.click.currentTime = 0;
		this.audio.click.play();

		let field = e.currentTarget;
		field.classList.remove('closed');

		if (e.currentTarget.children[0].innerText === 'x') {
			this.audio.explosion.currentTime = 3;
			this.audio.explosion.play();
			this.createImage(e.clientY - 20, e.clientX - 20);
			document.querySelector('div.msg').classList.add('show');
			document.querySelector('div.msg p').innerText = 'Você perdeu!';
			let divs = document.querySelectorAll('div#board > div');

			for (let i = 0, len = divs.length; i < len; i++) {
				let timed = setInterval(() => {
					divs[i].classList.remove('closed');
				}, 5 * i);

				if (i === len - 1) {
					divs[i].classList.remove('closed');
					clearInterval(timed);
				}
			}
		}

		if (
			document.querySelectorAll('div.closed').length === this.mines.length
		) {
			document.querySelector('div.msg').classList.add('show');
			document.querySelector('div.msg p').innerText =
				'Parabéns, você ganhou!';

			let divs = document.querySelectorAll('div#board > div');

			for (let i = 0, len = divs.length; i < len; i++) {
				let timed = setInterval(() => {
					divs[i].classList.remove('closed');
				}, 5 * i);

				if (i === len - 1) {
					divs[i].classList.remove('closed');
					clearInterval(timed);
				}
			}
		}
	};
	drawBoard = () => {
		this.board.forEach(row => {
			row.forEach(col => {
				let div = document.createElement('div');
				let p = document.createElement('p');

				if (col === 'x') {
					p.innerText = col;
					p.classList.add('bomb');
				} else {
					p.innerText = col;
				}

				div.classList.add('closed');
				div.addEventListener('click', this.checkField);

				div.appendChild(p);
				this.canvas.appendChild(div);
			});
		});
	};
	run() {
		this.restartButton();
		this.checkNextsFields();
		this.drawBoard();
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const minesweeper = new Minesweeper();
	minesweeper.run();
});
