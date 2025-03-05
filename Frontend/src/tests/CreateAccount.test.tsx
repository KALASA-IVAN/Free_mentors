import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateAccount from '../components/CreateAccount';
import axios from 'axios';
import { jest } from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios');
// jest.mock('axios', () => ({
//     post: jest.fn(),
//   }));
  
// Mock components
jest.mock('@mui/icons-material/LockOutlined', () => () => <div>LockOutlinedIcon</div>);

describe('CreateAccount Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields', () => {
    render(
      <MemoryRouter>
         <CreateAccount />
      </MemoryRouter>
   );

    // Check if all input fields are rendered
    expect(screen.getByPlaceholderText(/Enter first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter occupation/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter expertise/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter bio/i)).toBeInTheDocument();
  });

  it('shows error message for missing required fields', async () => {
    render(
      <MemoryRouter>
         <CreateAccount />
      </MemoryRouter>
   );;

    // Simulate submitting the form without filling out any fields
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Wait for the error messages to appear
    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Occupation is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Expertise is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Bio is required/i)).toBeInTheDocument();
    });
  });

  it('shows error message for invalid email format', async () => {
    render(
      <MemoryRouter>
         <CreateAccount />
      </MemoryRouter>
   );

    // Enter an invalid email and submit the form
    fireEvent.change(screen.getByPlaceholderText(/Enter email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Wait for the invalid email error
    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  it('shows error message for short password', async () => {
    render(
      <MemoryRouter>
         <CreateAccount />
      </MemoryRouter>
   );
    // Enter a short password and submit the form
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Wait for the short password error
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });
  it('submits the form with valid data', async () => {
    const mockResponse = {
      data: {
        data: {
          createUser: {
            user: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              isMentor: false,
              bio: 'Tech Enthusiast',
              occupation: 'Engineer',
              address: '123 Main St',
              expertise: 'Software Development',
            },
            message: 'Account created successfully',
          },
        },
      },
    };
  
    axios.post.mockResolvedValueOnce(mockResponse);
  
    render(
      <MemoryRouter>
        <CreateAccount />
      </MemoryRouter>
    );
  
    // Fill out the form with valid data
    fireEvent.change(screen.getByPlaceholderText(/Enter first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter occupation/i), { target: { value: 'Engineer' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter expertise/i), { target: { value: 'Software Development' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter bio/i), { target: { value: 'Tech Enthusiast' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
  
    // Wait for the form to be submitted and check the API call
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/graphql/',
        {
          query: `
            mutation CreateUser($firstName: String!, $lastName: String!, $email: String!, $password: String!, 
              $address: String!, $isMentor: Boolean!, $bio: String!, $occupation: String!, $expertise: String!) {
              createUser(
                firstName: $firstName,
                lastName: $lastName,
                email: $email,
                password: $password,
                address: $address,
                isMentor: $isMentor,
                bio: $bio,
                occupation: $occupation,
                expertise: $expertise
              ) {
                user {
                  firstName
                  lastName
                  email
                  address
                  isMentor
                  bio
                  occupation
                  expertise
                }
                message
              }
            }`,
          variables: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            address: '123 Main St',
            isMentor: false,
            bio: 'Tech Enthusiast',
            occupation: 'Engineer',
            expertise: 'Software Development',
          },
        }
      );
    });
  
    await waitFor(() => {
      expect(screen.getByText(/Account created successfully/i)).toBeInTheDocument();
    });
  });
  

  it('shows error when account creation fails', async () => {
    const mockError = new Error('Account creation failed');
    axios.post.mockRejectedValueOnce(mockError);

    render(
      <MemoryRouter>
         <CreateAccount />
      </MemoryRouter>
   );

    // Fill out the form with valid data
    fireEvent.change(screen.getByPlaceholderText(/Enter first name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter email/i), { target: { value: 'jane.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter occupation/i), { target: { value: 'Engineer' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter expertise/i), { target: { value: 'Software Development' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter bio/i), { target: { value: 'Tech Enthusiast' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Wait for the error to appear
    await waitFor(() => {
      expect(screen.getByText(/Error creating account/i)).toBeInTheDocument();
    });
  });
});
