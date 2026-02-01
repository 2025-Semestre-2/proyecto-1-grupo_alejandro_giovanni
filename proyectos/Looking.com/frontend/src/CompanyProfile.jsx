import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import { useNavigate, useParams } from "react-router-dom";
import "./CompanyProfile.css";
import { useRef, useState, useEffect } from "react";

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

function CompanyProfile() {
  const { companyid } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const cardWidth = 260 + 16;
    scrollRef.current.scrollBy({
      left: direction * cardWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("http://localhost:3001/whoamisession", {
          credentials: "include",
        });
        const data = await res.json();
        setSession(data);
      } catch (err) {
        console.error("Error fetching session:", err);
        setSession({ loggedIn: false });
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/company-profile/${companyid}`,
          {
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Empresa no encontrada");

        const data = await res.json();
        setCompany(data);
      } catch (err) {
        console.error("Error fetching company:", err);
      }
    };

    fetchCompany();
  }, [companyid]);

  const isOwnCompany = session?.usuarioId === companyid;
  const canEditCompany = isOwnCompany || session?.role === "admin";
  const isRecreationCompany =
    company?.companyType?.toLowerCase() === "recreación";

  if (loading || !company) {
    return <div className="loading">Cargando perfil...</div>;
  }

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
              <p>{company.cedulaJuridica}</p>
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
              <p>{company.contact.phone2}</p>
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
                onClick={async () => {
                  if (
                    window.confirm(
                      "Esta acción no se puede deshacer. ¿Desea continuar?",
                    )
                  ) {
                    try {
                      const response = await fetch(
                        `http://localhost:3001/companies/${form.legalId}`,
                        {
                          method: "DELETE",
                        },
                      );

                      if (!response.ok) {
                        throw new Error("Error eliminando la empresa");
                      }

                      alert("Empresa eliminada correctamente");
                      navigate("/");
                    } catch (error) {
                      console.error(error);
                      alert("No se pudo eliminar la empresa");
                    }
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
