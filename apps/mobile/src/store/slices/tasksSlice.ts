import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, apiErrorMessage } from "../../api/client";
import type { Task, TaskStatus } from "../../types";

type TasksState = {
  byProjectId: Record<string, Task[]>;
  loadingByProjectId: Record<string, boolean>;
  error: string | null;
};

const initialState: TasksState = {
  byProjectId: {},
  loadingByProjectId: {},
  error: null
};

export const fetchTasks = createAsyncThunk("tasks/fetch", async (projectId: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return { projectId, tasks: response.data.tasks as Task[] };
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

export const createTask = createAsyncThunk(
  "tasks/create",
  async (payload: { projectId: string; title: string; dueDate?: string | null }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/projects/${payload.projectId}/tasks`, {
        title: payload.title,
        dueDate: payload.dueDate || null
      });
      return response.data.task as Task;
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error));
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async (payload: { taskId: string; projectId: string; status?: TaskStatus; title?: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/tasks/${payload.taskId}`, {
        status: payload.status,
        title: payload.title
      });
      return response.data.task as Task;
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error));
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (payload: { taskId: string; projectId: string }, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${payload.taskId}`);
      return payload;
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error));
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasks(state) {
      state.byProjectId = {};
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        state.loadingByProjectId[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loadingByProjectId[action.payload.projectId] = false;
        state.byProjectId[action.payload.projectId] = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loadingByProjectId[action.meta.arg] = false;
        state.error = String(action.payload || "Unable to load tasks");
      })
      .addCase(createTask.fulfilled, (state, action) => {
        const list = state.byProjectId[action.payload.projectId] || [];
        state.byProjectId[action.payload.projectId] = [action.payload, ...list];
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const list = state.byProjectId[action.payload.projectId] || [];
        state.byProjectId[action.payload.projectId] = list.map((task) =>
          task.id === action.payload.id ? action.payload : task
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const list = state.byProjectId[action.payload.projectId] || [];
        state.byProjectId[action.payload.projectId] = list.filter((task) => task.id !== action.payload.taskId);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = String(action.payload || "Unable to create task");
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = String(action.payload || "Unable to update task");
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = String(action.payload || "Unable to delete task");
      });
  }
});

export const { clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
