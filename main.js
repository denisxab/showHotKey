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

class NestedDict {
	add() {}
	getLast() {}
}

// Структура для хранения навигации во вложенных комбинациях клавиш
let NestedTakeKey = {};

// Список клавиш в навигационной панели
let StackNavKey = {
	// Текущий список с клавишами
	current: [],
	// Список клавиш которые были удалены
	last: [],
};

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
			"Ctrl_r + shift_l + alt_l + f": "Поиск во всем проекте",
			"Ctrl_r + shift_l + c": "Поиск во всем проекте",
			"Ctrl_r + shift_l + d": "Поиск во всем проекте",
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
	static add_nested_dict(_dict, _list, _next_index = 0) {
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
			this.add_nested_dict(nv, _list, _next_index + 1);
		} else {
			// Если словарь закончился, а в списке еще есть элементы, то продолжаем добавлять элементы в словарь
			if (_list.length - 1 >= _next_index) {
				_dict[_list[_next_index]] = {};
				nv = _dict[_list[_next_index]];
				this.add_nested_dict(nv, _list, _next_index + 1);
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

class NavKey {
	static ShowNavKey() {
		const elm = document.getElementById("nav_keboard_date");
		elm.innerText = StackNavKey.current.join("+");
	}
	static addNavKey(val) {
		// Добавить клавишу в навигационную панель
		console.log("addNavKey");
		// Добавляем клавишу в список выбранных, если она еще не добавлена в конец
		if (StackNavKey.current[StackNavKey.current.length - 1] !== val) {
			StackNavKey.current.push(val);
			NavKey.ShowNavKey();
		}
	}
	static popNavKey() {
		// Удалить с конца клавишу в навигационной панели
		console.log("popNavKey");
		// Если в текущей навигации есть клавиша
		if (StackNavKey.current[0] !== undefined) {
			// Удаляем клавишу из текущей навигации, и заносим ей в предыдущие
			StackNavKey.last.push(StackNavKey.current.pop());
			function get_last_key_nested_dict(_dict, _list, _next_index = 0) {
				// Итерируемся по элементам списка `_list` которые являются ключами словаря `_dict`
				// Останавливаемся на последнем ключе `_dict` который есть в `_list`
				let nv = _list[_next_index];
				_next_index += 1;
				if (nv) {
					return get_last_key_nested_dict(_dict[nv], _list, _next_index);
				} else {
					return _dict;
				}
			}
			// Берем предыдущею комбинацию клавиш
			NestedTakeKey = get_last_key_nested_dict(TakeHotKey, StackNavKey.current);
			// Показываем доступные клавиши, для предыдущей комбинации
			VirtualHotKey._ShowClickKey(NestedTakeKey);
			// Показываем текущий путь в навигационную панель клавиш
			NavKey.ShowNavKey();
			//------------------------
		}
	}
	static backNavKey() {
		// Вернуть ранее удаленную клавишу
		// Проверяем на то что есть клавиша которую можно возвращать
		console.log("backNavKey");
		if (StackNavKey.last[0] !== undefined) {
			StackNavKey.current.push(StackNavKey.last.pop());
			NavKey.ShowNavKey();
		}
	}
}

class VirtualHotKey {
	static GetAllKey() {
		// Получить все клавиши с виртуальной клавиатуры
		return document.querySelectorAll(
			'#keboard .hrow .key input[type="button"]'
		);
	}
	static ClearTakeKey() {
		// Убрать выбор со всех клавиш виртуальной клавиатуры
		for (let x of this.GetAllKey()) {
			let elm = x.parentNode;
			elm.classList.remove("take-key");
			elm.classList.remove("take-nested-key");
			elm.classList.remove("press_key");
		}
	}

	static AgainShowTakeKeyboard(list_hot_key) {
		/* 
			Показать комбинации клавиш на вириальной клавиатуре, в зависимости от выбранной программы и места использования
			
			list_hot_key: HotKeyDict[select_program][select_place]
		*/
		// Отчищаем предыдущие занятые клавиши
		VirtualHotKey.ClearTakeKey();
		// Отчищаем словарь занятые комбинации от прошлых
		TakeHotKey = {};
		for (let x of Object.keys(list_hot_key)) {
			// Переводим комбинацию клавиш в стандартный вид
			x = ParseHotKey._BaseParse(x);
			// Заносим комбинацию в структуру в вложенный словарь, для дальнейше логики вложенных комбинации клавиш
			TakeHotKey = Utils.add_nested_dict(TakeHotKey, x);
			// Делаем глубокую копию. Это нужно для навигации во вложенных комбинациях клавиш
			NestedTakeKey = JSON.parse(JSON.stringify(TakeHotKey));
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

	static _ShowClickKey(list_key) {
		// Отчищаем занятые комбинации, будем показывать те комбинации которые доступные через клавишу `elm_value`
		VirtualHotKey.ClearTakeKey();
		for (let x in list_key) {
			console.log(x);
			console.log(list_key[x]);
			let elm_key = MappingKeyFromHtmlKeyboard[x];
			if (Object.keys(list_key[x]).length > 0) {
				// Если это вложенная комбинация клавиш
				elm_key.parentElement.classList.add("take-nested-key");
			} else {
				// Если это одиночный символ
				elm_key.parentElement.classList.add("take-key");
			}
		}
	}

	static _ClickNestedKey(elm) {
		/*
			Обработчик нажатий вложенных клавиш 

			Показать какие занятые  клавиши, для текущей нажатой клавиши. например для комбинации Ctrl_L+C, занятая клавиша будет `C` 
		*/
		// Помечаем нажатую клавишу
		elm.parentNode.classList.toggle("press_key");
		// Получаем стандартизированное название выбранной клавиши
		const elm_value = ParseHotKey._BaseParse(elm.value)[0];
		// Добавляем эту клавишу в навигационную панель
		NavKey.addNavKey(elm_value);
		// Показываем доступные клавиши
		VirtualHotKey._ShowClickKey(
			// Получаем все доступные комбинации клавиши(на одном уровне) для текущей нажатой клавиши.
			NestedTakeKey[elm_value]
		);
		// Переходи на уровень в низ, на те комбинации которые доступны через нажатую клавишу
		NestedTakeKey = NestedTakeKey[elm_value];
	}

	static _ClickKey(event) {
		/* 
			Обработчик нажатие на все клавиши виртуальной клавиатуры. 
		*/
		console.log("_ClickKey");
		let elm = event.target;
		// Если это вложенная клавиша
		if (elm.parentElement.classList.contains("take-nested-key")) {
			VirtualHotKey._ClickNestedKey(elm);
		}
	}

	static _addEventClickKey() {
		// Добавляем обработчик нажатий на клавиши вириальной клавиатуры
		this.GetAllKey().forEach((elm) => {
			elm.addEventListener("click", this._ClickKey);
		});
	}

	static _BuildMappingKeyFromHtmlKeyboard() {
		/*
			Собрать структуру данных MappingKeyFromHtmlKeyboard 
		*/
		// Заполняем MappingKeyFromHtmlKeyboard значениями из виртуальной клавиатуры
		VirtualHotKey.GetAllKey().forEach((elm) => {
			console.log(`${elm.value}: ${elm}`);
			MappingKeyFromHtmlKeyboard[elm.value.toUpperCase()] = elm;
		});
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
