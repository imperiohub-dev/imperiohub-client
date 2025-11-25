import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { AppLayout, AppLayoutBody } from './components/layout/AppLayout';
import { TopMenuBar } from './components/layout/TopMenuBar';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { MainContent } from './components/layout/MainContent';
import { navigationConfig } from './config/navigation.config';
import { AuthDebugger } from './components/AuthDebugger';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Debug helper - solo en desarrollo */}
        <AuthDebugger />

        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes with navigation layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <NavigationProvider config={navigationConfig}>
                  <AppLayout>
                    <TopMenuBar />
                    <AppLayoutBody>
                      <LeftSidebar />
                      <MainContent />
                    </AppLayoutBody>
                  </AppLayout>
                </NavigationProvider>
              </ProtectedRoute>
            }
          >
            {/* Dynamic routes generated from navigationConfig */}
            {navigationConfig.themes.map((theme) =>
              theme.subThemes.map((subTheme) => {
                // Remove leading slash for nested routes
                const relativePath = subTheme.path.startsWith('/')
                  ? subTheme.path.substring(1)
                  : subTheme.path;

                return (
                  <Route
                    key={subTheme.path}
                    path={relativePath}
                    element={<subTheme.component />}
                  />
                );
              })
            )}

            {/* Default redirect to sales dashboard */}
            <Route index element={<Navigate to="/sales/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
