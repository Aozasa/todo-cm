import { Todos } from '@prisma/client';
import { createTodoTemplate, updateTodoTemplate, deleteTodoTemplate, listTodoTemplate } from '../../views/todoView';

describe('Todo view', () => {
  const mockTodo: Todos = {
    id: 1,
    title: 'title',
    description: 'description',
    isClosed: true,
    closedAt: new Date(),
    finishedAt: new Date(),
    priority: 'HIGH',
    username: 'username',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  test('createTodoTemplateが正しい値を返す', async () => {
    expect(createTodoTemplate(mockTodo)).toEqual({
      status: 200,
      todo: mockTodo,
    });
  });

  test('updateTodoTemplateが正しい値を返す', async () => {
    expect(updateTodoTemplate(mockTodo)).toEqual({ status: 200, todo: mockTodo });
  });

  test('listTodoTemplateが正しい値を返す', async () => {
    expect(listTodoTemplate([mockTodo, mockTodo])).toEqual({ status: 200, todos: [mockTodo, mockTodo] });
  });

  test('deleteTodoTemplateが正しい値を返す', async () => {
    expect(deleteTodoTemplate()).toEqual({ status: 200 });
  });
});
