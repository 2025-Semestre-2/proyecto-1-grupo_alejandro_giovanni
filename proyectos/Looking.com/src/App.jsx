import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Search from "./Search";
import Preview from "./Preview"
import Book from "./Book"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/preview/:id" element={<Preview />} />
      <Route path="/book/:id" element={<Book />} />
    </Routes>
  );
}

export default App;
