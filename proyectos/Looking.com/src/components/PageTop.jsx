import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./PageTop.css";

function PageTop() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <div className="header">
        <div className="userHeader">
          <button className="buttonLogo" onClick={() => navigate("/")}>
            Looking.com
          </button>
        </div>

        <div className="headerActions">
          <button className="buttonSub2">Registrar Empresa</button>
          <button className="buttonMain">Crear Cuenta</button>
          <button className="buttonMain">Iniciar Sesión</button>
        </div>
      </div>

      <div className="searchSelector">
        <button className="buttonSub">Estadías</button>
        <button className="buttonSub">Experiencias</button>
      </div>

      {isHome && (
        <>
          <h1>Encuentra tu siguiente estadía</h1>
          <h2>Hoteles, departamentos, y mucho más...</h2>
        </>
      )}

      <div className="searchBar">
        <div className="searchSegment">
          <label>Provincia</label>
          <select>
            <option>Provincia</option>
            <option>San José</option>
            <option>Alajuela</option>
            <option>Cartago</option>
            <option>Heredia</option>
            <option>Guanacaste</option>
            <option>Puntarenas</option>
            <option>Limón</option>
          </select>
        </div>

        <div className="searchSegment">
          <label>Cantón</label>
          <select>
            <option>Cantón</option>
            <option>San José</option>
            <option>Alajuela</option>
            <option>Cartago</option>
            <option>Heredia</option>
            <option>Guanacaste</option>
            <option>Puntarenas</option>
            <option>Limón</option>
          </select>
        </div>

        <div className="searchSegment">
          <label>Distrito</label>
          <select>
            <option>Distrito</option>
            <option>San José</option>
            <option>Alajuela</option>
            <option>Cartago</option>
            <option>Heredia</option>
            <option>Guanacaste</option>
            <option>Puntarenas</option>
            <option>Limón</option>
          </select>
        </div>

        <div className="searchDivider" />

        <div className="searchSegment">
          <label>Fecha Llegada</label>
          <input type="date" />
        </div>

        <div className="searchSegment">
          <label>Fecha Salida</label>
          <input type="date" />
        </div>

        <div className="searchDivider" />

        <div className="searchSegment">
          <label>Personas</label>
          <input type="number" min="1" defaultValue="2" />
        </div>

        <button
          style={{ marginLeft: "auto" }}
          className="buttonMain"
          onClick={() => navigate("/search")}
        >
          Buscar
        </button>
      </div>
    </>
  );
}

export default PageTop;
