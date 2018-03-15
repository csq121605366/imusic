
const getters = {
  singer: (state) => state.singer,
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
export default getters;
