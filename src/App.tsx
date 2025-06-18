import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import FormBuilderPage from '@/pages/FormBuilderPage';
import FormResponsesPage from '@/pages/FormResponsesPage';
import SettingsPage from '@/pages/SettingsPage';
import PublicFormPage from '@/pages/PublicFormPage';
import FormSubmitPage from '@/pages/FormSubmitPage';
import DashboardPage from '@/pages/DashboardPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient } from '@/contexts/QueryClient';
import { Toaster } from 'sonner';
import AuthLayout from '@/layouts/AuthLayout';
import GuestLayout from '@/layouts/GuestLayout';
import NotFoundPage from '@/pages/NotFoundPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import FormsPage from '@/pages/FormsPage';
import QuizzesPage from '@/pages/QuizzesPage';
import QuizBuilderPage from '@/pages/QuizBuilderPage';
import QuizResponsesPage from '@/pages/QuizResponsesPage';
import PublicQuizPage from '@/pages/PublicQuizPage';

function App() {
  return (
    <QueryClient>
      <Toaster />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <AuthLayout>
                <HomePage />
              </AuthLayout>
            } />
            <Route path="/dashboard" element={
              <AuthLayout>
                <DashboardPage />
              </AuthLayout>
            } />
            <Route path="/forms" element={
              <AuthLayout>
                <FormsPage />
              </AuthLayout>
            } />
            <Route path="/login" element={
              <GuestLayout>
                <LoginPage />
              </GuestLayout>
            } />
            <Route path="/register" element={
              <GuestLayout>
                <RegisterPage />
              </GuestLayout>
            } />
            <Route path="/forms/new" element={
              <AuthLayout>
                <FormBuilderPage />
              </AuthLayout>
            } />
            <Route path="/forms/:formId" element={
              <AuthLayout>
                <FormBuilderPage />
              </AuthLayout>
            } />
            <Route path="/forms/:formId/responses" element={
              <AuthLayout>
                <FormResponsesPage />
              </AuthLayout>
            } />
            <Route path="/responses/:id" element={
              <AuthLayout>
                <FormResponsesPage />
              </AuthLayout>
            } />
            <Route path="/settings" element={
              <AuthLayout>
                <SettingsPage />
              </AuthLayout>
            } />
            <Route path="/submit/:shareableLink" element={<FormSubmitPage />} />
            <Route path="/form/:shareableLink" element={<PublicFormPage />} />
            <Route path="/subscription" element={
              <AuthLayout>
                <SubscriptionPage />
              </AuthLayout>
            } />
            <Route path="/quizzes" element={
              <AuthLayout>
                <QuizzesPage />
              </AuthLayout>
            } />
            <Route path="/quizzes/new" element={
              <AuthLayout>
                <QuizBuilderPage />
              </AuthLayout>
            } />
            <Route path="/quizzes/:quizId" element={
              <AuthLayout>
                <QuizBuilderPage />
              </AuthLayout>
            } />
            <Route path="/quizzes/:quizId/responses" element={
              <AuthLayout>
                <QuizResponsesPage />
              </AuthLayout>
            } />
            <Route path="/quiz/:shareableLink" element={<PublicQuizPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
