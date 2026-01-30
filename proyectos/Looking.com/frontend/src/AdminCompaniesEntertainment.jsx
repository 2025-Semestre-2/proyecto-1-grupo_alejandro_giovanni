import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit2, FiHome, FiX, FiTrash2, FiPlus } from "react-icons/fi";
import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import "./AdminCompaniesEntertainment.css";

function AdminCompaniesEntertainment() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCompany, setActiveCompany] = useState(null);

  const companies = [
    {
      id: "3-201-888888",
      nombre: "Aventura Tica",
      correo: "info@aventuratica.com",
      telefono: "2233-4455",
      provincia: "Alajuela",
      canton: "San Carlos",
      distrito: "La Fortuna",
    },
    {
      id: "3-202-999999",
      nombre: "Pacífico Tours",
      correo: "contacto@pacificotours.com",
      telefono: "2661-7788",
      provincia: "Puntarenas",
      canton: "Garabito",
      distrito: "Jacó",
    },
  ];

  const [activities, setActivities] = useState([
    {
      id: 1,
      companyId: "3-201-888888",
      nombre: "Canopy en la selva",
      descripcion: "Recorrido aéreo entre árboles",
      personaContacto: "Luis Hernández",
      precio: 65,
      urlImagen: "https://placehold.co/300x200",
    },
    {
      id: 2,
      companyId: "3-201-888888",
      nombre: "Caminata al volcán",
      descripcion: "Tour guiado al volcán Arenal",
      personaContacto: "María Rojas",
      precio: 40,
      urlImagen: "https://placehold.co/300x200",
    },
    {
      id: 3,
      companyId: "3-202-999999",
      nombre: "Surf para principiantes",
      descripcion: "Clases básicas de surf",
      personaContacto: "Carlos Jiménez",
      precio: 55,
      urlImagen: "https://placehold.co/300x200",
    },
  ]);

  const filteredCompanies = useMemo(() => {
    const term = search.toLowerCase();
    return companies.filter((c) =>
      [c.nombre, c.correo, c.id].some((v) =>
        v.toLowerCase().includes(term)
      )
    );
  }, [search]);

  const companyActivities = activities.filter(
    (a) => a.companyId === activeCompany?.id
  );

  const handleDeleteActivity = (activityId) => {
    window.confirm(
      "Esta acción no se puede deshacer. ¿Desea continuar?"
    );
  };

  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>

      <div className="adminCompaniesPage">
        {/* 🔍 Search */}
        <div className="searchBar">
          <input
            type="text"
            placeholder="Buscar empresa por nombre, correo o cédula jurídica..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tableColumn">
          <table className="reportsTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Empresa</th>
                <th>Correo</th>
                <th>Ubicación</th>
                <th>Actividades</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((c, idx) => (
                <tr key={c.id}>
                  <td>{idx + 1}</td>
                  <td>{c.nombre}</td>
                  <td>{c.correo}</td>
                  <td>
                    {c.provincia}, {c.canton}, {c.distrito}
                  </td>
                  <td>
                    <button
                      className="roomsBtn"
                      onClick={() => setActiveCompany(c)}
                    >
                      <FiHome size={16} /> Ver
                    </button>
                  </td>
                  <td>
                    <Link
                      to={`/companyProfile/${c.id}`}
                      className="editUserBtn"
                      title="Editar empresa"
                    >
                      <FiEdit2 size={18} />
                    </Link>
                  </td>
                </tr>
              ))}

              {!filteredCompanies.length && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", opacity: 0.6 }}>
                    No se encontraron empresas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeCompany && (
        <div className="modalBackdrop">
          <div className="roomsModal">
            <div className="modalHeader">
              <h3>Actividades – {activeCompany.nombre}</h3>
              <button onClick={() => setActiveCompany(null)}>
                <FiX size={18} />
              </button>
            </div>

            <ul className="roomsList">
              {companyActivities.map((a) => (
                <li key={a.id}>
                  <div>
                    <strong>{a.nombre}</strong>
                    <span>₡{a.precio}</span>
                  </div>

                  <div className="roomAction">
                    <Link
                      to={`/editActivityInfo/${a.id}`}
                      className="editUserBtn"
                      title="Editar actividad"
                    >
                      <FiEdit2 size={16} />
                    </Link>

                    <button
                      className="deleteRoomBtn"
                      title="Eliminar actividad"
                      onClick={() => handleDeleteActivity(a.id)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}

              {!companyActivities.length && (
                <li className="emptyRooms">
                  Esta empresa no tiene actividades registradas
                </li>
              )}
            </ul>

            <button
              className="addRoomFooterBtn"
              onClick={() =>
                navigate(`/editActivityInfo/${Date.now()}`)
              }
            >
              <FiPlus size={16} />
              Agregar actividad
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminCompaniesEntertainment;
