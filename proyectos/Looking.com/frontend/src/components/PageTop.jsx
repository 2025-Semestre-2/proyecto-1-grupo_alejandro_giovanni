import { useNavigate, useLocation } from "react-router-dom";
import "./PageTop.css";

import { FaUserCircle } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

function PageTop() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const {
    session,
    isGuest,
    isUser,
    isAdmin,
    isCompany,
    isHostingCompany,
    isEntertainmentCompany,
  } = useAuth();

  return (
    <>
      <div className="header">
        <div className="userHeader">
          <button className="buttonLogo" onClick={() => navigate("/")}>
            <span>Looking.com</span>

            {isAdmin && <span className="roleTag">Admin</span>}
            {isCompany && <span className="roleTag">Empresa</span>}
          </button>
        </div>

        <div className="headerActions">
          {isGuest && (
            <>
              <button
                className="buttonSub2"
                onClick={() => navigate("/signupCompany")}
              >
                Registrar Empresa
              </button>
              <button
                className="buttonMain"
                onClick={() => navigate("/signupUser")}
              >
                Crear Cuenta
              </button>
              <button className="buttonMain" onClick={() => navigate("/login")}>
                Iniciar Sesión
              </button>
            </>
          )}

          {(isUser || isAdmin) && (
            <>
              <button className="buttonSub2" onClick={() => navigate("/")}>
                Cerrar Sesión
              </button>

              <button
                className="profileButton"
                onClick={() => navigate(`/profile/${session.userId}`)}
              >
                <span>{session.userName}</span>
                <FaUserCircle size={30} />
              </button>
            </>
          )}

          {isCompany && (
            <>
              <button className="buttonSub2" onClick={() => navigate("/")}>
                Cerrar Sesión
              </button>

              <button
                className="profileButton"
                onClick={() => navigate(`/companyProfile/${session.companyId}`)}
              >
                <span title={session.companyName}>
                  {session.companyName.slice(0, 30)}
                </span>
                <FaHome size={30} />
              </button>
            </>
          )}
        </div>
      </div>

      {(isGuest || isUser) && (
        <div className="searchSelector">
          <button
            className="buttonSub"
            onClick={() => navigate(`/search/${"rooms"}`)}
          >
            Reservaciones
          </button>
          <button
            className="buttonSub"
            onClick={() => navigate(`/search/${"activities"}`)}
          >
            Actividades
          </button>
        </div>
      )}

      {isAdmin && (
        <div className="searchSelector">
          <button className="buttonSub" onClick={() => navigate("/adminUsers")}>
            Usuarios
          </button>
          <button
            className="buttonSub"
            onClick={() => navigate("/adminCompaniesHosting")}
          >
            Empresas Hospedaje
          </button>
          <button
            className="buttonSub"
            onClick={() => navigate("/adminCompaniesEntertainment")}
          >
            Empresas Actividades
          </button>
        </div>
      )}

      {isHostingCompany && (
        <div className="searchSelector">
          <button
            className="buttonSub"
            onClick={() => navigate("/companyServices")}
          >
            Mis Cuartos
          </button>
          <button
            className="buttonSub"
            onClick={() => navigate("/companyBookings")}
          >
            Reservaciones
          </button>
          <button
            className="buttonSub"
            onClick={() => navigate("/companyReports")}
          >
            Reportes
          </button>
        </div>
      )}

      {isEntertainmentCompany && (
        <div className="searchSelector">
          <button
            className="buttonSub"
            onClick={() => navigate("/companyActivities")}
          >
            Mis experiencias
          </button>
          <button
            className="buttonSub"
            onClick={() => navigate("/companyReports")}
          >
            Reportes
          </button>
        </div>
      )}


      {isHome && (isGuest || isUser) && (
        <>
          <h1>Encuentra tu siguiente estadía o aventura</h1>
          <h2>Hoteles, actividades, y mucho más</h2>
        </>
      )}

      {isHome && isCompany && (
        <>
          <h1>Haz crecer tu negocio</h1>
          <h2>Servicios y reportes en un solo lugar</h2>
        </>
      )}

      {isHome && isAdmin && (
        <>
          <h1>Centro de control</h1>
          <h2>Monitorea y administra la plataforma</h2>
        </>
      )}

      {!isHome && <div className="pageTopDivider" />}
    </>
  );
}

export default PageTop;
