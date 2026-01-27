import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./CompanyServices.css";

const mockActivities = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `Actividad ${i + 1}`,
  desc: "Actividad divertida cerca del centro",
  price: "₡20,000 / persona",
}));

export default function CompanyActivities() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activities, setActivities] = useState(mockActivities);

  const handleDelete = (activityId) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta actividad?",
    );

    if (confirmed) {
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
    }
  };

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="companyServices">
      <PageTopContent>
        <PageTop />
      </PageTopContent>

      <div className="searchBar">
        <input
          type="text"
          placeholder="Buscar actividad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="resultsGrid">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="roomCardWrapper">
            <div className="roomActions">
              <FaEdit
                title="Editar"
                onClick={() =>
                  navigate(`/editActivityInfo/${activity.id}`)
                }
              />
              <FaTrash
                title="Eliminar"
                onClick={() => handleDelete(activity.id)}
              />
            </div>

            <div
              className="roomCard"
              onClick={() => navigate(`/preview/${activity.id}`)}
            >
              <div className="roomImage" />
              <div className="roomInfo">
                <h4>{activity.name}</h4>
                <p className="roomDesc">{activity.desc}</p>
                <p className="roomPrice">{activity.price}</p>
              </div>
            </div>
          </div>
        ))}

        <div
          className="roomCard addRoomCard"
          onClick={() => navigate("/company/activities/new")}
        >
          <FaPlus size={32} />
          <p>Añadir Nueva Actividad</p>
        </div>
      </div>
    </div>
  );
}
