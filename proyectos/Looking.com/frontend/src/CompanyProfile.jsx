import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import { useNavigate, useParams } from "react-router-dom";
import "./CompanyProfile.css";
import { useRef } from "react";
import { useAuth } from "./context/AuthContext";

import { FaUserCircle } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTwitter } from "react-icons/fa";

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const SOCIAL_ICONS = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
  twitter: FaTwitter,
};

const generateFakeCompanyProfile = ({ companyid }) => {
  return {
    id: companyid,
    name: "Looking.com",
    legalId: "3102703047",
    companyType: "Recreación", //Recreación, Apartamentos

    website: "https://looking.com", // optional

    amenities: [
      "Wi-Fi de alta velocidad",
      "Parqueo gratuito",
      "Limpieza incluida",
      "Aire acondicionado",
      "Agua caliente",
      "Televisión por cable / Smart TV",
      "Cocina equipada",
      "Ropa de cama y toallas",
      "Acceso seguro",
      "Pet-friendly",
    ], // optional

    contact: {
      email: "juan@email.com",
      phone: "+506 8888-8888",
      address: {
        province: "San José",
        canton: "Central",
        district: "Carmen",
        details: "200m norte del parque",
      },
    },

    location: {
      latitude: 9.93333,
      longitude: -84.08333,
    },

    socialMedia: [
      { name: "facebook", url: "https://facebook.com" },
      { name: "instagram", url: "https://instagram.com" },
      { name: "whatsapp", url: "https://wa.me/50688888888" },
      { name: "twitter", url: "https://twitter.com" },
    ], // optional

    services: Array.from({ length: 8 }).map((_, i) => ({
      id: i + 1,
      name: `Habitación ${i + 1}`,
      desc: "Cómoda habitación cerca del centro",
      meta: "2 cuartos · 3 camas",
      price: "₡65,000 / noche",
    })),
  };
};

function CompanyProfile() {
  const mockRooms = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `Habitación ${i + 1}`,
    desc: "Cómoda habitación cerca del centro",
    meta: "2 cuartos · 3 camas",
    price: "₡65,000 / noche",
  }));

  const latitude = 9.93333;
  const longitude = -84.08333;

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

  const { session, isAdmin } = useAuth();
  const isOwnCompany = session?.companyId === companyid;
  const canEditCompany = isOwnCompany || isAdmin;

  const company = generateFakeCompanyProfile({ companyid });

  const isRecreationCompany = company.companyType === "Recreación";

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
            <span className="userName">{company.name}</span>
          </div>

          <div className="infoRow">
            <div>
              <small>Cédula Jurídica</small>
              <p>{company.legalId}</p>
            </div>

            <div>
              <small>Tipo de Empresa</small>
              <p>{company.companyType}</p>
            </div>

            {company.website && (
              <div>
                <small>Página Web</small>
                <p>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="externalLink"
                  >
                    {company.website.replace("https://", "")}
                  </a>
                </p>
              </div>
            )}
          </div>

          {company.amenities?.length > 0 && (
            <>
              <h2>Amenidades</h2>

              <div className="amenities">
                <div className="amenitiesWrap">
                  <ul className="amenitiesList">
                    {company.amenities.map((amenity, i) => (
                      <li key={i}>
                        <FaCheck />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          <h2>Información de Contacto</h2>

          <div className="infoRow">
            <div>
              <small>Correo Electrónico</small>
              <p>{company.contact.email}</p>
            </div>

            <div>
              <small>Teléfono</small>
              <p>{company.contact.phone}</p>
            </div>

            <div>
              <small>Dirección</small>
              <div className="addressBlock">
                <p>{company.contact.address.province}</p>
                <p>{company.contact.address.canton}</p>
                <p>{company.contact.address.district}</p>
                <p>{company.contact.address.details}</p>
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
                  src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_KEY}&center=${company.location.latitude},${company.location.longitude}&zoom=16`}
                />
              </div>
            </div>

            {company.socialMedia?.length > 0 && (
              <div className="socialBlock">
                <small>Redes Sociales</small>

                <div className="socialIcons">
                  {company.socialMedia.map(({ name, url }, i) => {
                    const Icon = SOCIAL_ICONS[name];
                    if (!Icon) return null;

                    return (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {canEditCompany && (
            <div className="profileButtons">
              <button
                className="buttonMain cancel"
                onClick={() => navigate(`/editCompanyInfo/${companyid}`)}
              >
                Editar Información
              </button>

              <button
                className="buttonMain cancel"
                onClick={() => navigate(`/passwordChange/company/${companyid}`)}
              >
                Cambiar Contraseña
              </button>

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
          )}
        </div>

        {/* Derecha */}
        <div className="profileRight">
          <h2>Servicios</h2>

          <div className="historyWrapper">
            <button className="arrow" onClick={() => scroll(-1)}>
              ◀
            </button>

            <div className="historyScroller" ref={scrollRef}>
              {company.services.map((service) => (
                <div
                  key={service.id}
                  className="historyCard"
                  onClick={() =>
                    navigate(
                      isRecreationCompany
                        ? `/preview/activities/${service.id}`
                        : `/preview/rooms/${service.id}`,
                    )
                  }
                >
                  <div className="historyImage" />

                  <div className="historyInfo">
                    <h4>{service.name}</h4>
                    <p className="roomDesc">{service.desc}</p>
                    {!isRecreationCompany && (
                      <p className="roomMeta">{service.meta}</p>
                    )}

                    <div className="priceBlock">
                      <strong>{service.price}</strong>
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
