//  Разрешенные клавиши
const AllowedKey = {
	Ctrl: "1",
	c: "2",
	v: "3",
};

// Связь клавиши с элементов Html виртуальной клавиатуры, {ИмяСимвола:HtmlЭлемент}
let MappingKeyFromHtmlKeyboard = {};

// Структура для хранения выбранной конфигурации горячих клавиш, в основном нужна для того чтобы хранить вложенные комбинации клавиш
let TakeHotKey = {};

// Все комбинации клавиш {'ИмяПрограммы':{'МестоВ_Программе':{'КомбинацииКлавиш':'ОписаниеКомбинации'}}}
let HotKeyDict = {
	// В какой программе
	vscode: {
		// В каком месте программы
		Редактор: {
			// Комбинация клавиш: Описание комбинации
			// Комбинация указывается слева на право через знак плюс
			"Ctrl_l + c":
				"Копировать выделенный текст, если не выделен текст то копировать вю строку",
			"Ctrl_R + v": "Вставить тест",
		},
		Поиск: {
			"Ctrl_l + l": "Выделить все найденное",
		},
	},
	pycharm: {
		РедакторКода: {
			"Ctrl_r + c": "Копировать выделенный текст",
			"Ctrl_r + v": "Вставить тест",
			f: "Поиск",
			"Ctrl_r + shift + f": "Поиск во всем проекте",
		},
	},
	warno: {
		игра: {
			"ctrl_r+g": "Группировать отряды",
			F: "Быстрый марш",
			T: "Огонь",
			spase: "Вкл/Выкл Пауза",
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
	static list_to_nested_dict(_dict, _list, _next_index = 0) {
		// Функция для вставки в списка в словарь, кратко говоря элементы списка станут ключами словаря
		/*
        ::IN:::::::::::::::::::::::::::::::::::::::::::::::::
    
        x = ["ctrl_R", "shift", "g", "ctrl_l", "f"];
        x2 = ["ctrl_R", "shift", "l"];
    
        let ar = {
            ctrl_l: {
                shift: {
                    l: {},
                },
                ctrl_l: {
                    f: {},
                },
            },
            ctrl_R: {
                shift: {
                },
            },
        };
    
        let ar2 = list_to_nested_dict(ar, x);
        let ar3 = list_to_nested_dict(ar2, x2);
    
        ::OUT:::::::::::::::::::::::::::::::::::::::::::::::::
    
        {
            "ctrl_l": {
                "shift": {
                    "l": {}
                },
                "ctrl_l": {
                    "f": {}
                }
            },
            "ctrl_R": {
                "shift": {
                "g": {
                    "ctrl_l": {
                        "f": {}
                    }
                },
                "l": {}
                }
            }
        }
        
        */
		let nv = _dict[_list[_next_index]];
		// Добавляем элементы в словарь пока в списке есть значения
		if (nv !== undefined) {
			this.list_to_nested_dict(nv, _list, _next_index + 1);
		} else {
			// Если словарь закончился, а в списке еще есть элементы, то продолжаем добавлять элементы в словарь
			if (_list.length - 1 >= _next_index) {
				_dict[_list[_next_index]] = {};
				nv = _dict[_list[_next_index]];
				this.list_to_nested_dict(nv, _list, _next_index + 1);
			}
		}
		return _dict;
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

class VirtualHotKey {
	static ClearTakeKey() {
		// Убрать выбор со всех клавиш виртуальной клавиатуры
		console.log("ClearTakeKey");
		for (let x of this.get_all_key()) {
			let elm = x.parentNode;
			elm.classList.remove("take-key");
		}
	}

	static AgainShowTakeKeyboard(list_hot_key) {
		// Показать комбинации клавиш на вириальной клавиатуре, в зависимости от выбранной программы и места использования
		// list_hot_key: HotKeyDict[select_program][select_place]
		// !!
		console.log("AgainShowKeyboard");
		// Отчищаем предыдущие занятые клавиши
		VirtualHotKey.ClearTakeKey();
		for (let x of Object.keys(list_hot_key)) {
			// Переводим комбинацию клавиш в стандартный тип
			x = ParseHotKey._BaseParse(x);
			console.log(x);
			// Заносим комбинацию в структуру, для дальнейше логики вложенных комбинации клавиш
			TakeHotKey = Utils.list_to_nested_dict(TakeHotKey, x);
			// Выделяем первые клавиши из комбинации
			let elm = MappingKeyFromHtmlKeyboard[x[0]];
			console.log(elm);

			// Условие для простых комбинаций клавиш, состоящие из одного символа
			if (x.length == 1) {
				elm.parentElement.classList.add("take-key");
			}
			// Условие для вложенных комбинаций клавиш, например `CTRL_L+SHIFT+C`
			else if (x.length > 1) {
				elm.parentElement.classList.add("take-nested-key");
			}
		}
	}
	static _ShowClickKey(event) {
		// Показать вложенные комбинации клавиш, например Ctrl_L+C
		// !!
		console.log("_ShowDepHotKey");
		let elm = event.target;
		// Если это вложенная комбинация клавиш
		if (elm.parentElement.classList.contains("take-nested-key")) {
			elm.parentNode.classList.toggle("press_key");
			// --------------------------
			let list_key = TakeHotKey[ParseHotKey._BaseParse(event.target.value)];
			for (let x in list_key) {
				console.log(x);
				console.log(list_key[x]);
				if (Object.keys(list_key[x]).length > 0) {
					console.log("!!");
				} else {
				}
			}
			// --------------------------
		}
	}

	static _addEventClickKey() {
		for (let x of this.get_all_key()) {
			x.addEventListener("click", this._ShowClickKey);
		}
	}

	static get_all_key() {
		// Получить все клавиши
		return document.querySelectorAll(
			'#keboard .hrow .key input[type="button"]'
		);
	}
	static _BuildMappingKeyFromHtmlKeyboard() {
		// Собрать структуру данных MappingKeyFromHtmlKeyboard
		console.log(MappingKeyFromHtmlKeyboard);
		// Получаем все клавиши из виртуальной клавиатуры
		let all_key = VirtualHotKey.get_all_key();
		// Заполняем MappingKeyFromHtmlKeyboard значениями из виртуальной клавиатуры
		for (let x of all_key) {
			console.log(`${x.value}: ${x}`);
			MappingKeyFromHtmlKeyboard[x.value.toUpperCase()] = x;
		}
	}
	static init() {
		this._addEventClickKey();
		this._BuildMappingKeyFromHtmlKeyboard();
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
		let list_hot_key = this._BaseParse(text);
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
			// Отобразить комбинации клавиш на виртуальной клавиатуре
			VirtualHotKey.AgainShowTakeKeyboard(list_hot_key);
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
			// Переключить радио кнопку
			elm_hot_key[0].getElementsByTagName("input")[0].checked = true;
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
	// ParseHotKey.init();
	VirtualHotKey.init();
	UserSelect.init();
	ListHotKey.init();
}
main();
// -------------------------------------------------------------- //
