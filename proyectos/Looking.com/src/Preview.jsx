import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import "./Preview.css";

function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const images = [
  "https://i.imgur.com/abc123.jpg",
  "https://i.imgur.com/def456.jpg",
  "https://i.imgur.com/ghi789.jpg",
];

  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>

      <div className="previewHeader">
        <h1 className="roomTitle">Habitación Deluxe Familiar</h1>
        <h3 className="companyName">Hotel Soltura</h3>
        <p className="roomLocation">San José, Escazú</p>
      </div>

      <div className="previewImageWrapper">
        <img
          src={images[currentImage]}
          alt="Habitación"
          className="previewImage"
        />

        {images.length > 1 && (
          <>
            <button className="imageNav left" onClick={prevImage}>
              ‹
            </button>
            <button className="imageNav right" onClick={nextImage}>
              ›
            </button>
          </>
        )}
      </div>

      <div className="previewContent">
        {/* Columna Izquierda */}
        <div className="previewLeft">
          <section>
            <h3>Acerca de la Habitación</h3>
            <p>
              Habitación amplia y cómoda, ideal para parejas o familias
              pequeñas, ubicada cerca del centro.
            </p>
          </section>

          <section>
            <h3>Cuartos</h3>
            <p>
              <strong>Dormitorios:</strong> 2
            </p>
            <ul className="bedList">
              <li>1 cama - Queen</li>
              <li>2 camas - Individual</li>
            </ul>
          </section>

          <section>
            <h3>Amenidades</h3>
            <ul className="amenitiesList">
              <li>Wi-Fi</li>
              <li>Aire acondicionado</li>
              <li>Piscina</li>
              <li>Parqueo gratuito</li>
            </ul>
          </section>
        </div>

        {/* Columna Derecha */}
        <aside className="previewRight">
          <h3>¡Realiza tu reserva!</h3>

          <p className="dateRange">12 Mar – 15 Mar</p>

          <p className="availability">
            <strong>2</strong> cuartos restantes
          </p>

          <p className="price">
            ₡65,000<span>/Noche</span>
          </p>

          <button className="buttonMain fullWidth" onClick={() => navigate(`/book/${id}`)}>Reserva Ya</button>
        </aside>
      </div>
    </>
  );
}

export default Preview;
