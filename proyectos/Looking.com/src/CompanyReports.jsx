import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import COSTA_RICA_LOCATIONS from "./data/crLocations";
import "./CompanyReports.css";

function CompanyReports() {
  const MOCK_COMPANIES = [
    {
      id: "301110111",
      name: "Hotel Vista Real",
      type: "Hotel",
      provincia: "San José",
      canton: "Escazú",
      distrito: "San Rafael",
      reservations: 42,
      income: 3850000,
    },
    {
      id: "401220222",
      name: "Casa Monte Verde",
      type: "Casa",
      provincia: "Alajuela",
      canton: "Grecia",
      distrito: "San Isidro",
      reservations: 18,
      income: 1120000,
    },
    {
      id: "501330333",
      name: "Hostel Pura Vida",
      type: "Hostel",
      provincia: "San José",
      canton: "Central",
      distrito: "Carmen",
      reservations: 55,
      income: 2100000,
    },
    {
      id: "601440444",
      name: "Hotel Pacífico Azul",
      type: "Hotel",
      provincia: "Alajuela",
      canton: "Central",
      distrito: "Alajuela",
      reservations: 33,
      income: 2980000,
    },
  ];

  const [province, setProvince] = useState("");
  const [canton, setCanton] = useState("");
  const [district, setDistrict] = useState("");

  const today = new Date();

  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);

  const twoWeeksAhead = new Date(today);
  twoWeeksAhead.setDate(today.getDate() + 14);

  const toISODate = (date) => date.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(toISODate(twoWeeksAgo));
  const [endDate, setEndDate] = useState(toISODate(twoWeeksAhead));

  const provinces = Object.keys(COSTA_RICA_LOCATIONS);


  const cantons = useMemo(() => {
    if (!province) return [];
    return Object.keys(COSTA_RICA_LOCATIONS[province]);
  }, [province]);

  const districts = useMemo(() => {
    if (!province || !canton) return [];
    return COSTA_RICA_LOCATIONS[province][canton] || [];
  }, [province, canton]);

  const rankedCompanies = useMemo(() => {
    const filtered = MOCK_COMPANIES.filter((c) => {
      if (province && c.provincia !== province) return false;
      if (canton && c.canton !== canton) return false;
      if (district && c.distrito !== district) return false;
      return true;
    });

    return filtered
      .map((c) => ({
        ...c,
        demandScore: c.reservations * 0.7 + c.income * 0.0000003,
      }))
      .sort((a, b) => b.demandScore - a.demandScore);
  }, [province, canton, district, startDate, endDate]);

  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>
      <div className="reportsLayout">
        <div className="filtersColumn">
          <div className="searchSegment">
            <h3>Fechas</h3>
            <label>Fecha inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="searchSegment">
            <label>Fecha fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="searchSegment">
            <h3>
              Provincia <span style={{ color: "red" }}>*</span>
            </h3>
            <select
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setCanton("");
                setDistrict("");
              }}
            >
              <option value="">Todos</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="searchSegment">
            <label>Cantón</label>
            <select
              value={canton}
              onChange={(e) => {
                setCanton(e.target.value);
                setDistrict("");
              }}
              disabled={!province}
            >
              <option value="">Todos</option>
              {cantons.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="searchSegment">
            <label>Distrito</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!canton}
            >
              <option value="">Todos</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="tableColumn">
          <table className="reportsTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Empresa</th>
                <th>Tipo</th>
                <th>Ubicación</th>
                <th>Demanda</th>
              </tr>
            </thead>
            <tbody>
              {rankedCompanies.map((c, idx) => (
                <tr key={c.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <Link to={`/companyProfile/${c.id}`}>{c.name}</Link>
                  </td>
                  <td>{c.type}</td>
                  <td>
                    {c.provincia}, {c.canton}, {c.distrito}
                  </td>
                  <td>{idx < 2 ? "Alta" : idx < 4 ? "Media" : "Baja"}</td>
                </tr>
              ))}

              {!rankedCompanies.length && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", opacity: 0.6 }}>
                    No hay empresas para los filtros seleccionados
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

export default CompanyReports;
