import { TaskId } from '../models';

export const login = () => '/login'
export const register = () => '/register'
export const logout = () => '/logout'
export const forgotPassword = () => '/forgot-password'

export const task = (taskId: TaskId) => `/tasks/${taskId}`
export const tasks = () => `/`
export const newTask = () => '/tasks/new'
export const runningTask = (taskId: TaskId) => `/tasks/${taskId}/running`
