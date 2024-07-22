import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Async thunk for login
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8083/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      // Assuming the response contains user and accesstoken
      if (!data || !data.accesstoken || !data.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', data.accesstoken);
      localStorage.setItem('userId', data.user.id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  loading: false,
  userId:  localStorage.getItem('userId') || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      state.loading = false;
      state.userId = null
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.user.id;
        state.token = action.payload.accesstoken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = "Wrong username or password";
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
