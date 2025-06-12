import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeContextProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import AnaSayfa from './pages/AnaSayfa';
import Panel from './pages/Panel';

function App() {
  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/panel" element={<Panel />} />
              <Route path="/" element={<AnaSayfa />} />
              <Route path="/hastalar" element={<Navigate to="/panel" />} />
              <Route path="/doktorlar" element={<Navigate to="/panel" />} />
              <Route path="/yonetici" element={<Navigate to="/panel" />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeContextProvider>
    </Provider>
  );
}

export default App;
