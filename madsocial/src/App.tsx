import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { TodayPage } from './pages/TodayPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route
            path="/upcoming"
            element={
              <PlaceholderPage
                title="Upcoming Events"
                description="Coming soon! View events for future dates."
              />
            }
          />
          <Route
            path="/my-pregames"
            element={
              <PlaceholderPage
                title="My Pregames"
                description="Coming soon! Manage pregames you're hosting or attending."
              />
            }
          />
          <Route
            path="/profile"
            element={
              <PlaceholderPage
                title="Profile"
                description="Coming soon! View and edit your profile."
              />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
