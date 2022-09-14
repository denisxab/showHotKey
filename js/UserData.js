// Все комбинации клавиш {'ИмяПрограммы':{'МестоВ_Программе':{'КомбинацииКлавиш':'ОписаниеКомбинации'}}}
let G_HotKeyDict = {
    // В какой программе
    vscode: {
        // В каком месте программы
        Редактор: {
            // Комбинация клавиш: Описание комбинации
            // Комбинация указывается слева на право через знак плюс
            "Ctrl_l + c": "Копировать выделенный текст, если не выделен текст то копировать вю строку",
            "Ctrl_R + v": "Вставить тест",
        },
        Поиск: {
            "Ctrl_l + l": "Выделить все найденное",
        },
    },
    vs_code_r: {
        "Редактор кода": {
            // "Управление VS Code":
            "ctrl_l+N": "Создать новый безымянный файл",
            "ctrl_l+W": "Закрыть окно",
            "ctrl_l+O": "Открыть файл",
            "ctrl_l+shift_L+1": "Показать / Скрыть правую панель (`workbench.action.toggleSidebarVisibility`)",
            // Терминал
            "ctrl_l+`": "Открыть окно терминала (`workbench.action.terminal.toggleTerminal`)",
            "ctrl_l+shift_L+`": "Создать новый терминал (`workbench.action.terminal.new`)",
            "ctrl_l+shift_L+C": "Открыть стандартный внешний терминал (`workbench.action.terminal.openNativeConsole`)",
            // Вкладки
            "Alt_L + 1": "Перейти во вкладку по номеру (`workbench.action.openEditorAtIndex1`)",
            "Alt_L + 2": "Перейти во вкладку по номеру (`workbench.action.openEditorAtIndex1`)",
            "Alt_L + 3": "Перейти во вкладку по номеру (`workbench.action.openEditorAtIndex1`)",
            "Alt_L + 4": "Перейти во вкладку по номеру (`workbench.action.openEditorAtIndex1`)",
            "Alt_L + 5": "Перейти во вкладку по номеру (`workbench.action.openEditorAtIndex1`)",
            "Alt_L + 6": "Перейти во вкладку по номеру (`workbench.action.openEditorAtIndex1`)",
            "Alt_L + 7": "Перейти во вкладку по номеру (`workbench.action.openEditorAtIndex1`)",
            "Alt_L + 8": "Перейти во вкладку по номеру (`workbench.action.openEditorAtIndex1`)",
            "Alt_L + 9": "Перейти во вкладку по номеру (`workbench.action.openEditorAtIndex1`)",
            "ctrl_l+tab": "Переключиться на следующие вкладку (`workbench.action.quickOpenPreviousRecentlyUsedEditorInGroup`)",
            "ctrl_l+shift_L+tab": "Переключиться на предыдущее вкладку (`workbench.action.quickOpenLeastRecentlyUsedEditorInGroup`)",
            // Окна
            "ctrl_l + 1": "Переключиться в окно по номеру (`workbench.action.focusFirstEditorGroup`)",
            "ctrl_l + 2": "Переключиться в окно по номеру (`workbench.action.focusFirstEditorGroup`)",
            "ctrl_l + 3": "Переключиться в окно по номеру (`workbench.action.focusFirstEditorGroup`)",
            "ctrl_l + 4": "Переключиться в окно по номеру (`workbench.action.focusFirstEditorGroup`)",
            "ctrl_l + 5": "Переключиться в окно по номеру (`workbench.action.focusFirstEditorGroup`)",
            "ctrl_l+\\": "Разделить текущие окно на два (`workbench.action.splitEditor`)",
            "ctrl_l + K + left": "Переместить окно влево",
            "ctrl_l + K + right": "Переместить окно вправо",
            // Меню
            "ctrl_l+E": "Мень файлов (`workbench.action.quickOpen`)",
            "ctrl_l+shift_L+P": "Палитра всех команд (`workbench.action.showCommands`)",
            "ctrl_l + K + M": "Выбрать язык файла (`workbench.action.editor.changeLanguageMode`) ",
            // Редактирование кода
            "ctrl_l+/": "Закомментировать или раскомментировать строку",
            F2: "Переименовать переменную (`editor.action.rename`)",
            "ctrl_l+enter": "Вставить перенос ниже  (`editor.action.insertLineAfter`)",
            "ctrl_l+shift_L+enter": "Вставить перенос выше (`editor.action.insertLineBefore`)",
            "Alt_L+shift_L+Down": "Дублировать выбранную строку(`editor.action.duplicateSelection`)",
            TAB: "Добавить табы вправо (`editor.action.indentLines`)",
            "shift_L+tab": "Добавить табы влево (`editor.action.outdentLines`)",
            "ctrl_l+k+j": "Объединить выделенное в одну строку (`editor.action.joinLines`)",
            "shift_L+Alt_L++right": "Увеличить выделенное рядом (`editor.action.smartSelect.expand`)",
            "shift_L+Alt_L+left": "Уменьшить выделанною рядом (`editor.action.smartSelect.shrink`) ",
            // "Визуал редактора кода"
            "ctrl_l+shift_L+[": "Свернуть блок (`notebook.fold`) ",
            "ctrl_l+shift_L+] ": "Развернуть блок (`notebook.unfold`)",
            // "Навигация по коду"
            "ctrl_l+G": "Перейти к указанной строке (`workbench.action.gotoLine`) ",
            "ctrl_l+B": "Перейти к определению переменной`(`editor.action.revealDefinition`)",
            "ctrl_l+win+<": "Вернутся в прошлое место редактирования (`Go Back`)",
            "ctrl_l+win+>": "Вернутся в бедующее место редактирования (`Go Forward`)",
            // "Поиск в коде"
            "ctrl_l+R": "Найти с заменой в текущем файле (`editor.action.startFindReplaceAction`)",
            "ctrl_l+shift_L+R": "Найти с заменой во всех файлах проекта (`workbench.action.replaceInFiles`)",
            "ctrl_l+shift_L+l": "Выделить все вхождения выделенного текста (`editor.action.selectHighlights`+`selectAllSearchEditorMatches`)",
            "Alt_L+Enter": "Выделить все вхождения из поиска (`search.action.openInEditor`)",
            F3: "Прейти к следующему результату поиска (`editor.action.nextMatchFindAction`)",
            "shift_L+f3": " Перейти к предыдущему результату поиска (`editor.action.previousSelectionMatchFindAction`)",
            "Alt_L + C ": " Переключить параметр поиска (С учетом регистра)",
            "Alt_L + R ": " Переключить параметр поиска (Регулярное выражение)",
            "Alt_L + W ": " Переключить параметр поиска (Слово целиком)",
            "ctrl_l+T": "Поиск(ленивый) по переменным в коде (`workbench.action.showAllSymbols`)",
            "ctrl_l+shift_L+O": "Поиск(активный) по переменным в коде  (`workbench.action.gotoSymbol`)",
            // Отладка
            "ctrl_l + F5": "Запустить отладку",
            "ctrl_l + F6": "Начать без отладки",
            "ctrl_l + F7": "Остановить отладку",
            "ctrl_l + F8": "Перезапустить отладку",
            "Alt_L + F9": "Переключить точку останова",
            "shift_L + F9": "Новая точка останова столбца",
            "ctrl_l + F9": "Шаг с обходом",
            "ctrl_l + F10": "Шаг с заходом",
            "ctrl_l + F11": "Шаг с выходом",
            "ctrl_l + F12": "Продолжит",
            F5: "Запуск кода",
            F6: "Остановка кода",
            F7: "Очистить окно вывода",
            F8: "Закрыть панель снизу",
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
            "[": "Вкл/Выкл оружие",
            C: "Показать видимость",
            E: "Остановка",
            J: "Рассредоточится",
            O: "Вкл/Выкл ответный огонь",
            P: "Авто поиск укрытия",
            F: "Быстрый марш",
            T: "Огонь",
            "Ctrl_l + T": "Быстрое движение и атака",
            "Ctrl_l + G": "Сгруппировать выделенные войска",
            R: "Разгрузиться на позиции",
            G: "Задний ход",
            H: "Пустить дым",
            Y: "Посадка вертолета",
            Z: "Наступать",
            X: "Оборонять",
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
