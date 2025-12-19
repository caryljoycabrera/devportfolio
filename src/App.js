import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Routes>
          {routes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;