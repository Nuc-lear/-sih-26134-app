import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { StudentProvider } from './context/StudentContext';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RolesPage } from './pages/RolesPage';
import { PrioritiesPage } from './pages/PrioritiesPage';
import { ReportPage } from './pages/ReportPage';
import { JobExtractorPage } from './pages/JobExtractorPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StudentProvider>
          <BrowserRouter>
          <Routes>
            {/* Landing & Onboarding */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Application Pages (Wrapped in Master AppLayout) */}
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              }
            />
            <Route
              path="/roles"
              element={
                <AppLayout>
                  <RolesPage />
                </AppLayout>
              }
            />
            <Route
              path="/priorities"
              element={
                <AppLayout>
                  <PrioritiesPage />
                </AppLayout>
              }
            />
            <Route
              path="/report"
              element={
                <AppLayout>
                  <ReportPage />
                </AppLayout>
              }
            />
            <Route
              path="/extractor"
              element={
                <AppLayout>
                  <JobExtractorPage />
                </AppLayout>
              }
            />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        </StudentProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
