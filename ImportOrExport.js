class ImportOrExport {
	static _Export(event) {
		document
			.getElementById("up_windows")
			.style.setProperty("visibility", "visible");
		document
			.getElementById("up_windows_past")
			.style.setProperty("display", "none");
		document
			.getElementById("up_windows_copy")
			.style.setProperty("display", "inline-block");
		document
			.getElementById("up_windows_textarea")
			.style.setProperty("display", "none");
		//
		let elm = document.getElementById("up_windows_text");
		elm.innerText = JSON.stringify(G_HotKeyDict, null, "\t");
	}
	static _Import() {
		document
			.getElementById("up_windows")
			.style.setProperty("visibility", "visible");
		document
			.getElementById("up_windows_copy")
			.style.setProperty("display", "none");
		document
			.getElementById("up_windows_past")
			.style.setProperty("display", "inline-block");
		document
			.getElementById("up_windows_textarea")
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
		let val = await navigator.clipboard.readText();
		document.getElementById("up_windows_textarea").value = val;
	}
	static _CloseUpWindows() {
		document
			.getElementById("up_windows")
			.style.setProperty("visibility", "hidden");
	}
	static _addEvent() {
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
	}

	static init() {
		this._addEvent();
	}
}
