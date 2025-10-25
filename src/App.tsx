import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import { AuthProvider } from './contexts';
import { Layout, PrivateRoute } from './components/layout';
import LoginPage from './pages/auth/LoginPage';
import PostListPage from './pages/posts/PostListPage';
import PostDetailPage from './pages/posts/PostDetailPage';
import PostFormPage from './pages/posts/PostFormPage';
import VisualizationPage from './pages/visualization/VisualizationPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Navigate to="/posts" replace />} />
                <Route path="posts" element={<PostListPage />} />
                <Route path="posts/new" element={<PostFormPage />} />
                <Route path="posts/:id" element={<PostDetailPage />} />
                <Route path="posts/:id/edit" element={<PostFormPage />} />
                <Route path="visualization" element={<VisualizationPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
