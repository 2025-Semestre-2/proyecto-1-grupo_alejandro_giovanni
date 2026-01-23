import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import "./Home.css";

function App() {
  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>
      <div className="heroImage" />
    </>
  );
}

export default App;
