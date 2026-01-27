import { useState, useMemo } from "react";
import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import "./AdminUsers.css";

import { Link } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";

function AdminUsers() {
  const [search, setSearch] = useState("");

  const users = [
    {
      id: 1,
      nombre: "Juan",
      primerApellido: "Pérez",
      segundoApellido: "Ramírez",
      correo: "juan.perez@email.com",
      numeroIdentificacion: "1-1234-5678",
      pais: "Costa Rica",
      provincia: "San José",
      canton: "Central",
      distrito: "Carmen",
      telefono: "8888-1111",
      isAdmin: true,
    },
    {
      id: 2,
      nombre: "María",
      primerApellido: "González",
      segundoApellido: null,
      correo: "maria.gonzalez@email.com",
      numeroIdentificacion: "2-2345-6789",
      pais: "Costa Rica",
      provincia: "Alajuela",
      canton: "Alajuela",
      distrito: "San José",
      telefono: "8999-2222",
      isAdmin: false,
    },
    {
      id: 3,
      nombre: "Carlos",
      primerApellido: "Vargas",
      segundoApellido: "Mora",
      correo: "carlos.vargas@email.com",
      numeroIdentificacion: "3-3456-7890",
      pais: "Costa Rica",
      provincia: "Heredia",
      canton: "Belén",
      distrito: "San Antonio",
      telefono: "8777-3333",
      isAdmin: false,
    },
    {
      id: 4,
      nombre: "Ana",
      primerApellido: "Soto",
      segundoApellido: "López",
      correo: "ana.soto@email.com",
      numeroIdentificacion: "4-4567-8901",
      pais: "Costa Rica",
      provincia: "Cartago",
      canton: "Central",
      distrito: "Oriental",
      telefono: "8666-4444",
      isAdmin: true,
    },
  ];

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();

    return users.filter((u) =>
      [
        u.nombre,
        u.primerApellido,
        u.segundoApellido,
        u.correo,
        u.numeroIdentificacion,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term)),
    );
  }, [search, users]);

  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>

      <div className="adminUsersPage">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Buscar usuario por nombre, correo o identificación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tableColumn">
          <table className="reportsTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Editar</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u, idx) => (
                <tr key={u.id}>
                  <td>{idx + 1}</td>
                  <td>
                    {u.nombre} {u.primerApellido}
                    {u.segundoApellido ? ` ${u.segundoApellido}` : ""}
                  </td>
                  <td>{u.correo}</td>
                  <td>
                    <span className={u.isAdmin ? "roleAdmin" : "roleUser"}>
                      {u.isAdmin ? "Admin" : "Usuario"}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/profile/${u.id}`}
                      className="editUserBtn"
                      title="Editar usuario"
                    >
                      <FiEdit2 size={18} />
                    </Link>
                  </td>
                </tr>
              ))}

              {!filteredUsers.length && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", opacity: 0.6 }}>
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminUsers;
