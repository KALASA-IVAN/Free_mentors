import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { jest } from '@jest/globals';
import reducer from '../redux/authSlice';
import { createStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// Mock axios
jest.mock('axios');

// Mock LockOutlinedIcon
jest.mock('@mui/icons-material/LockOutlined', () => () => <div>LockOutlinedIcon</div>);
const createMockStore = (initialState = {}) => {
  const defaultState = {
    auth: {
      user: null,
      token: null,
      loading: false,
      error: null,
    }
  };
  return createStore(reducer, { ...defaultState, ...initialState });
};
// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders the email and password fields', () => {
    render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    // Check if email and password fields are rendered
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
  });

  it('shows error message when email is invalid', async () => {
    render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
  
    // Enter invalid email and submit the form
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'invalid.com' } });
  
    // Target the 'Sign In' button by its role (button) and label
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
  
    // Wait for the error message to appear as helperText inside the TextField
    const errorMessage = await screen.findByText(/Invalid email address./i);
  
    // Check that the error message is rendered
    expect(errorMessage).toBeInTheDocument();
  });
  
  

  it('shows error message when password is too short', async () => {
    render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    // Enter a short password and submit the form
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters long./i)).toBeInTheDocument();
    });
  });

  it('handles valid login and stores token', async () => {
    // Mock a successful API response
    (axios.post as jest.Mock).mockResolvedValueOnce({
        data: { data: { loginUser: { accessToken: 'fakeToken' } } },
      });
      

      render(
        <Provider store={createMockStore()}>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </Provider>
      );
  

    // Enter valid credentials and submit the form
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Wait for the token to be stored in localStorage
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fakeToken');
    });
  });

  it('navigates to /admin/dashboard on admin login', async () => {
    const navigate = jest.fn();
    // Mock a successful API response
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { data: { loginUser: { accessToken: 'fakeToken' } } },
    });
    // Mock useNavigate
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );


    // Enter admin credentials and submit the form
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Wait for navigation to /admin/dashboard
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('shows error when login fails', async () => {
    // Mock a failed API response
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );


    // Enter invalid credentials and submit the form
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Login failed. Please check your credentials./i)).toBeInTheDocument();
    });
  });
});
