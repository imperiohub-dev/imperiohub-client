import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { ViewportProvider } from "./contexts/ViewportContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { AppLayout, AppLayoutBody } from "./components/layout/AppLayout";
import { TopMenuBar } from "./components/layout/TopMenuBar";
import { LeftSidebar } from "./components/layout/LeftSidebar";
import { MainContent } from "./components/layout/MainContent";
import { BottomNavBar } from "./components/layout/BottomNavBar";
import { navigationConfig } from "./config/navigation.config";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes with navigation layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <NavigationProvider config={navigationConfig}>
                  <ViewportProvider>
                    <AppLayout>
                      <TopMenuBar />
                      <AppLayoutBody>
                        <LeftSidebar />
                        <MainContent />
                      </AppLayoutBody>
                      <BottomNavBar />
                    </AppLayout>
                  </ViewportProvider>
                </NavigationProvider>
              </ProtectedRoute>
            }
          >
            {/* Dynamic routes generated from navigationConfig */}
            {navigationConfig.themes.map((theme) => {
              //console.log("theme", theme);
              return theme.subThemes.map((subTheme) => {
                // console.log("subTheme", subTheme);

                // Remove leading slash for nested routes
                const relativePath = subTheme.path.startsWith("/")
                  ? subTheme.path.substring(1)
                  : subTheme.path;
                // console.log("relativePath", relativePath);
                return (
                  <Route
                    key={subTheme.path}
                    path={relativePath}
                    element={<subTheme.component />}
                  />
                );
              });
            })}

            {/* Default redirect to trading marketplace */}
            <Route
              index
              element={<Navigate to="/trading/marketplace" replace />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
