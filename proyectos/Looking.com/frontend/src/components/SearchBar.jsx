import COSTA_RICA_LOCATIONS from "../data/crLocations";

export function StaysSearchBar({ values, onChange, onSearch }) {
  const { province, canton, district, startDate, endDate, people } = values;

  const provinces = Object.keys(COSTA_RICA_LOCATIONS);
  const cantons = province ? Object.keys(COSTA_RICA_LOCATIONS[province]) : [];
  const districts =
    province && canton ? COSTA_RICA_LOCATIONS[province][canton] : [];

  return (
    <div className="searchBarTop">
      <div className="searchSegment">
        <label>
          Provincia <span style={{ color: "red" }}>*</span>
        </label>
        <select
          value={province}
          onChange={(e) =>
            onChange({ province: e.target.value, canton: "", district: "" })
          }
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
          disabled={!province}
          onChange={(e) => onChange({ canton: e.target.value, district: "" })}
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
          disabled={!canton}
          onChange={(e) => onChange({ district: e.target.value })}
        >
          <option value="">Todos</option>
          {districts.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </div>

      <div className="searchDivider" />

      <div className="searchSegment">
        <label>Fecha Llegada <span style={{ color: "red" }}>*</span></label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChange({ startDate: e.target.value })}
        />
      </div>

      <div className="searchSegment">
        <label>Fecha Salida <span style={{ color: "red" }}>*</span></label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChange({ endDate: e.target.value })}
        />
      </div>

      <div className="searchDivider" />

      <div className="searchSegment">
        <label>Personas <span style={{ color: "red" }}>*</span></label>
        <input
          type="number"
          min="1"
          value={people}
          onChange={(e) => onChange({ people: Number(e.target.value) })}
        />
      </div>

      <button
        className="buttonMain"
        disabled={!province}
        onClick={() => onSearch(values)}
      >
        Buscar
      </button>
    </div>
  );
}

export function ActivitiesSearchBar({ values, onChange, onSearch }) {
  const { province, canton, district } = values;

  const provinces = Object.keys(COSTA_RICA_LOCATIONS);
  const cantons = province ? Object.keys(COSTA_RICA_LOCATIONS[province]) : [];
  const districts =
    province && canton ? COSTA_RICA_LOCATIONS[province][canton] : [];

  return (
    <div className="searchBarTop">
      <div className="searchSegment">
        <label>Provincia *</label>
        <select
          value={province}
          onChange={(e) =>
            onChange({ province: e.target.value, canton: "", district: "" })
          }
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
          disabled={!province}
          onChange={(e) => onChange({ canton: e.target.value, district: "" })}
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
          disabled={!canton}
          onChange={(e) => onChange({ district: e.target.value })}
        >
          <option value="">Todos</option>
          {districts.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </div>

      <button
        className="buttonMain"
        disabled={!province}
        onClick={() => onSearch(values)}
      >
        Buscar
      </button>
    </div>
  );
}
