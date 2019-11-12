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

const getTodo = async () => {
  const res = await axios.get('/todos');
  todos = res.data;
  render();
};

const removeTodo = async ({ target }) => {
  if (!target.classList.contains('remove-todo')) return;
  const res = await axios.delete(`/todos/${target.parentNode.id}`);
  todos = res.data;
  render();
};

const toggleCheckBox = async ({ target }) => {
  const id = target.parentNode.id;
  const completed = !todos.find((todo) => todo.id === +id).completed
  const res = await axios.patch(`/todos/${id}`, { completed });
  todos = res.data;
  render();
};

const maxId = () => {
  return todos.length? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;
}

const addTodo = async ({ target, keyCode }) => {
  const content = target.value.trim();
  if(keyCode !== 13 || content === '') return;
  target.value = '';
  const res = await axios.post('/todos', {id: maxId(), content, completed: false})
  todos = res.data;
  render();
};

window.onload = getTodo;
$todos.onclick = removeTodo;
$todos.onchange = toggleCheckBox;
$input.onkeyup = addTodo;