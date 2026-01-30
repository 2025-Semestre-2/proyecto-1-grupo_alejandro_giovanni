import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import { StaysSearchBar, ActivitiesSearchBar } from "./components/SearchBar";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./Search.css";

const ROOM_TYPES = ["Hotel", "Apartamento", "Casa"];
const AMENITIES = ["wifi", "pool", "ac", "parking"];

const EXPERIENCE_TYPES = [
  "Kayaking",
  "Canopy",
  "Senderismo",
  "Surf",
  "Cultura",
];

const generateFakeResults = (type, params) => {
  if (type === "rooms") {
    return Array.from({ length: 20 }).map((_, i) => {
      const rooms = Math.floor(Math.random() * 6) + 1;
      const amenities = AMENITIES.filter(() => Math.random() > 0.5);

      return {
        id: i + 1,
        name: `Hotel Ejemplo ${i + 1}`,
        description: "Cómoda habitación cerca del centro",
        meta: `${rooms} cuartos · ${rooms + 1} camas`,
        price: Math.floor(Math.random() * 250000) + 20000,
        rooms,
        propertyType: ROOM_TYPES[i % ROOM_TYPES.length],
        amenities,
      };
    });
  }

  if (type === "activities") {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i + 1,
      name: `Experiencia ${EXPERIENCE_TYPES[i % EXPERIENCE_TYPES.length]}`,
      description: "Vive una experiencia inolvidable",
      experienceType: EXPERIENCE_TYPES[i % EXPERIENCE_TYPES.length],
      price: Math.floor(Math.random() * 60000) + 15000,
    }));
  }

  return [];
};

function Search() {
  const [searchParamsURL, setSearchParamsURL] = useSearchParams();
  const [propertyTypes, setPropertyTypes] = useState(
    searchParamsURL.get("type")?.split(",") || [],
  );
  const [amenities, setAmenities] = useState(
    searchParamsURL.get("amenities")?.split(",") || [],
  );
  const [experienceTypes, setExperienceTypes] = useState(
    searchParamsURL.get("experience")?.split(",") || [],
  );
  const [rooms, setRooms] = useState(Number(searchParamsURL.get("rooms")) || 1);
  const [price, setPrice] = useState(
    Number(searchParamsURL.get("price")) || 300000,
  );
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const { role } = useParams(); //"rooms", "activities"

  const today = new Date();

  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 14);

  const oneWeekAhead = new Date(today);
  oneWeekAhead.setDate(today.getDate() + 14);

  const toISO = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    setResults([]);
  }, [role]);

  useEffect(() => {
    if (!searchParams.province) return;
    setHasSearched(true);

    const fakeData = generateFakeResults(role, searchParams);
    setResults(fakeData);
  }, [role]);

  const handleSearch = useCallback(
    (params) => {
      setSearchParams((prev) => ({ ...prev, ...params }));

      const fakeData = generateFakeResults(role, params);
      setResults(fakeData);
    },
    [role],
  );

  const [searchParams, setSearchParams] = useState(() => ({
    province: searchParamsURL.get("province") || "",
    canton: searchParamsURL.get("canton") || "",
    district: searchParamsURL.get("district") || "",
    startDate: searchParamsURL.get("startDate") || toISO(oneWeekAgo),
    endDate: searchParamsURL.get("endDate") || toISO(oneWeekAhead),
    people: Number(searchParamsURL.get("people")) || 2,
  }));

  useEffect(() => {
    const params = Object.fromEntries(searchParamsURL.entries());

    if (price) params.price = price;
    if (role === "rooms") params.rooms = rooms;

    if (propertyTypes.length) params.type = propertyTypes.join(",");

    if (amenities.length) params.amenities = amenities.join(",");

    if (experienceTypes.length) params.experience = experienceTypes.join(",");

    setSearchParamsURL(params);
  }, [
    rooms,
    price,
    propertyTypes,
    amenities,
    experienceTypes,
    role,
    setSearchParamsURL,
  ]);

  const [hasSearched, setHasSearched] = useState(false);

  const updateSearchParams = (changes) => {
    setSearchParams((prev) => {
      const updated = { ...prev, ...changes };

      setSearchParamsURL(
        Object.fromEntries(
          Object.entries(updated).filter(([_, v]) => v !== "" && v != null),
        ),
      );

      return updated;
    });
  };

  const renderSearchBar = () => {
    if (role === "rooms")
      return (
        <StaysSearchBar
          values={searchParams}
          onChange={updateSearchParams}
          onSearch={handleSearch}
        />
      );

    if (role === "activities")
      return (
        <ActivitiesSearchBar
          values={searchParams}
          onChange={updateSearchParams}
          onSearch={handleSearch}
        />
      );

    return null;
  };

  const filteredResults = results.filter((item) => {
    if (role === "rooms") {
      if (item.price > price) return false;
      if (item.rooms < rooms) return false;
      if (propertyTypes.length && !propertyTypes.includes(item.propertyType))
        return false;
      if (
        amenities.length &&
        !amenities.every((a) => item.amenities.includes(a))
      )
        return false;
    }

    if (role === "activities") {
      if (item.price > price) return false;
      if (
        experienceTypes.length &&
        !experienceTypes.includes(item.experienceType)
      )
        return false;
    }

    return true;
  });

  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>
      {renderSearchBar()}
      <div className="searchPage">
        {/* Filtros */}
        <aside className="filters">
          <h3>Filtros</h3>
          {role === "rooms" && (
            <div className="filterGroup">
              <label>Tipo de Propiedad</label>
              <div className="checkboxGroup">
                {["Hotel", "Apartamento", "Casa"].map((type) => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      checked={propertyTypes.includes(type)}
                      onChange={(e) =>
                        setPropertyTypes((prev) =>
                          e.target.checked
                            ? [...prev, type]
                            : prev.filter((t) => t !== type),
                        )
                      }
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          )}
          {role === "activities" && (
            <div className="filterGroup">
              <label>Tipo de Experiencia</label>
              <div className="checkboxGroup">
                {["Kayaking", "Canopy", "Senderismo", "Surf", "Cultura"].map(
                  (type) => (
                    <label key={type}>
                      <input
                        type="checkbox"
                        checked={experienceTypes.includes(type)}
                        onChange={(e) =>
                          setExperienceTypes((prev) =>
                            e.target.checked
                              ? [...prev, type]
                              : prev.filter((t) => t !== type),
                          )
                        }
                      />
                      {type}
                    </label>
                  ),
                )}
              </div>
            </div>
          )}

          {role === "rooms" && (
            <div className="filterGroup rangeFilter">
              <label>
                Número de cuartos mínimo
                <span className="filterValue">{rooms}</span>
              </label>

              <input
                type="range"
                min="1"
                max="6"
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
              />
            </div>
          )}

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
          {role === "rooms" && (
            <div className="filterGroup">
              <label>Comodidades</label>
              <div className="checkboxGroup">
                {[
                  { label: "Wi-Fi", value: "wifi" },
                  { label: "Piscina", value: "pool" },
                  { label: "A/C", value: "ac" },
                  { label: "Parqueo", value: "parking" },
                ].map(({ label, value }) => (
                  <label key={value}>
                    <input
                      type="checkbox"
                      checked={amenities.includes(value)}
                      onChange={(e) =>
                        setAmenities((prev) =>
                          e.target.checked
                            ? [...prev, value]
                            : prev.filter((a) => a !== value),
                        )
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>
        {/* Results */}
        <section className="results">
          {!hasSearched && results.length === 0 && (
            <div className="empty-state">
              <p>Realiza una búsqueda para ver resultados</p>
            </div>
          )}

          {hasSearched && results.length === 0 && (
            <div className="empty-state">
              <p>No se encontraron resultados</p>
            </div>
          )}
          <div className="resultsGrid">
            {filteredResults.map((item) => (
              <div
                key={item.id}
                className="roomCard"
                onClick={() => navigate(`/preview/${role}/${item.id}`)}
              >
                <div className="roomImage" />
                <div className="roomInfo">
                  <h4>{item.name}</h4>
                  <p className="roomDesc">{item.description}</p>
                  {role === "rooms" && <p className="roomMeta">{item.meta}</p>}
                  <p className="roomPrice">
                    ₡{Number(item.price).toLocaleString("es-CR")} / noche
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
export default Search;
