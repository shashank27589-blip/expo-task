import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, apiErrorMessage } from "../../api/client";
import type { User } from "../../types";

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null
};

export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (payload: { email: string; name?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/request-otp", payload);
      return response.data as { message: string; otp?: string };
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error));
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-otp", payload);
      return response.data as { token: string; user: User };
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error));
    }
  }
);

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/auth/me");
    return response.data as { user: User };
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload || "Unable to request OTP");
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload || "Unable to verify OTP");
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.token = null;
        state.user = null;
      });
  }
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
