let todos = [];
const $todos = document.querySelector('.todos');
const $input = document.querySelector('.input-todo');

const render = () => {
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

const ajax = (() => {
  const req = (method, url, payload) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(payload));
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject('ERROR:', xhr.status, xhr.statusText);
        }
      };
    });
  };

  return {
    get(url) {
      return req('GET', url);
    },
    post(url, payload) {
      return req('POST', url, payload);
    },
    patch(url, payload){
      return req('PATCH', url, payload);
    },
    del(url){
      return req('DELETE', url);
    }
  };
})();

const getTodo = () => {
  ajax.get('/todos')
    .then(res => todos = res)
    .then(render)
    .catch(err => console.error(err));
};

const removeTodo = ({ target }) => {
  if (!target.classList.contains('remove-todo')) return;
  
  ajax.del(`/todos/${target.parentNode.id}`)
    .then(res => todos = res)
    .then(render)
    .catch(err => console.error(err));
};

const toggleCheckBox = ({ target }) => {
  const id = target.parentNode.id;
  const completed = !todos.find((todo) => todo.id === +id).completed;
  
  ajax.patch(`/todos/${id}`, { completed })
    .then(res => todos = res)
    .then(render)
    .catch(err => console.error(err));
};

const maxId = () => {
  return todos.length? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;
};

const addTodo = ({ target, keyCode }) => {
  const content = target.value.trim();
  if(keyCode !== 13 || content === '') return;
  target.value = '';

  ajax.post('/todos', {id: maxId(), content, completed: false})
    .then(res => todos = res)
    .then(render)
    .catch(err => console.error(err));
};

window.onload = getTodo;
$todos.onclick = removeTodo;
$todos.onchange = toggleCheckBox;
$input.onkeyup = addTodo;