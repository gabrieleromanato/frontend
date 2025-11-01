const { createApp } = Vue;

const app = createApp({});

app.component('AppHeader', {
    template: `
        <header class="app-header">
            <img src="logo.png" class="app-logo" alt="Vue.js" />
            <h1>Vue.js App</h1>
        </header>
    `
});

app.component('AppMain', {
    data() {
        return {
            todo: '',
            todos: []
        }
    },
    methods: {
        addToDo() {
            if(!this.todos.includes(this.todo)) {
                this.todos.push(this.todo);
            }
            this.todo = '';
        },
        removeToDo(value) {
            this.todos = this.todos.filter(t => t !== value);
        }
    },
    template: `
        <div class="app-main">
            <form>
                <div>
                    <input type="text" name="todo" v-model="todo" />
                    <button @click="addToDo" type="button">Add To Do</button>
                </div>
            </form>
            <ul class="app-list" v-if="todos.length > 0">
                <li v-for="td in todos" :key="td">{{ td }} <button @click="removeToDo(td)">Remove</button></li>
            </ul>

        </div>
    `
})

app.mount('#app');