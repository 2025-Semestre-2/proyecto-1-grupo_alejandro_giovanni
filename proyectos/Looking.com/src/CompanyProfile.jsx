import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import { useNavigate, useParams } from "react-router-dom";
import "./CompanyProfile.css";
import { useRef } from "react";

import { FaUserCircle } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTwitter } from "react-icons/fa";

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function CompanyProfile() {
  const mockRooms = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `Habitación ${i + 1}`,
    desc: "Cómoda habitación cerca del centro",
    meta: "2 cuartos · 3 camas",
    price: "₡65,000 / noche",
  }));

  const latitude = 9.93333; // Y
  const longitude = -84.08333; // X

  const { companyid } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const cardWidth = 260 + 16;
    scrollRef.current.scrollBy({
      left: direction * cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>

      <section className="profilePage">
        {/* Izquierda */}
        <div className="profileLeft">
          <h2>Información</h2>

          <div className="userHeader">
            <FaUserCircle className="userIcon" />
            <span className="userName">Looking.com</span>
          </div>

          <div className="infoRow">
            <div>
              <small>Cédula Jurídica</small>
              <p>3102703047</p>
            </div>
            <div>
              <small>Tipo de Empresa</small>
              <p>Apartamentos</p>
            </div>
            <div>
              <small>Página Web</small>
              <p>
                <a
                  href="https://looking.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="externalLink"
                >
                  looking.com
                </a>
              </p>
            </div>
          </div>

          <h2>Amenidades</h2>

          <div className="amenities">
            <div className="amenitiesWrap">
              <ul className="amenitiesList">
                <li>
                  <FaCheck />
                  Wi-Fi de alta velocidad
                </li>
                <li>
                  <FaCheck />
                  Parqueo gratuito
                </li>
                <li>
                  <FaCheck />
                  Limpieza incluida
                </li>
                <li>
                  <FaCheck />
                  Aire acondicionado
                </li>
                <li>
                  <FaCheck />
                  Agua caliente
                </li>
                <li>
                  <FaCheck />
                  Televisión por cable / Smart TV
                </li>
                <li>
                  <FaCheck />
                  Cocina equipada
                </li>
                <li>
                  <FaCheck />
                  Ropa de cama y toallas
                </li>
                <li>
                  <FaCheck />
                  Acceso seguro
                </li>
                <li>
                  <FaCheck />
                  Pet-friendly
                </li>
              </ul>
            </div>
          </div>

          <h2>Información de Contacto</h2>

          <div className="infoRow">
            <div>
              <small>Correo Electrónico</small>
              <p>juan@email.com</p>
            </div>

            <div>
              <small>Teléfono</small>
              <p>+506 8888-8888</p>
            </div>

            <div>
              <small>Dirección</small>
              <div className="addressBlock">
                <p>San José</p>
                <p>Central</p>
                <p>Carmen</p>
                <p>200m norte del parque</p>
              </div>
            </div>
          </div>

          <div className="infoRow">
            <div>
              <small>Ubicación</small>

              <div className="mapPreview">
                <iframe
                  width="100%"
                  height="220"
                  style={{ border: 0, borderRadius: "12px" }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/view?key=${
                    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                  }&center=${latitude},${longitude}&zoom=16`}
                />
              </div>
            </div>
            <div className="socialBlock">
              <small>Redes Sociales</small>

              <div className="socialIcons">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>

                <a
                  href="https://wa.me/50688888888"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp />
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>

          <div className="profileButtons">
            <button className="buttonMain cancel">Editar Información</button>
            <button className="buttonMain cancel">Cambiar Contraseña</button>
            <button
              className="buttonMain delete"
              onClick={() => {
                if (
                  window.confirm(
                    "Esta acción no se puede deshacer. ¿Desea continuar?",
                  )
                ) {
                  navigate("/");
                }
              }}
            >
              Eliminar Cuenta
            </button>
          </div>
        </div>

        {/* Derecha */}
        <div className="profileRight">
          <h2>Servicios</h2>

          <div className="historyWrapper">
            <button className="arrow" onClick={() => scroll(-1)}>
              ◀
            </button>

            <div className="historyScroller" ref={scrollRef}>
              {mockRooms.map((rooms) => (
                <div
                  key={rooms.id}
                  className="historyCard"
                  onClick={() => navigate(`/preview/${rooms.roomId}`)}
                >
                  <div className="historyImage" />

                  <div className="historyInfo">
                    <h4>{rooms.name}</h4>
                    <p className="roomDesc">{rooms.desc}</p>
                    <p className="roomMeta">{rooms.meta}</p>

                    <div className="priceBlock">
                      <strong>{rooms.price}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="arrow" onClick={() => scroll(1)}>
              ▶
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default CompanyProfile;
