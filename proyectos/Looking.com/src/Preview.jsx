import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import { useParams } from "react-router-dom";

import "./Preview.css";

function Preview() {
  const { id } = useParams();

  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>
      <div style={{ padding: "2rem" }}>
        <h1>Vista previa de la habitación</h1>
        <p>
          ID de la habitación: <strong>{id}</strong>
        </p>

        {/* Later:
          fetch(`/api/rooms/${id}`)
      */}
      </div>
    </>
  );
}

export default Preview;
