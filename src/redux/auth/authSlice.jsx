import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Login as LoginAPI, RefreshToken as RefreshTokenAPI} from "./authenAPI";

export const Login = createAsyncThunk('auth/login', async (AuthRequest) => {
  const response = await LoginAPI(AuthRequest);
  return response;
});

export const RefreshToken = createAsyncThunk('auth/RefreshToken', async (RefreshTokenRequest) => {
  const response = await RefreshTokenAPI(RefreshTokenRequest);
  return response;
});
const AuthSlice = createSlice({
  name: 'user',
  initialState: {
    loading:false,
    user:null,
    error:null
  },
});

export default AuthSlice.reducer;
