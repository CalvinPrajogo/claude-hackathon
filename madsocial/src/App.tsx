import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { TodayPage } from './pages/TodayPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { UpcomingPage } from './pages/UpcomingPage';
import { MyPregamesPage } from './pages/MyPregamesPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/upcoming" element={<UpcomingPage />} />
          <Route path="/my-pregames" element={<MyPregamesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
