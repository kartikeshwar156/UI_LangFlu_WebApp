import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const STORAGE_KEY = "lf_userinfo";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [onboardingAnswers, setOnboardingAnswers] = useState({});

  useEffect(() => {
    // 1) Read user info from Google redirect query params.
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const email = params.get("email");
    const picture = params.get("picture");

    if (name && email) {
      const profile = { name, email, picture };
      setUser(profile);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      window.history.replaceState({}, "", window.location.pathname); // clean URL
      setLoading(false);
      return;
    }

    // 2) Fallback to sessionStorage so refreshes or navigation keep the profile.
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      setUser(JSON.parse(cached));
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    window.location.href = `${API_BASE}/auth/google/start`;
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const handlePlay = () => {
    // replace with your app's main route if different
    window.location.href = "/";
  };

  if (loading) return <p className="status">Loading…</p>;

  return (
    <main className="container">
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <MainPage
          user={user}
          onLogout={handleLogout}
          onPlay={handlePlay}
          onboardingDone={onboardingDone}
          onOnboardingComplete={(ans) => {
            setOnboardingAnswers(ans);
            setOnboardingDone(true);
          }}
          onboardingAnswers={onboardingAnswers}
        />
      )}
    </main>
  );
}

export default App;
