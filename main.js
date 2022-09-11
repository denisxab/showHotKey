// Все комбинации клавиш {'ИмяПрограммы':{'МестоВ_Программе':{'КомбинацииКлавиш':'ОписаниеКомбинации'}}}
let G_HotKeyDict = {
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
			"Ctrl_r +    shift_l + alt_l + f": "Поиск во всем проекте",
			"Ctrl_r + shift_l + Ctrl_l + r": "Поиск во всем проекте",
			"Ctrl_r + shift_l + c": "Поиск во всем проекте",
			"Ctrl_r + shift_l + d": "Поиск во всем проекте",
		},
	},
	warno: {
		игра: {
			"ctrl_r + g": "Группировать отряды",
			F: "Быстрый марш",
			T: "Огонь",
			spase: "Вкл/Выкл Пауза",
		},
	},
};
// -------------------------------------------------------------- //

// Связь клавиши с элементов Html виртуальной клавиатуры, {ИмяСимвола:HtmlЭлемент}
let G_MappingKeyFromHtmlKeyboard = {};

// Структура для хранения выбранной конфигурации горячих клавиш, в основном нужна для того чтобы хранить вложенные комбинации клавиш
let G_TakeHotKey = new NestedDict();

// Список клавиш в навигационной панели. Работает на подобие стека
let G_StackNavKey = {
	// Текущий список с клавишами
	current: [],
	// Список клавиш которые были удалены
	last: [],
};
// -------------------------------------------------------------- //
class Utils {
	// ++++++++++++++++++++++
	/* Класс с универсальными утилитами */
	static removeOptions(selectElement, end = 1) {
		/* Отчистить `selected` от `options`, по умолчанию оставляем самый первый элемент */
		let i,
			L = selectElement.options.length - 1;
		for (i = L; i >= end; i--) {
			selectElement.remove(i);
		}
	}
	static getFromSelect(html_id) {
		/* Получить `индекс,текст` из `select` по указному `id` */
		let elm = document.getElementById(html_id);
		if (elm.selectedIndex <= 0) {
			// Исключаем значение по умолчанию
			return null;
		}
		return [elm.selectedOptions[0].index, elm.selectedOptions[0].text];
	}

	static getElementsByClassNameUp(elm, req_class) {
		// Поиск класса в верх
		function _self(_elm, _req_class) {
			if (_elm.classList.contains(_req_class) === false) {
				_self(_elm.parentNode, _req_class);
			} else {
			}
			return _elm;
		}
		const res = _self(elm, req_class);
		return res;
	}
}

class UserSelect {
	// ++++++++++++++++++++++
	static BuildSelectProgram() {
		/* Заполнить список программ на основе HotKeyDict */
		Utils.removeOptions(document.getElementById("select-program"));
		let end = Object.keys(G_HotKeyDict).length - 1;
		let elm_program = document.getElementById("select-program");
		for (let i = 0; i <= end; i++) {
			let opt = document.createElement("option");
			opt.innerHTML = Object.keys(G_HotKeyDict)[i];
			elm_program.appendChild(opt);
		}
	}
	static BuildSelectPlace() {
		/* Заполнить список программ из HotKeyDict на основе выбранной программы */
		// Отчищаем данные из навигационной панели
		NavKey.ClearNavKey();
		// Отчищаем список от прошлых горячих клавиш
		ListHotKey.ClearList();
		// Удаляем выбор со всех клавиш виртуальной клавиатуры
		VirtualHotKey.ClearTakeKey();
		// Отчистить прошлые значения от предыдущей программы
		Utils.removeOptions(document.getElementById("select-place"));
		// Выбранная программа
		let select_program = Utils.getFromSelect("select-program")[1];
		let end = Object.keys(G_HotKeyDict[select_program]).length - 1;
		let elm_place = document.getElementById("select-place");
		for (let i = 0; i <= end; i++) {
			let opt = document.createElement("option");
			opt.innerHTML = Object.keys(G_HotKeyDict[select_program])[i];
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
		// Добавляем обработчик событий на выбор места
		this._addEventPlaceSelect();
	}
}

class NavKey {
	// ++++++++++++++++++++++
	static ClearNavKey() {
		G_StackNavKey.last = [];
		G_StackNavKey.current = [];
		NavKey.ShowNavKey();
	}
	static ShowNavKey() {
		/* Показать клавиши в навигационной панели */
		const elm = document.getElementById("nav_keboard_date");
		elm.innerText = G_StackNavKey.current.join("+");
	}
	static addNavKey(val) {
		// Добавить клавишу в навигационную панель
		console.log("addNavKey");
		// Добавляем клавишу в список выбранных, если она еще не добавлена в конец
		if (G_StackNavKey.current[G_StackNavKey.current.length - 1] !== val) {
			G_StackNavKey.current.push(val);
			G_StackNavKey.last.pop();
			NavKey.ShowNavKey();
		}
	}
	static popNavKey() {
		// Удалить с конца клавишу в навигационной панели
		console.log("popNavKey");
		// Если в текущей навигации есть клавиша
		if (G_StackNavKey.current[0] !== undefined) {
			// Удаляем клавишу из текущей навигации, и заносим ей в предыдущие
			G_StackNavKey.last.push(G_StackNavKey.current.pop());
			// Берем предыдущею комбинацию клавиш
			G_TakeHotKey.findStartFromDict(G_StackNavKey.current);
			// Показываем доступные клавиши, для предыдущей комбинации
			VirtualHotKey.ShowNestedKey(G_TakeHotKey.take);
			// Показываем текущий путь в навигационную панель клавиш
			NavKey.ShowNavKey();
		}
	}
	static backNavKey() {
		// Вернуть ранее удаленную клавишу
		// Проверяем на то что есть клавиша которую можно возвращать
		console.log("backNavKey");
		if (G_StackNavKey.last[0] !== undefined) {
			// Удаляем клавишу из предыдущих, и заносим ей в текущие
			G_StackNavKey.current.push(G_StackNavKey.last.pop());
			// Берем комбинацию клавиш которая была возвращена из стека
			G_TakeHotKey.findStartFromDict(G_StackNavKey.current);
			// Показываем доступные клавиши, для текущей комбинации
			VirtualHotKey.ShowNestedKey(G_TakeHotKey.take);
			// Показываем текущий путь в навигационную панель клавиш
			NavKey.ShowNavKey();
		}
	}

	static _addEventClickLeft() {
		document
			.getElementById("nav_keboard_left")
			.addEventListener("click", NavKey.popNavKey);
	}
	static _addEventClickRight() {
		document
			.getElementById("nav_keboard_rigth")
			.addEventListener("click", NavKey.backNavKey);
	}
	static init() {
		this._addEventClickLeft();
		this._addEventClickRight();
	}
}

class VirtualHotKey {
	// ++++++++++++++++++++++
	static GetAllKey() {
		// Получить все клавиши с виртуальной клавиатуры
		return document.querySelectorAll(
			'#keboard .hrow .key input[type="button"]'
		);
	}
	static ClearTakeKey() {
		// Убрать выбор со всех клавиш виртуальной клавиатуры
		this.GetAllKey().forEach((elm) => {
			let elm_p = elm.parentNode;
			elm_p.classList.remove("take-key");
			elm_p.classList.remove("take-nested-key");
			elm_p.classList.remove("press_key");
		});
	}
	static AgainShowTakeKeyboard(list_hot_key) {
		/* 
			Показать комбинации клавиш на вириальной клавиатуре, в зависимости от выбранной программы и места использования
			
			list_hot_key: HotKeyDict[select_program][select_place]
		*/
		// Отчищаем данные из навигационной панели
		NavKey.ClearNavKey();
		// Отчищаем предыдущие занятые клавиши
		VirtualHotKey.ClearTakeKey();
		// Отчищаем словарь занятые комбинации от прошлых
		G_TakeHotKey.clear();
		for (let x of Object.keys(list_hot_key)) {
			// Переводим комбинацию клавиш в стандартный вид
			x = ParseHotKey._BaseParse(x);
			// Заносим комбинацию в структуру в вложенный словарь, для дальнейше логики вложенных комбинации клавиш
			G_TakeHotKey.addFomDict(x);
			// Выделяем первые клавиши из комбинации
			let elm = G_MappingKeyFromHtmlKeyboard[x[0]];
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
	static ShowNestedKey(list_key) {
		// Выделяем комбинации клавиши переданные в `list`
		// Отчищаем выделение всех клавиш
		VirtualHotKey.ClearTakeKey();
		for (let x in list_key) {
			// Берем html элемент по имени символа
			let elm_key = G_MappingKeyFromHtmlKeyboard[x];
			// Если это вложенная комбинация клавиш
			if (Object.keys(list_key[x]).length > 0) {
				elm_key.parentElement.classList.add("take-nested-key");
			}
			// Если это одиночный символ
			else {
				elm_key.parentElement.classList.add("take-key");
			}
		}
	}
	static _ClickKey(event) {
		/* 
			Обработчик нажатие на все клавиши виртуальной клавиатуры. 
		*/
		console.log("_ClickKey");
		let elm = event.target;
		// Если это вложенная занятая клавиша
		if (elm.parentElement.classList.contains("take-nested-key")) {
			VirtualHotKey._ClickTakeNestedKey(elm);
		}
		// Если это простая занятая клавиша
		else if (elm.parentElement.classList.contains("take-key")) {
			VirtualHotKey._ClickTakeSimpleKey(elm);
		}
	}
	static _ClickTakeNestedKey(elm) {
		/*
			Обработчик нажатий на занятые вложенные клавиши 

			Показать какие занятые клавиши, для текущей нажатой клавиши. например для комбинации Ctrl_L+C, занятая клавиша будет `C` 
		*/
		// Помечаем нажатую клавишу
		elm.parentNode.classList.toggle("press_key");
		// Получаем стандартизированное название выбранной клавиши
		const elm_value = ParseHotKey._BaseParse(elm.value)[0];
		// Добавляем эту клавишу в навигационную панель
		NavKey.addNavKey(elm_value);
		// Показываем доступные клавиши
		VirtualHotKey.ShowNestedKey(
			// Получаем все доступные комбинации клавиши(на одном уровне) для текущей нажатой клавиши.
			G_TakeHotKey.getFromTake(elm_value)
		);
		// Переходи на уровень в низ, на те комбинации которые доступны через нажатую клавишу
		G_TakeHotKey.nextFomTake(elm_value);
	}

	static _ClickTakeSimpleKey(elm) {
		/*
			Обработчик нажатий на занятые одиночные клавиши
		*/
		// Получаем стандартизированное значение нажатой клавиши
		const elm_value = ParseHotKey.toStandard(elm.value);
		// Получаем текст из навигации
		const text_nav = document.getElementById("nav_keboard_date").innerText;
		// Формируем путь выбранной комбинации
		let hot_key_path = `${text_nav}`;
		if (text_nav) {
			hot_key_path += `+${elm_value}`;
		} else {
			hot_key_path = elm_value;
		}
		// Перебираем весь список горячих клавиш, и ищем ту которая совпадает с путем
		for (let xw of ListHotKey.getAllHtmlElement()) {
			let rhk = xw.querySelector(".radio_hot_key");
			if (rhk.innerText == hot_key_path) {
				// Если есть совпадение комбинаций, то выделяем её в списке
				ListHotKey.changeSelectElement(xw);
			}
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
			G_MappingKeyFromHtmlKeyboard[elm.value.toUpperCase()] = elm;
		});
	}
	static init() {
		this._addEventClickKey();
		this._BuildMappingKeyFromHtmlKeyboard();
	}
}

class ParseHotKey {
	// ++++++++++++++++++++++
	// Класс нужный для парсинга и конвертации горячих клавиш
	static _BaseParse(text) {
		/*
			Базовые преобразования текста с горячими клавишами
			

			text = 'Ctrl_l + C'
		*/
		return text.toUpperCase().split(/[ \t]*\+[ \t]*/);
	}

	static toStandard(text) {
		return this.toSelfKeyboard(text).join("+");
	}
	static toSelfKeyboard(text) {
		// Конвертировать строку с горячей клавишей в список клавиш
		console.log(`toSelfKeyboard: ${text}`);
		let list_hot_key = this._BaseParse(text);
		return list_hot_key;
	}
}

class ListHotKey {
	// ++++++++++++++++++++++

	/*
		Список с комбинациями клавиш, в зависимости от выбранной программы и места использования
	*/
	// Текущий выделенный элемент из списка, нужен для того чтобы снимать выделение при выборе нового элемента
	static lastSelectElement = undefined;

	static changeSelectElement(new_select_element) {
		/* Переключить выделение элемент из списка 
		
			new_select_element == .list_hot_key_radio
		*/
		// Если есть предыдущий элемент то удаляем с него класс-выделение
		if (this.lastSelectElement !== undefined) {
			this.lastSelectElement.classList.remove("select");
		}
		// Прошлый класс равен текущему
		this.lastSelectElement = new_select_element;
		// Получаем блок с радио кнопкой
		let rhk = new_select_element.querySelector(".radio_hot_key");
		// Прокручиваем к выбранному элементу
		rhk.scrollIntoView();
		// Переключаем радио кнопку
		rhk.querySelector('input[type="radio"]').checked = true;
		// Ставим класс для выделения
		new_select_element.classList.add("select");
	}

	static getAllHtmlElement() {
		return document.querySelectorAll(
			"#info_down #list_hot_key .list_hot_key_radio"
		);
	}

	static ClearList() {
		// Отчистить список с комбинациями клавиш
		let elm = document.getElementById("list_hot_key");
		elm.innerHTML = "";
	}

	static AgainShowListHotKey() {
		// Показать список горячих клавиш для выбранной программы и места
		console.log("AgainShowListHotKey");
		// Отчищаем список от прошлых горячих клавиш
		ListHotKey.ClearList();
		// Выбранная программа
		let select_program = Utils.getFromSelect("select-program");
		let select_place = Utils.getFromSelect("select-place");
		// Если выбрана программа и место использования
		if ((select_program !== null) & (select_place !== null)) {
			// Если не null то берем имена программы и места
			select_program = select_program[1];
			select_place = select_place[1];
			// Список горячих клавиш
			let list_hot_key = G_HotKeyDict[select_program][select_place];
			let end = Object.keys(list_hot_key).length - 1;
			// Создаем элемент для хранения комбинации клавиш
			let elm_place = document.getElementById("list_hot_key");
			for (let i = 0; i <= end; i++) {
				let div = document.createElement("div");
				div.className = "list_hot_key_radio";
				div.innerHTML = `
                <div class="radio_hot_key">
                    <input type="radio" name="nradio">${ParseHotKey.toStandard(
											Object.keys(list_hot_key)[i]
										)}</input>
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
	static _ClickElmFomListHotKey(event) {
		// Обработать нажатие на элемент их списка горячих клавиш
		console.log("SelectHotKey");
		console.log(event);
		const elm = event.target;
		const elm2 = Utils.getElementsByClassNameUp(elm, "list_hot_key_radio");

		if (elm.parentElement.parentElement.id == "list_hot_key") {
			if (elm.parentElement.classList.contains("list_hot_key_radio")) {
				// Переключить радио кнопку.
				ListHotKey.changeSelectElement(elm.parentElement);
			}
		}
	}

	static _addEventClickElmHotKey() {
		// Добавить обработку событий выбора места в программе
		console.log("_addEventClickElmHotKey");
		document
			.getElementById("list_hot_key")
			.addEventListener("click", this._ClickElmFomListHotKey);
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
	NavKey.init();
}
main();
// -------------------------------------------------------------- //
