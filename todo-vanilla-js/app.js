'use strict';


(function() {
    
    class Todo {
        constructor(id, description, date) {
            this.id = id;
            this.description = description;
            this.date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }
    }

    let todos = [];

    const initStorage = () => {
        if(localStorage.getItem('todos') === null) {
            localStorage.setItem('todos', JSON.stringify(todos));
        } else {
            todos = JSON.parse(localStorage.getItem('todos'));
        }    
    };

    const displayTodos = (items = [], target = null) => {
        if(items.length === 0 || target === null) {
            return false;
        }
        let content = '';
        for(const todo of items) {
            content += `<li class="todo" id="${todo.id}">${todo.description} ${todo.date} <button type="button" class="todo-remove">&times;</button></li>`;
        }
        target.innerHTML = content;
    };

    const sortTodos = (order = 'ASC') => {
        const list = todos.map(todo => {
            let dateTime = todo.date;
            let dateParts = dateTime.split(' ');
            let dt = dateParts[0].split('/').reverse().join('-');
            let ts = new Date(dt + ' ' + dateParts[1]).getTime();
            return {...todo, ts};
        }).sort((a, b) => {
            if(order === 'DESC') {
                return -1;
            }
            if(order === 'ASC') {
                return 1;
            }
            return 0;
        });
        displayTodos(list, document.querySelector('.todo-list'));
    };

    const toggleSorting = (target = null) => {
        if(target === null) {
            return false;
        }
        target.addEventListener('click', () => {
            const active = target.querySelector('.active');
            const sibling = active.nextElementSibling ? active.nextElementSibling : active.previousElementSibling;
            if(sibling) {
                sibling.className = 'active';
                active.className = '';
            }
            sortTodos(target.querySelector('.active').dataset.order);
        }, false);
    };

    const handleTodoActions = (target = null) => {
        if(target === null) {
            return false;
        }
        if(todos.length > 1) {
            target.classList.remove('hidden');
        } else {
            target.classList.add('hidden');
        }
    };

    const saveStorage = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const addTodo = todo => {
        if(!todo || !todo instanceof Todo) {
            return false;
        }
        todos.push(todo);
        saveStorage();
        handleTodoActions(document.querySelector('.todo-actions'));
    };

    const removeTodo = id => {
        if(todos.length === 0) {
            return false;
        }
        todos = todos.filter(td => td.id !== id);
        saveStorage();
        handleTodoActions(document.querySelector('.todo-actions'));
    };

    

    const getTodos = (target = null) => {
        if(target === null || todos.length === 0) {
            return false;
        }
        displayTodos(todos, target);
        handleTodoActions(document.querySelector('.todo-actions'));
    };

    const searchTodos = (term = '') => {
        initStorage();
        const results = todos.filter(todo => {
            return todo.description.toLowerCase().includes(term.toLowerCase());
        });
        if(results.length > 0) {
            displayTodos(results, document.querySelector('.todo-list'));    
        }
    };

    const handleSearch = (form = null) => {
        if(form === null) {
            return false;
        }
        form.addEventListener('submit', e => {
            e.preventDefault();
            const term = form.querySelector('.todo-search-term').value;
            searchTodos(term);
        }, false);
    };

    const handleResetSearch = (btn = null, target = null) => {
        if(btn === null || target === null) {
            return false;
        }
        btn.addEventListener('click', () => {
            getTodos(target);
            btn.previousElementSibling.value = '';
        }, false);
    };

    const createTodoID = () => 'todo-' + Math.random().toString().substring(2);


    const handleTodoRemove = (target = null, input = null) => {
        if(target === null) {
            return false;
        }
        target.addEventListener('click', e => {
            const element = e.target;
            if(element.matches('.todo-remove')) {
                element.parentNode.remove();
                removeTodo(element.parentNode.id);

                if(input !== null) {
                    input.value = '';
                }
            }
        }, false);
    };

    const createTodo = (target = null, content = '', input = null) => {
        if(target === null) {
            return false;
        }
        const todo = document.createElement('li');
        
        const id = createTodoID();
        const todoObj = new Todo(id, content, new Date());

        todo.id = id;
        todo.className = 'todo';
        todo.innerText = content + ' ' + todoObj.date;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'todo-remove';
        remove.innerHTML = '&times;';
        todo.appendChild(remove);
        target.appendChild(todo);
        addTodo(todoObj);

        if(input !== null) {
            input.value = '';
        }

        return true;
    };

    const handleSubmit = (form = null) => {
        if(form === null) {
            return false;
        }
        form.addEventListener('submit', e => {
            e.preventDefault();
            const input = form.querySelector('.todo-description');
            const value = input.value;
            if(value && !/^\s+$/.test(value)) {
                return createTodo(document.querySelector('.todo-list'), value, input);
            }
        }, false);
    };

    document.addEventListener('DOMContentLoaded', () => {
        const todoList = document.querySelector('.todo-list');
        const todoForm = document.querySelector('.todo-form');
        const todoInput = todoForm.querySelector('.todo-description');
        const todoSort = document.querySelector('.todo-sort');
        const todoSearch = document.querySelector('.todo-search');
        const todoResetSearchBtn = document.querySelector('.todo-reset-search');

        initStorage();
        toggleSorting(todoSort);
        handleSearch(todoSearch);
        handleResetSearch(todoResetSearchBtn, todoList);
        getTodos(todoList);

        handleTodoRemove(todoList, todoInput);
        handleSubmit(todoForm);
    }, false);
})();
