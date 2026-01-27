import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./CompanyServices.css";

const mockRooms = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `Habitación ${i + 1}`,
  desc: "Cómoda habitación cerca del centro",
  meta: "2 cuartos · 3 camas",
  price: "₡65,000 / noche",
}));

export default function CompanyServices() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState(mockRooms);
  const handleDelete = (roomId) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este cuarto?",
    );

    if (confirmed) {
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase()),
  );

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
          <div key={room.id} className="roomCardWrapper">
            <div className="roomActions">
              <FaEdit
                title="Editar"
                onClick={() => navigate(`/editRoomInfo/${room.id}`)}
              />
              <FaTrash title="Eliminar" onClick={() => handleDelete(room.id)} />
            </div>

            <div
              className="roomCard"
              onClick={() => navigate(`/preview/${room.id}`)}
            >
              <div className="roomImage" />
              <div className="roomInfo">
                <h4>{room.name}</h4>
                <p className="roomDesc">{room.desc}</p>
                <p className="roomMeta">{room.meta}</p>
                <p className="roomPrice">{room.price}</p>
              </div>
            </div>
          </div>
        ))}

        <div
          className="roomCard addRoomCard"
          onClick={() => navigate("/company/rooms/new")}
        >
          <FaPlus size={32} />
          <p>Añadir Nuevo Cuarto</p>
        </div>
      </div>
    </div>
  );
}
