let todos = [];

const $todos = document.querySelector('.todos');
const $input = document.querySelector('.input-todo');

const render = data => {
  let html = '';
  todos.forEach(({ id, content, completed }) => {
    html += `
    <li id="${id}" class="todo-item">
      <input class="checkbox" type="checkbox" id="ck-${id}" ${completed ? 'checked' : ''}>
      <label for="ck-${id}">${content}</label>
      <i class="remove-todo far fa-times-circle"></i>
    </li>`;
  });
  $todos.innerHTML = html;
}

const getTodo = () => {
  axios.get('/todos')
    .then(res => todos = res.data)
    .then(render)
    .catch(err => console.error(err));
};

const removeTodo = ({ target }) => {
  if (!target.classList.contains('remove-todo')) return;
  axios.delete(`/todos/${target.parentNode.id}`)
    .then(res => todos = res.data)
    .then(render)
    .catch(err => console.error(err));
};

const toggleCheckBox = ({ target }) => {
  const id = target.parentNode.id;
  const completed = !todos.find((todo) => todo.id === +id).completed
  axios.patch(`/todos/${id}`, { completed })
    .then(res => todos = res.data)
    .then(render)
    .catch(err => console.error(err));
};

const maxId = () => {
  return todos.length? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;
}

const addTodo = ({ target, keyCode }) => {
  const content = target.value.trim();
  if(keyCode !== 13 || content === '') return;
  target.value = '';
  axios.post('/todos', {id: maxId(), content, completed: false})
    .then(res => todos = res.data)
    .then(render)
    .catch(err => console.error(err));
};

window.onload = getTodo;
$todos.onclick = removeTodo;
$todos.onchange = toggleCheckBox;
$input.onkeyup = addTodo;