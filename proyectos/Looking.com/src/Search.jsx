import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Search.css";

function Search() {
  const [rooms, setRooms] = useState(1);
  const [price, setPrice] = useState(65000);
  const navigate = useNavigate();

  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>

      <div className="searchPage">
        {/* Filtros */}
        <aside className="filters">
          <h3>Filtros</h3>

          <div className="filterGroup">
            <label>Tipo de Propiedad</label>
            <div className="checkboxGroup">
              <label>
                <input type="checkbox" /> Hotel
              </label>
              <label>
                <input type="checkbox" /> Apartamento
              </label>
              <label>
                <input type="checkbox" /> Casa
              </label>
            </div>
          </div>

          <div className="filterGroup rangeFilter">
            <label>
              Número de cuartos
              <span className="filterValue">{rooms}</span>
            </label>

            <input
              type="range"
              min="1"
              max="6"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            />
          </div>

          <div className="filterGroup rangeFilter">
            <label>
              Precio máximo (₡)
              <span className="filterValue">
                {Number(price).toLocaleString("es-CR")}
              </span>
            </label>

            <input
              type="range"
              min="20000"
              max="300000"
              step="5000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="filterGroup">
            <label>Comodidades</label>
            <div className="checkboxGroup">
              <label>
                <input type="checkbox" /> Wi-Fi
              </label>
              <label>
                <input type="checkbox" /> Piscina
              </label>
              <label>
                <input type="checkbox" /> A/C
              </label>
              <label>
                <input type="checkbox" /> Parqueo
              </label>
            </div>
          </div>
        </aside>

        {/* Resultados */}
        <section className="results">
          <div className="resultsGrid">
            {Array.from({ length: 12 }).map((_, i) => {
              const roomId = i + 1;

              return (
                <div
                  key={roomId}
                  className="roomCard"
                  onClick={() => navigate(`/preview/${roomId}`)}
                >
                  <div className="roomImage" />
                  <div className="roomInfo">
                    <h4>Hotel Ejemplo {roomId}</h4>
                    <p className="roomDesc">
                      Cómoda habitación cerca del centro
                    </p>
                    <p className="roomMeta">2 cuartos · 3 camas</p>
                    <p className="roomPrice">₡65,000 / noche</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

export default Search;
