import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  user: string | null;
  token: string | null;
  isMentor: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

// Load persisted values from localStorage
const storedToken = localStorage.getItem("token");
const storedIsMentor = localStorage.getItem("isMentor") === "true";  // Convert string to boolean
const storedIsAdmin = localStorage.getItem("isAdmin") === "true";    // Convert string to boolean

const initialState: AuthState = {
  user: null,
  token: storedToken || null,
  isMentor: storedIsMentor,
  isAdmin: storedIsAdmin,
  loading: false,
  error: null,
};

// Async Thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/graphql/",
        {
          query: `
            mutation {
                loginUser(email: "${email}", password: "${password}") {
                    accessToken
                    refreshToken
                    user {
                        firstName
                        email
                        isMentor
                        isAdmin
                    }
                    message
                }
            }
          `,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data?.data?.loginUser;
      if (!data?.accessToken) {
        throw new Error("Invalid credentials");
      }

      // Store authentication details in localStorage
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("isMentor", String(data.user.isMentor));
      localStorage.setItem("isAdmin", String(data.user.isAdmin));

      return {
        token: data.accessToken,
        email,
        isMentor: data.user.isMentor,
        isAdmin: data.user.isAdmin,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isMentor = false;
      state.isAdmin = false;
      
      // Remove everything from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("isMentor");
      localStorage.removeItem("isAdmin");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.email;
        state.token = action.payload.token;
        state.isMentor = action.payload.isMentor;
        state.isAdmin = action.payload.isAdmin;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
