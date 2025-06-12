import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { configureStore } from '@reduxjs/toolkit';
import LoginModal from '../LoginModal';
import { apiSlice } from '../../store/apiSlice';
import userSlice from '../../store/userSlice';

// Mock store setup
const createMockStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      api: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

// Test wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = createMockStore();
  const theme = createTheme();

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

// Mock API calls
jest.mock('../../store/apiSlice', () => ({
  ...jest.requireActual('../../store/apiSlice'),
  useLoginMutation: () => [
    jest.fn().mockResolvedValue({
      unwrap: () => Promise.resolve({
        user: { id: 1, name: 'Test User', email: 'test@test.com' },
        userType: 'hasta'
      })
    }),
    { isLoading: false }
  ]
}));

describe('LoginModal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    userType: 'hasta' as const
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly when open', () => {
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Hasta Giriş')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/şifre/i)).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} open={false} />
      </TestWrapper>
    );

    expect(screen.queryByText('Hasta Giriş')).not.toBeInTheDocument();
  });

  test('displays correct title for different user types', () => {
    const { rerender } = render(
      <TestWrapper>
        <LoginModal {...defaultProps} userType="doktor" />
      </TestWrapper>
    );

    expect(screen.getByText('Doktor Giriş')).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <LoginModal {...defaultProps} userType="yonetici" />
      </TestWrapper>
    );

    expect(screen.getByText('Yönetici Giriş')).toBeInTheDocument();
  });

  test('displays demo credentials correctly', () => {
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} userType="hasta" />
      </TestWrapper>
    );

    expect(screen.getByText('hasta@demo.com')).toBeInTheDocument();
    expect(screen.getByText('hasta123')).toBeInTheDocument();
  });

  test('fills demo credentials when button clicked', async () => {
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    const demoButton = screen.getByText('Demo Bilgileri Doldur');
    await userEvent.click(demoButton);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/şifre/i) as HTMLInputElement;

    expect(emailInput.value).toBe('hasta@demo.com');
    expect(passwordInput.value).toBe('hasta123');
  });

  test('toggles password visibility', async () => {
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/şifre/i);
    const toggleButton = screen.getByRole('button', { name: /şifreyi göster/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('toggles between login and register mode', async () => {
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
    expect(screen.queryByLabelText(/ad soyad/i)).not.toBeInTheDocument();

    const toggleButton = screen.getByText('Kayıt Ol');
    await userEvent.click(toggleButton);

    expect(screen.getByText('Hasta Kayıt')).toBeInTheDocument();
    expect(screen.getByLabelText(/ad soyad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/şifre tekrar/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /giriş yap/i });
    await userEvent.click(submitButton);

    // Form should not submit without required fields
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  test('shows error for invalid credentials', async () => {
    const user = userEvent.setup();
    
    // Mock failed login
    const mockLogin = jest.fn().mockRejectedValue({
      status: 401,
      data: 'Invalid credentials'
    });

    jest.doMock('../../store/apiSlice', () => ({
      ...jest.requireActual('../../store/apiSlice'),
      useLoginMutation: () => [mockLogin, { isLoading: false }]
    }));
    
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    await user.type(screen.getByLabelText(/email/i), 'wrong@email.com');
    await user.type(screen.getByLabelText(/şifre/i), 'wrongpassword');
    
    const submitButton = screen.getByRole('button', { name: /giriş yap/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/geçersiz email veya şifre/i)).toBeInTheDocument();
    });
  });

  test('handles successful login', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    // Fill demo credentials
    await user.click(screen.getByText('Demo Bilgileri Doldur'));
    
    const submitButton = screen.getByRole('button', { name: /giriş yap/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  test('closes modal when close button clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    const closeButton = screen.getByRole('button', { name: /kapat/i });
    await user.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test('validates register form fields', async () => {
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    // Switch to register mode
    await userEvent.click(screen.getByText('Kayıt Ol'));

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/ad soyad alanı zorunludur/i)).toBeInTheDocument();
    });
  });

  test('validates password confirmation in register mode', async () => {
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    // Switch to register mode
    await userEvent.click(screen.getByText('Kayıt Ol'));

    await userEvent.type(screen.getByLabelText(/ad soyad/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByLabelText(/^şifre/i), 'password123');
    await userEvent.type(screen.getByLabelText(/şifre tekrar/i), 'different123');

    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/şifreler eşleşmiyor/i)).toBeInTheDocument();
    });
  });

  test('displays loading state during submission', async () => {
    const user = userEvent.setup();
    
    // Mock loading state
    jest.doMock('../../store/apiSlice', () => ({
      ...jest.requireActual('../../store/apiSlice'),
      useLoginMutation: () => [jest.fn(), { isLoading: true }]
    }));
    
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText(/giriş yapılıyor/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /giriş yapılıyor/i })).toBeDisabled();
  });

  test('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/şifre/i);
    
    await user.click(emailInput);
    await user.type(emailInput, 'test@test.com');
    
    await user.tab();
    expect(passwordInput).toHaveFocus();
    
    await user.type(passwordInput, 'password123');
    
    await user.keyboard('{Enter}');
    // Should trigger form submission
  });

  test('accessibility features', () => {
    render(
      <TestWrapper>
        <LoginModal {...defaultProps} />
      </TestWrapper>
    );

    // Check for proper ARIA labels
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/şifre/i)).toBeInTheDocument();
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { name: /hasta giriş/i })).toBeInTheDocument();
    
    // Check for button accessibility
    expect(screen.getByRole('button', { name: /kapat/i })).toBeInTheDocument();
  });
}); 