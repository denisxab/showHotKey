//  Разрешенные клавиши
const AllowedKey = {
	Ctrl: "1",
	c: "2",
	v: "3",
};

// Все комбинации клавиш
let HotKeyDict = {
	// В какой программе
	vscode: {
		// В каком месте программы
		Редактор: {
			// Комбинация клавиш: Описание комбинации
			// Комбинация указывается слева на право через знак плюс
			"Ctrl + c":
				"Копировать выделенный текст, если не выделен текст то копировать вю строку",
			"Ctrl + v": "Вставить тест",
		},
		Поиск: {
			"Ctrl + l": "Выделить все найденное",
		},
	},
	pycharm: {
		РедакторКода: {
			"Ctrl + c": "Копировать выделенный текст",
			"Ctrl + v": "Вставить тест",
			"Ctrl + f": "Поиск",
			"Ctrl + shift + f": "Поиск во всем проекте",
		},
	},
};

// -------------------------------------------------------------- //
class Utils {
	// Класс с универсальными утилитами
	static removeOptions(selectElement, end = 1) {
		// Отчистить `selected` от `options`, по умолчанию оставляем самый первый элемент
		var i,
			L = selectElement.options.length - 1;
		for (i = L; i >= end; i--) {
			selectElement.remove(i);
		}
	}
}

class UserSelect {
	static SelectProgram() {
		// Получить `индекс,текст` выбранной программы
		let elm = document.getElementById("select-program");
		if (elm.selectedIndex <= 0) {
			// Исключаем значение по умолчанию
			return null;
		}
		return [elm.selectedOptions[0].index, elm.selectedOptions[0].text];
	}
	static SelectPlace() {
		// Получить `индекс,текст` выбранного места
		let elm = document.getElementById("select-place");
		if (elm.selectedIndex <= 0) {
			// Исключаем значение по умолчанию
			return null;
		}
		return [elm.selectedOptions[0].index, elm.selectedOptions[0].text];
	}
	static BuildSelectProgram() {
		// Заполнить список программ на основе HotKeyDict
		let start = 0;
		let end = Object.keys(HotKeyDict).length - 1;
		let elm_program = document.getElementById("select-program");
		for (let i = start; i <= end; i++) {
			let opt = document.createElement("option");
			opt.innerHTML = Object.keys(HotKeyDict)[i];
			elm_program.appendChild(opt);
		}
	}
	static BuildSelectPlace() {
		// Заполнить список программ на основе HotKeyDict и выбранной программы
		console.log("BuildSelectPlace");
		// Отчистить прошлые значения от предыдущей программы
		Utils.removeOptions(document.getElementById("select-place"));
		// Выбранная программа
		let select_program = UserSelect.SelectProgram()[1];
		let start = 0;
		let end = Object.keys(HotKeyDict[select_program]).length - 1;
		let elm_place = document.getElementById("select-place");
		for (let i = start; i <= end; i++) {
			let opt = document.createElement("option");
			opt.innerHTML = Object.keys(HotKeyDict[select_program])[i];
			elm_place.appendChild(opt);
		}
	}
	static _addEventProgramSelect() {
		// Добавить обработку событий выбора программы
		console.log("_addEventProgramSelect");
		document
			.getElementById("select-program")
			.addEventListener("change", this.BuildSelectPlace);
	}
	static _addEventPlaceSelect() {
		// Добавить обработку событий выбора места в программе
		console.log("_addEventPlaceSelect");
		document
			.getElementById("select-place")
			.addEventListener("change", ListHotKey.AgainShowListHotKey);
	}
	static init() {
		// Заполнить список программ на основе HotKeyDict
		this.BuildSelectProgram();
		// Добавляем обработчик событий на выбор программы
		this._addEventProgramSelect();
		this._addEventPlaceSelect();
	}
}

class ParseHotKey {
	// Класс нужный для парсинга и конвертации горячих клавиш
	static _BaseParse(text) {
        // Базовые преобразования текста с гончими клавишами
		return text.toUpperCase().split(/[ \t]*\+[ \t]*/);
	}

	static toSelfKeyboard(text) {
		// Конвертировать строку с горячей клавишей в список элементов вириальной клавиатур ы на странице
		console.log(`toSelfKeyboard: ${text}`);
		let list_hot_key = this._BaseParse(text)
		console.log(list_hot_key);
		return list_hot_key;
	}
}

class ListHotKey {
	// Список с комбинациями клавиш, в зависимости от выбранной программы и места использования
	static _ClearList() {
		// Отчистить список с комбинациями клавиш
		let elm = document.getElementById("list_hot_key");
		elm.innerHTML = "";
	}
	static AgainShowListHotKey() {
		// Показать список горячих клавиш для выбранной программы и места
		console.log("AgainShowListHotKey");
		// Отчищаем список от прошлых горячих клавиш
		ListHotKey._ClearList();
		// Выбранная программа
		let select_program = UserSelect.SelectProgram();
		let select_place = UserSelect.SelectPlace();
		if ((select_program !== null) & (select_place !== null)) {
			// Если не null то берем нормальные значения
			select_program = select_program[1];
			select_place = select_place[1];
			let start = 0;
			// Список горячих клавиш
			let list_hot_key = HotKeyDict[select_program][select_place];
			let end = Object.keys(list_hot_key).length - 1;
			// Создаем элемент для хранения комбинации клавиш
			let elm_place = document.getElementById("list_hot_key");
			for (let i = start; i <= end; i++) {
				let div = document.createElement("div");
				div.className = "list_hot_key_radio";
				div.innerHTML = `
                <div class="radio_hot_key">
                    <input type="radio" name="nradio" checked>${
											Object.keys(list_hot_key)[i]
										}</input>
                </div>
                <div class="radio_info">
                    ${Object.values(list_hot_key)[i]}    
                </div>
                `;
				elm_place.appendChild(div);
			}
		}
	}
	static _SelectHotKey(event) {
		// Обработать нажатие на элемент их списка горячих клавиш
		console.log("SelectHotKey");
		console.log(event);
		// Это будет класс list_hot_key_radio
		let elm = event.target.parentElement;
		if (elm.classList.contains("list_hot_key_radio")) {
			// Получаем элемент с имением горячею клавиши, на которую нажали мышкой
			let elm_hot_key = elm.getElementsByClassName("radio_hot_key");
			console.log(elm_hot_key);
			// Получаем текст горячей клавиши
			let elm_hot_key_text = elm_hot_key[0].innerText;
			ParseHotKey.toSelfKeyboard(elm_hot_key_text);
		}
	}

	static _addEventClickElmHotKey() {
		// Добавить обработку событий выбора места в программе
		console.log("_addEventClickElmHotKey");
		document
			.getElementById("list_hot_key")
			.addEventListener("click", this._SelectHotKey);
	}
	static init() {
		this.AgainShowListHotKey();
		this._addEventClickElmHotKey();
	}
}

// -------------------------------------------------------------- //
function main() {
	UserSelect.init();
	ListHotKey.init();
}
main();
// -------------------------------------------------------------- //
