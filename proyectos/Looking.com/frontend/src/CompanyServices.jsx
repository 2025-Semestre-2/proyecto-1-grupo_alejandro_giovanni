import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./CompanyServices.css";

export default function CompanyServices() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:3001/company-room-types", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch rooms");

        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleDelete = async (tipoHabitacionId) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este tipo de habitación?\n\nEsto eliminará también los cuartos asociados.",
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:3001/company-room-types/${tipoHabitacionId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete room type");
      }

      setRooms((prev) =>
        prev.filter((r) => r.TipoHabitacionId !== tipoHabitacionId),
      );
    } catch (err) {
      console.error("Error deleting room:", err);
      alert("No se pudo eliminar el tipo de habitación");
    }
  };

  const handleAddRoom = async () => {
    try {
      const res = await fetch("http://localhost:3001/new-room-type", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to create room type");
      }

      const roomsRes = await fetch("http://localhost:3001/company-room-types", {
        credentials: "include",
      });

      const data = await roomsRes.json();
      setRooms(data);
    } catch (err) {
      console.error("Error adding room:", err);
      alert("No se pudo crear la habitación");
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.TipoHabitacionNombre?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <p style={{ padding: 20 }}>Cargando habitaciones…</p>;
  }

  return (
    <div className="companyServices">
      <PageTopContent>
        <PageTop />
      </PageTopContent>

      <div className="searchBar">
        <input
          type="text"
          placeholder="Buscar habitación..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="resultsGrid">
        {filteredRooms.map((room) => (
          <div key={room.TipoHabitacionId} className="roomCardWrapper">
            <div className="roomActions">
              <FaEdit
                title="Editar"
                onClick={() =>
                  navigate(`/editRoomInfo/${room.TipoHabitacionId}`)
                }
              />
              <FaTrash
                title="Eliminar"
                onClick={() => handleDelete(room.TipoHabitacionId)}
              />
            </div>

            <div
              className="roomCard"
              onClick={() =>
                navigate(`/preview/rooms/${room.TipoHabitacionId}`)
              }
            >
              <div
                className="roomImage"
                style={{
                  backgroundImage: room.UrlImagen
                    ? `url(${room.UrlImagen})`
                    : "none",
                }}
              />

              <div className="roomInfo">
                <h4>{room.TipoHabitacionNombre}</h4>

                <p className="roomDesc">{room.Descripcion}</p>

                <p className="roomMeta">
                  Hasta {room.NumeroDePersonas} personas
                </p>

                <p className="roomPrice">
                  ₡{Number(room.Precio).toLocaleString()} / noche
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="roomCard addRoomCard" onClick={handleAddRoom}>
          <FaPlus size={32} />
          <p>Añadir Nuevo Cuarto</p>
        </div>
      </div>
    </div>
  );
}
