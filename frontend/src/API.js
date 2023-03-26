import axios from "axios";

const client = axios.create({baseUrl : "http://localhost:4001",})

export const getTodos = async () => {
  return client.get("/todos");
};

export const createTodo = async (formData) => {
    return await client.post("/todos", formData)
};

export const deleteTodo = async (todoId) => {
  return await client.delete(`/todos/${todoId}`)
};
