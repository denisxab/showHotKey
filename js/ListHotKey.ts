class ListHotKey {
	// ++++++++++++++++++++++

	/*
		Список с комбинациями клавиш, в зависимости от выбранной программы и места использования
	*/
	// Текущий выделенный элемент из списка, нужен для того чтобы снимать выделение при выборе нового элемента
	static lastSelectElement = undefined;
	// Хранит текст комбинации клавиш на момент фокуса
	static startFocusListHotKey = undefined;

	static changeSelectElement(new_select_element) {
		/* Переключить выделение элемент из списка 
		
			new_select_element == .list_hot_key_radio
		*/
		// Если есть предыдущий элемент то удаляем с него класс-выделение
		if (this.lastSelectElement !== undefined) {
			this.lastSelectElement.classList.remove("select");
			// Вызываем событие расфокусировки с текстового поля комбинации клавиш
			this.lastSelectElement.querySelector(".change_hot_key").blur();
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

	static _Focus_change_hot_key(event) {
		// Обработка фокусировки на тексте с комбинацией клавиш
		console.log("_Focus_change_hot_key");
		// Сохраняем текст на момент фокусировки, чтобы если что можно было откатиться на это значение
		this.startFocusListHotKey = event.target.value;
	}
	static _Blur_change_hot_key(event) {
		// Обработка расфокусировки на тексте с комбинацией клавиш
		console.log("_Blur_change_hot_key");
		const elm = event.target;
		// Если изменили комбинацию клавиш
		if (elm.value != this.startFocusListHotKey) {
			console.log("_Blur_change_hot_key_yes_change");
			// Запоминаем описание комбинации
			const val_dict =
				G_HotKeyDict[Utils.getFromSelect("select-program")[1]][
					Utils.getFromSelect("select-place")[1]
				][this.startFocusListHotKey];
			// Удаляем комбинацию
			delete G_HotKeyDict[Utils.getFromSelect("select-program")[1]][
				Utils.getFromSelect("select-place")[1]
			][this.startFocusListHotKey];
			// Записываем новую комбинацию клавиш, описание берем из прошлой комбинации
			const elm_value = LogicHotKeyDict._toStandardValue(elm.value);
			G_HotKeyDict[Utils.getFromSelect("select-program")[1]][
				Utils.getFromSelect("select-place")[1]
			][elm_value] = val_dict;
			// Отобразить комбинации клавиш на виртуальной клавиатуре.
			ListHotKey.AgainShowListHotKey();
		}
		// --------------------------------------
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
		/*
			Показать список горячих клавиш для выбранной программы и места
		*/
		console.log("AgainShowListHotKey");
		// Отчищаем список от прошлых горячих клавиш
		ListHotKey.ClearList();
		// Выбранная программа
		let select_program_arr: [number, string] =
			Utils.getFromSelect("select-program");
		let select_place_arr: [number, string] = Utils.getFromSelect("select-place");
		// Если выбрана программа и место использования
		if (select_program_arr !== null && select_place_arr !== null) {
			// Если не null то берем имена программы и места
			const select_program: string = select_program_arr[1];
			const select_place: string = select_place_arr[1];
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
                    <input type="radio" name="nradio">
					<input type="text" class="change_hot_key" value="${ParseHotKey.toStandard(
						Object.keys(list_hot_key)[i]
					)}">
                </div>
                <div class="radio_info">
                    ${Object.values(list_hot_key)[i]}    
                </div>
                `;
				// Добавляем обработчик событии на расфокусировка текста с комбинацией клавиш
				div
					.querySelector(".change_hot_key")
					.addEventListener("blur", ListHotKey._Blur_change_hot_key);
				// Добавляем обработчик событии на фокусировку текста с комбинацией клавиш
				div
					.querySelector(".change_hot_key")
					.addEventListener("focus", ListHotKey._Focus_change_hot_key);
				elm_place.appendChild(div);
			}
			// Отобразить комбинации клавиш на виртуальной клавиатуре
			VirtualHotKey.AgainShowTakeKeyboard(list_hot_key);
		}
	}
	static _ClickElmFomListHotKey(event) {
		// Обработать нажатие на элемент их списка горячих клавиш
		console.log("_ClickElmFomListHotKey");
		const elm = Utils.getElementsByClassNameUp(
			event.target,
			"list_hot_key_radio"
		);
		// Если найден такой класс
		if (elm) {
			// Переключить радио кнопку.
			ListHotKey.changeSelectElement(elm);
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
