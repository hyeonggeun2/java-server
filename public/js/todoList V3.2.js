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
  fetch('/todos')
    .then(res => {
      console.log(res);
      res.json();
      console.log(res);
    })
    .then(res => todos = res)
    .then(render)
    .catch(err => console.error(err));
};

const removeTodo = ({ target }) => {
  if (!target.classList.contains('remove-todo')) return;
  fetch(`/todos/${target.parentNode.id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(res => todos = res)
    .then(render)
    .catch(err => console.error(err));
};

const toggleCheckBox = ({ target }) => {
  const id = target.parentNode.id;
  const completed = !todos.find((todo) => todo.id === +id).completed
  fetch(`/todos/${id}`, {
    method: 'PATCH',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify({ completed })
  })
    .then(res => res.json())
    .then(res => todos = res)
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
  fetch('/todos', {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify({id: maxId(), content, completed: false})
  })
    .then(res => res.json())
    .then(res => todos = res)
    .then(render)
    .catch(err => console.error(err));
};

window.onload = getTodo;
$todos.onclick = removeTodo;
$todos.onchange = toggleCheckBox;
$input.onkeyup = addTodo;