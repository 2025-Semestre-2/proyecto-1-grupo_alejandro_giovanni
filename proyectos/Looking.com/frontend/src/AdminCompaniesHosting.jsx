import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit2, FiHome, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import "./AdminCompaniesHosting.css";

function AdminCompaniesHosting() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCompany, setActiveCompany] = useState(null);

  const companies = [
    {
      id: "3-101-555555",
      nombre: "Hotel Monteverde",
      correo: "info@monteverdehotel.com",
      telefono: "2645-8899",
      provincia: "Puntarenas",
      canton: "Monteverde",
      distrito: "Santa Elena",
    },
    {
      id: "3-102-777777",
      nombre: "Casa Caribe Lodge",
      correo: "contacto@casacaribe.com",
      telefono: "2750-3322",
      provincia: "Limón",
      canton: "Talamanca",
      distrito: "Puerto Viejo",
    },
  ];

  const [rooms, setRooms] = useState([
    {
      id: 1,
      companyId: "3-101-555555",
      nombre: "Habitación Deluxe",
      descripcion: "Vista al bosque",
      precio: 120,
      personas: 2,
    },
    {
      id: 2,
      companyId: "3-101-555555",
      nombre: "Suite Familiar",
      descripcion: "Ideal para familias",
      precio: 180,
      personas: 4,
    },
    {
      id: 3,
      companyId: "3-102-777777",
      nombre: "Habitación Estándar",
      descripcion: "Cerca de la playa",
      precio: 90,
      personas: 2,
    },
  ]);

  const filteredCompanies = useMemo(() => {
    const term = search.toLowerCase();
    return companies.filter((c) =>
      [c.nombre, c.correo, c.id].some((v) => v.toLowerCase().includes(term)),
    );
  }, [search]);

  const companyRooms = rooms.filter((r) => r.companyId === activeCompany?.id);

  const handleAddRoom = () => {
    const fakeRoomId = Date.now();
    navigate(`/editActivity/${fakeRoomId}`);
  };

  const handleDeleteRoom = (roomId) => {
    const confirmed = window.confirm(
      "Esta acción no se puede deshacer. ¿Desea continuar?",
    );

    if (!confirmed) return;

    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>

      <div className="adminCompaniesPage">
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
                <th>Cuartos</th>
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

      {/* modal */}
      {activeCompany && (
        <div className="modalBackdrop">
          <div className="roomsModal">
            <div className="modalHeader">
              <h3>Habitaciones – {activeCompany.nombre}</h3>
              <button onClick={() => setActiveCompany(null)}>
                <FiX size={18} />
              </button>
            </div>

            <ul className="roomsList">
              {companyRooms.map((r) => (
                <li key={r.id}>
                  <div>
                    <strong>{r.nombre}</strong>
                    <span>
                      ₡{r.precio} · {r.personas} personas
                    </span>
                  </div>
                  <div className="roomAction">
                    <Link
                      to={`/editRoomInfo/${r.id}`}
                      className="editUserBtn"
                      title="Editar habitación"
                    >
                      <FiEdit2 size={16} />
                    </Link>
                    <button
                      className="deleteRoomBtn"
                      title="Eliminar habitación"
                      onClick={() => {
                        window.confirm(
                          "Esta acción no se puede deshacer. ¿Desea continuar?",
                        );
                      }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}

              {!companyRooms.length && (
                <li className="emptyRooms">
                  Esta empresa no tiene habitaciones registradas
                </li>
              )}
            </ul>
            <button
              className="addRoomFooterBtn"
              onClick={() => navigate(`/editRoomInfo/${Date.now()}`)}
            >
              <FiPlus size={16} />
              Agregar habitación
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminCompaniesHosting;
