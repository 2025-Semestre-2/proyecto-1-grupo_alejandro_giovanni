import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import COSTA_RICA_LOCATIONS from "../data/crLocations";
import "./PageTop.css";

import { FaUserCircle } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

function PageTop() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [searchType, setSearchType] = useState("stays");

  const [province, setProvince] = useState("");
  const [canton, setCanton] = useState("");
  const [district, setDistrict] = useState("");

  const provinces = Object.keys(COSTA_RICA_LOCATIONS);
  const cantons = province ? Object.keys(COSTA_RICA_LOCATIONS[province]) : [];
  const districts =
    province && canton ? COSTA_RICA_LOCATIONS[province][canton] : [];

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

      {isAdmin && (
        <div className="searchSelector">
          <button className="buttonSub" onClick={() => navigate("/adminUsers")}>
            Usuarios
          </button>
          <button
            className="buttonSub"
            onClick={() => navigate("/adminCompanies")}
          >
            Empresas
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
            onClick={() => navigate("/companyServices")}
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
          {searchType === "stays" ? (
            <>
              <h1>Encuentra tu siguiente estadía</h1>
              <h2>Hoteles, departamentos, y mucho más</h2>
            </>
          ) : (
            <>
              <h1>Encuentra tu siguiente aventura</h1>
              <h2>Explora todos los rincones de nuestra cultura</h2>
            </>
          )}
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

      {!isAdmin && !isCompany && (
        <div className="searchBar">
          <div className="searchSegment">
            <label>
              Provincia <span style={{ color: "red" }}>*</span>
            </label>
            <select
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setCanton("");
                setDistrict("");
              }}
              required
            >
              <option value="">Seleccionar</option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          <div className="searchSegment">
            <label>Cantón</label>
            <select
              value={canton}
              onChange={(e) => {
                setCanton(e.target.value);
                setDistrict("");
              }}
              disabled={!province}
            >
              <option value="">Todos</option>
              {cantons.map((cant) => (
                <option key={cant} value={cant}>
                  {cant}
                </option>
              ))}
            </select>
          </div>

          <div className="searchSegment">
            <label>Distrito</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!canton}
            >
              <option value="">Todos</option>
              {districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {searchType === "stays" && (
            <>
              <div className="searchDivider" />

              <div className="searchSegment">
                <label>
                  Fecha Llegada <span style={{ color: "red" }}>*</span>
                </label>
                <input type="date" />
              </div>

              <div className="searchSegment">
                <label>
                  Fecha Salida <span style={{ color: "red" }}>*</span>
                </label>
                <input type="date" />
              </div>

              <div className="searchDivider" />

              <div className="searchSegment">
                <label>
                  Personas <span style={{ color: "red" }}>*</span>
                </label>
                <input type="number" min="1" defaultValue="2" />
              </div>
            </>
          )}

          <button
            style={{ marginLeft: "auto" }}
            className="buttonMain"
            disabled={!province}
            onClick={() =>
              navigate("/search", {
                state: { province, canton, district },
              })
            }
          >
            Buscar
          </button>
        </div>
      )}
      <div className="pageTopDivider" />
    </>
  );
}

export default PageTop;
