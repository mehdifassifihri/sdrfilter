import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Filter from "./pages/Filter";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import { Provider } from "react-redux";
import store from "./store/index";

function App() {
  const Queryclient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={Queryclient}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <div className="flex h-screen">
                  <Sidebar />
                  <main className="p-8 ml-72 h-full w-full">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/filter" element={<Filter />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </main>
                </div>
              }
            />
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
