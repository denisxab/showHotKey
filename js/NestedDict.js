class NestedDict {
    /*
    
        # Структура для хранения вложенных путей и навигации по ним.


        Например вот так будут храниться пути из комбинации клавиш
        
        ```js
        date = {
            "CTRL_R": {
                    "C": {},
                    "V": {},
                "SHIFT_L": {
                    "ALT_L": {
                        "F": {}
                },
                    "C": {},
                    "D": {}
                }
            },
            "F": {}
        }
        ```

        Навигация по комбинациям клавишам будет происходить через указания полного пути, или перемещения на уровень в низ по указному ключу.
        
        - Например если нужно перейти на уровень в низ для `CTRL_R`, то тогда выполняем

            ```js
            NestedDict().nextFomTake('CTRL_R')
            ```
            
            В итоге в атрибуте `take` будет путь
            
            ```js
            take = {
                "C": {},
                "V": {},
                "SHIFT_L": {
                    "ALT_L": {
                        "F": {}
                    },
                    "C": {},
                    "D": {}
                }
            },
            ```
        - Например если нам нужно перейти на путь `Ctrl_L + Shift_L` не зависимо  от тогда где вы сейчас находись, то тогда выполняем
            
            ```js
            NestedDict().findStartFromDict(['CTRL_R','Shift_L'])
            ```

            ```js
            take = {
                "ALT_L": {
                "F": {}
            },
            ```
    */
    constructor() {
        this.dict = {};
        // Структура для хранения навигации во вложенных комбинациях клавиш
        this.take = undefined;
    }
    clear() {
        // Отчистить структуру
        this.dict = {};
        this.take = undefined;
    }
    addFomDict(list) {
        /*
            Добавить значение в структуру

            Пример list = ['Ctrl_l','Shift_l','C']
        */
        function _self(_dict, _list, _next_index = 0) {
            /*
            Функция для вставки в списка в словарь, кратко говоря элементы списка станут ключами словаря

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
                _self(nv, _list, _next_index + 1);
            }
            else {
                // Если словарь закончился, а в списке еще есть элементы, то продолжаем добавлять элементы в словарь
                if (_list.length - 1 >= _next_index) {
                    _dict[_list[_next_index]] = {};
                    nv = _dict[_list[_next_index]];
                    _self(nv, _list, _next_index + 1);
                }
            }
            return _dict;
        }
        this.dict = _self(this.dict, list);
    }
    findStartFromDict(list) {
        /*
            Ищем путь с начала словаря `dict`. Элементы `list` являются ключами словаря `dict`

            Пример list = ['Ctrl_l','Shift_l','C']
        */
        // Передвинутся на уровень вверх
        function _self(_dict, _list, _next_index = 0) {
            // Итерируемся по элементам списка `_list` которые являются ключами словаря `_dict`
            // Останавливаемся на последнем ключе `_dict` который есть в `_list`
            let nv = _list[_next_index];
            _next_index += 1;
            if (nv) {
                return _self(_dict[nv], _list, _next_index);
            }
            else {
                return _dict;
            }
        }
        this.take = _self(this.dict, list);
    }
    nextFomTake(key) {
        // Передвинутся на уровень в низ
        this.take = this.take[key];
    }
    getFromTake(key) {
        /* Взять значение из текущего пути */
        if (this.take === undefined) {
            this.take = this.dict;
        }
        return this.take[key];
    }
}
