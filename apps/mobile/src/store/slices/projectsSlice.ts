import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, apiErrorMessage } from "../../api/client";
import type { Project } from "../../types";

type ProjectsState = {
  items: Project[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
};

const initialState: ProjectsState = {
  items: [],
  loading: false,
  refreshing: false,
  error: null
};

export const fetchProjects = createAsyncThunk("projects/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/projects");
    return response.data.projects as Project[];
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

export const createProject = createAsyncThunk(
  "projects/create",
  async (payload: { title: string; description: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/projects", payload);
      return response.data.project as Project;
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error));
    }
  }
);

export const deleteProject = createAsyncThunk("projects/delete", async (projectId: string, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${projectId}`);
    return projectId;
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjects(state) {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = state.items.length === 0;
        state.refreshing = state.items.length > 0;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = String(action.payload || "Unable to load projects");
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = String(action.payload || "Unable to create project");
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((project) => project.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = String(action.payload || "Unable to delete project");
      });
  }
});

export const { clearProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
