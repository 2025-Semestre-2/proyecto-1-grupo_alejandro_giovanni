import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import "./Preview.css";

const AMENITIES = [
  "Wi-Fi",
  "Aire acondicionado",
  "Piscina",
  "Parqueo gratuito",
  "TV",
  "Cocina",
];

const generateFakePreview = ({ role, id }) => {
  const rooms = Math.floor(Math.random() * 3) + 1;

  return {
    id,
    role, //"rooms", "activities"
    title: "Habitación Deluxe Familiar",
    companyName: "Hotel Soltura",
    companyId: 30201,
    location: "San José, Escazú",
    description:
      "Habitación amplia y cómoda, ideal para parejas o familias pequeñas, ubicada cerca del centro.",
    bedrooms: rooms,
    beds: ["1 cama - Queen", "2 camas - Individual"],
    amenities: AMENITIES.filter(() => Math.random() > 0.4),
    price: Math.floor(Math.random() * 90000) + 40000,
    images: [
      "https://www.jaypeehotels.com/blog/wp-content/uploads/2024/09/Blog-6-scaled.jpg",
      "https://cdn.sanity.io/images/y527plhk/production/736b3a72ba9b2a18e243ef695c0870abd83bca6c-4000x3000.jpg",
      "https://www.potawatomi.com/application/files/3517/4560/6138/Signature-2-Queen_body.webp",
    ],
  };
};

function Preview() {
  const { role, id } = useParams();
  const navigate = useNavigate();

  const { isGuest, isUser } = useAuth();

  const isActivity = role === "activities";
  const canReserve = isUser || isGuest;

  const preview = useMemo(() => generateFakePreview({ role, id }), [role, id]);

  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % preview.images.length);

  const prevImage = () =>
    setCurrentImage((prev) =>
      prev === 0 ? preview.images.length - 1 : prev - 1,
    );

  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>

      <div className="previewHeader">
        <h1 className="roomTitle">
          {isActivity ? "Experiencia Exclusiva" : preview.title}
        </h1>

        <h3
          className="companyName clickable"
          onClick={() => navigate(`/companyProfile/${preview.companyId}`)}
          title="Ver perfil de la empresa"
        >
          {preview.companyName}
        </h3>

        <p className="roomLocation">
          {isActivity ? "Actividad disponible en: " : ""}
          {preview.location}
        </p>
      </div>

      <div className="previewImageWrapper">
        <img
          src={preview.images[currentImage]}
          alt={preview.title}
          className="previewImage"
        />

        {preview.images.length > 1 && (
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
        {/* Left column */}
        <div className="previewLeft">
          <section>
            <h3>
              {isActivity
                ? "Acerca de la Actividad"
                : "Acerca de la Habitación"}
            </h3>

            <p>{preview.description}</p>
          </section>

          {!isActivity && (
            <section>
              <h3>Cuartos</h3>
              <p>
                <strong>Dormitorios:</strong> {preview.bedrooms}
              </p>
              <ul className="bedList">
                {preview.beds.map((bed, i) => (
                  <li key={i}>{bed}</li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h3>Amenidades</h3>
            <ul className="amenitiesList">
              {preview.amenities.map((amenity, i) => (
                <li key={i}>{amenity}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right column */}
        {!isActivity && canReserve && (
          <aside className="previewRight">
            <h3>¡Realiza tu reserva!</h3>

            <p className="price">
              ₡{preview.price.toLocaleString()}
              <span>/Noche</span>
            </p>

            <button
              className="buttonMain fullWidth"
              onClick={() => {
                if (isGuest) {
                  navigate("/signupUser");
                } else {
                  navigate(`/book/${id}`);
                }
              }}
            >
              {isGuest ? "Crear cuenta para reservar" : "Reserva Ya"}
            </button>
          </aside>
        )}
      </div>
    </>
  );
}

export default Preview;
