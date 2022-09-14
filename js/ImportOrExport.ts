class UpWindows {
	static _VisibleUpWindows() {
		// Показать окно
		document.getElementById("body").style.setProperty("display", "none");
		document
			.getElementById("up_windows")
			.style.setProperty("visibility", "visible");
	}
	static _HiddenUpWindows() {
		// Скрыть окно
		document.getElementById("body").style.setProperty("display", "block");
		document
			.getElementById("up_windows")
			.style.setProperty("visibility", "hidden");
	}
}

class ImportOrExport {
	static _Export(event) {
		UpWindows._VisibleUpWindows();
		// Скрываем
		document
			.getElementById("up_windows_past")
			.style.setProperty("display", "none");
		document
			.getElementById("up_windows_textarea")
			.style.setProperty("display", "none");
		document
			.getElementById("up_windows_apply_and_close")
			.style.setProperty("display", "none");
		// Показываем
		document
			.getElementById("up_windows_copy")
			.style.setProperty("display", "inline-block");
		document
			.getElementById("up_windows_text")
			.style.setProperty("display", "block");
		let elm = document.getElementById("up_windows_text");
		elm.innerText = JSON.stringify(G_HotKeyDict, null, "\t");
	}

	static _Import() {
		UpWindows._VisibleUpWindows();
		// Скрываем
		document
			.getElementById("up_windows_copy")
			.style.setProperty("display", "none");
		document
			.getElementById("up_windows_text")
			.style.setProperty("display", "none");
		// Показываем
		document
			.getElementById("up_windows_past")
			.style.setProperty("display", "inline-block");
		document
			.getElementById("up_windows_textarea")
			.style.setProperty("display", "inline-block");
		document
			.getElementById("up_windows_apply_and_close")
			.style.setProperty("display", "inline-block");
	}

	static _ClickCopyBuffer() {
		// Копировать в буфер обмена
		navigator.clipboard.writeText(
			document.getElementById("up_windows_text").innerText
		);
		// Показываем что копирование прошло успешно
		document.getElementById("up_windows_copy").classList.toggle("click");
		setTimeout(() => {
			document.getElementById("up_windows_copy").classList.toggle("click");
		}, 1000);
	}
	static async _ClickPasteFromBuffer() {
		// Вставить из буфера обмена, не работает на Firefox
		const val = await navigator.clipboard.readText();
		const elm = <HTMLTextAreaElement>(
			document.getElementById("up_windows_textarea")
		);
		elm.value = val;
	}
	static _CloseUpWindows() {
		// Закрыть
		console.log("_CloseUpWindows");
		UpWindows._HiddenUpWindows();
	}

	static _Apply() {
		// Применить
		console.log("_Apply");
		const elm = <HTMLTextAreaElement>(
			document.getElementById("up_windows_textarea")
		);
		const text = elm.value;
		if (text) {
			console.log("_Apply_True");
			G_HotKeyDict = JSON.parse(text);
		}
		UpWindows._HiddenUpWindows();
	}
	static _addEvent() {
		// Навешиваем обработчики событий
		document
			.getElementById("up_windows_copy")
			.addEventListener("click", this._ClickCopyBuffer);
		document
			.getElementById("up_windows_past")
			.addEventListener("click", this._ClickPasteFromBuffer);
		document
			.getElementById("up_windows_close")
			.addEventListener("click", this._CloseUpWindows);
		document
			.getElementById("import_hot_key")
			.addEventListener("click", this._Import);
		document
			.getElementById("export_hot_key")
			.addEventListener("click", this._Export);
		document
			.getElementById("up_windows_apply_and_close")
			.addEventListener("click", this._Apply);
	}

	static init() {
		this._addEvent();
	}
}
