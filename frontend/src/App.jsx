import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import PredictPage from './pages/PredictPage.jsx'
import HowItHelpsPage from './pages/HowItHelpsPage.jsx'
import ProjectInfoPage from './pages/ProjectInfoPage.jsx'
import ChatbotPage from './pages/ChatbotPage.jsx'

export default function App() {
  return (
    <div className="appShell">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/help" element={<HowItHelpsPage />} />
          <Route path="/project" element={<ProjectInfoPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
