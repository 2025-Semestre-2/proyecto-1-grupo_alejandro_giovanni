import PageTop from "./components/PageTop";
import PageTopContent from "./components/PageTopContent";
import { useState, useMemo, useEffect } from "react";
import "./CompanyBookings.css";

const ROOM_TYPES = [
  {
    typeId: "royal",
    type: "Royal Suite",
    rooms: [
      { id: "A1", active: true },
      { id: "A2", active: false },
      { id: "A3", active: true },
    ],
  },
  {
    typeId: "standard",
    type: "Habitación Estándar",
    rooms: [
      { id: "B1", active: true },
      { id: "B2", active: true },
      { id: "B3", active: false },
      { id: "B4", active: true },
    ],
  },
];

const MOCK_RESERVATIONS = [
  {
    id: "1234",
    roomType: "Royal Suite",
    room: "A1",
    guestName: "Juan Espinoza Rojas",
    startDate: "2026-02-07",
    endDate: "2026-02-09",
    people: 2,
    nights: 2,
    hasCar: false,
    checkIn: "1 p.m.",
    pricePerNight: 70000,
    active: true,
    breakdown: {
      alojamiento: 52000,
      limpieza: 8000,
      servicios: 7000,
      administrativo: 3000,
    },
  },

  {
    id: "1235",
    roomType: "Royal Suite",
    room: "A2",
    guestName: "María Fernanda López",
    startDate: "2026-02-08",
    endDate: "2026-02-11",
    people: 3,
    nights: 3,
    hasCar: true,
    checkIn: "2 p.m.",
    pricePerNight: 75000,
    active: false,
    breakdown: {
      alojamiento: 160000,
      limpieza: 10000,
      servicios: 12000,
      administrativo: 5000,
    },
  },

  {
    id: "1236",
    roomType: "Royal Suite",
    room: "A3",
    guestName: "Carlos Méndez Vargas",
    startDate: "2026-02-10",
    endDate: "2026-02-13",
    people: 2,
    nights: 3,
    hasCar: false,
    checkIn: "12 p.m.",
    pricePerNight: 70000,
    active: true,
    breakdown: {
      alojamiento: 150000,
      limpieza: 9000,
      servicios: 8000,
      administrativo: 4000,
    },
  },

  {
    id: "2231",
    roomType: "Habitación Estándar",
    room: "B1",
    guestName: "Andrea Solano Pérez",
    startDate: "2026-02-07",
    endDate: "2026-02-08",
    people: 1,
    nights: 1,
    hasCar: false,
    checkIn: "3 p.m.",
    pricePerNight: 42000,
    active: true,
    breakdown: {
      alojamiento: 30000,
      limpieza: 5000,
      servicios: 4000,
      administrativo: 3000,
    },
  },

  {
    id: "2232",
    roomType: "Habitación Estándar",
    room: "B2",
    guestName: "Luis Alberto Jiménez",
    startDate: "2026-02-08",
    endDate: "2026-02-10",
    people: 2,
    nights: 2,
    hasCar: true,
    checkIn: "1 p.m.",
    pricePerNight: 45000,
    active: false,
    breakdown: {
      alojamiento: 70000,
      limpieza: 7000,
      servicios: 6000,
      administrativo: 4000,
    },
  },

  {
    id: "2233",
    roomType: "Habitación Estándar",
    room: "B3",
    guestName: "Sofía Hernández Mora",
    startDate: "2026-02-09",
    endDate: "2026-02-12",
    people: 2,
    nights: 3,
    hasCar: false,
    checkIn: "2 p.m.",
    pricePerNight: 45000,
    active: true,
    breakdown: {
      alojamiento: 110000,
      limpieza: 8000,
      servicios: 7000,
      administrativo: 5000,
    },
  },

  {
    id: "2234",
    roomType: "Habitación Estándar",
    room: "B4",
    guestName: "Daniela Rojas Calderón",
    startDate: "2026-02-11",
    endDate: "2026-02-14",
    people: 4,
    nights: 3,
    hasCar: true,
    checkIn: "12 p.m.",
    pricePerNight: 48000,
    active: false,
    breakdown: {
      alojamiento: 120000,
      limpieza: 9000,
      servicios: 9000,
      administrativo: 6000,
    },
  },
];

const MOCK_STATS = {
  totalReservations: 18,
  totalIncome: 1250000,
  avgAge: 34,
  topRooms: ["Royal Suite", "Habitación Estándar"],
};

const today = new Date();

const oneWeekAgo = new Date(today);
oneWeekAgo.setDate(today.getDate() - 14);

const oneWeekAhead = new Date(today);
oneWeekAhead.setDate(today.getDate() + 14);

const toISO = (date) => date.toISOString().split("T")[0];

export default function CompanyBookings() {
  const [filters, setFilters] = useState({
    startDate: toISO(oneWeekAgo),
    endDate: toISO(oneWeekAhead),
    roomTypes: [],
    rooms: [],
  });

  const getMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const start = new Date(firstDay);
    start.setDate(start.getDate() - start.getDay());

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const [selectedReservation, setSelectedReservation] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (filters.startDate) {
      const d = new Date(filters.startDate);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date();
  });

  const calendarDays = useMemo(() => {
    return getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth());
  }, [currentMonth]);

  const hasRoomFilter =
    filters.roomTypes.length > 0 || filters.rooms.length > 0;

  const filteredReservations = useMemo(() => {
    if (!hasRoomFilter) return [];

    return MOCK_RESERVATIONS.filter((res) => {
      const overlapsDateRange =
        (!filters.startDate || res.endDate >= filters.startDate) &&
        (!filters.endDate || res.startDate <= filters.endDate);

      const roomTypeMatch = filters.roomTypes.includes(res.roomType);

      const roomMatch = filters.rooms.includes(res.room);

      return overlapsDateRange && roomTypeMatch && roomMatch;
    });
  }, [filters, hasRoomFilter]);

  const toggleRoomType = (type, rooms) => {
    setFilters((prev) => {
      const isSelected = prev.roomTypes.includes(type);

      if (isSelected) {
        return {
          ...prev,
          roomTypes: prev.roomTypes.filter((t) => t !== type),
          rooms: prev.rooms.filter((r) => !rooms.includes(r)),
        };
      } else {
        return {
          ...prev,
          roomTypes: [...prev.roomTypes, type],
          rooms: [...new Set([...prev.rooms, ...rooms])],
        };
      }
    });
  };

  const toggleRoom = (room) => {
    setFilters((prev) => {
      const isSelected = prev.rooms.includes(room);

      return {
        ...prev,
        rooms: isSelected
          ? prev.rooms.filter((r) => r !== room)
          : [...prev.rooms, room],
      };
    });
  };

  const toggleCheckIn = () => {
    setSelectedReservation((prev) => ({
      ...prev,
      active: !prev.active,
    }));
  };

  useEffect(() => {
    const allRoomTypes = ROOM_TYPES.map((rt) => rt.type);
    const allRooms = ROOM_TYPES.flatMap((rt) =>
      rt.rooms.map((room) => room.id),
    );

    setFilters((prev) => ({
      ...prev,
      roomTypes: allRoomTypes,
      rooms: allRooms,
    }));
  }, []);

  return (
    <>
      <PageTopContent>
        <PageTop />
      </PageTopContent>
      <div className="companyBookings">
        <div className="bookingSidebar">
          <h3>Filtros</h3>

          <div className="filterGroup">
            <label>Fecha inicio</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />

            <label>Fecha fin</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>

          <div className="filterGroup">
            <h4>Cuartos</h4>

            <div className="roomFilter">
              {ROOM_TYPES.map((rt) => {
                const roomTypeChecked = filters.roomTypes.includes(rt.type);

                return (
                  <div key={rt.type} className="roomTypeBlock">
                    <label className="roomTypeLabel">
                      <input
                        type="checkbox"
                        checked={roomTypeChecked}
                        onChange={() =>
                          toggleRoomType(
                            rt.type,
                            rt.rooms.map((r) => r.id),
                          )
                        }
                      />
                      {rt.type}
                    </label>

                    {roomTypeChecked && (
                      <div className="roomList">
                        {rt.rooms.map((room) => (
                          <label key={room.id} className="roomLabel">
                            <input
                              type="checkbox"
                              checked={filters.rooms.includes(room.id)}
                              onChange={() => toggleRoom(room.id)}
                            />
                            {room.id}
                            {!room.active && <span> (Inactivo)</span>}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <hr />

          <div className="stats">
            <h4>Resumen</h4>

            <p>
              <strong>Reservaciones Totales:</strong>{" "}
              {MOCK_STATS.totalReservations}
            </p>

            <p>
              <strong>Ingresos Generados:</strong> ₡
              {MOCK_STATS.totalIncome.toLocaleString()}
            </p>

            <p>
              <strong>Promedio Edad:</strong> {MOCK_STATS.avgAge} años
            </p>

            <p>
              <strong>Mejores Cuartos:</strong>
              <br />
              {MOCK_STATS.topRooms.slice(0, 3).map((room, i) => (
                <span key={room}>
                  {i + 1}. {room}
                  <br />
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="bookingCalendar">
          <h3>Calendario</h3>

          <div className="calendarNav">
            <button
              className="monthNavBtn"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1,
                  ),
                )
              }
            >
              ←
            </button>

            <span className="monthLabel">
              {currentMonth.toLocaleDateString("es-CR", {
                month: "long",
                year: "numeric",
              })}
            </span>

            <button
              className="monthNavBtn"
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1,
                  ),
                )
              }
            >
              →
            </button>
          </div>

          <div className="calendarHeader">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="calendarGrid">
            {calendarDays.map((day) => {
              const iso = day.toISOString().split("T")[0];

              const outsideRange =
                (filters.startDate && iso < filters.startDate) ||
                (filters.endDate && iso > filters.endDate);

              return (
                <div
                  key={iso}
                  className={`calendarCell ${outsideRange ? "disabledDay" : ""}`}
                >
                  <span className="dayNumber">{day.getDate()}</span>

                  {filteredReservations.map((res) => {
                    const displayEndDate = new Date(res.endDate);
                    displayEndDate.setDate(displayEndDate.getDate());

                    const displayEndISO = displayEndDate
                      .toISOString()
                      .split("T")[0];

                    const isCheckIn = iso === res.startDate;
                    const coversDay =
                      iso >= res.startDate && iso <= displayEndISO;

                    if (!coversDay) return null;

                    const isLastNight = iso === displayEndISO;

                    return (
                      <div
                        key={res.id}
                        className={`reservationBar
        ${isCheckIn ? "start" : ""}
        ${isLastNight ? "end" : ""}
        ${res.active ? "active" : ""}
      `}
                        onClick={() => setSelectedReservation(res)}
                      >
                        {isLastNight && (
                          <span className="checkoutArrow">→</span>
                        )}
                        {isCheckIn && `#${res.id}`}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedReservation && (
        <div className="modalOverlay">
          <div className="reservationModal">
            <button
              className="closeModal"
              onClick={() => setSelectedReservation(null)}
            >
              ✕
            </button>

            <h3>
              {selectedReservation.roomType} – Cuarto {selectedReservation.room}
            </h3>

            <p>{selectedReservation.guestName}</p>
            <p>
              <strong>Número de Reserva:</strong> {selectedReservation.id}
            </p>

            <p>
              {selectedReservation.nights} Noches / {selectedReservation.people}{" "}
              Personas / Llegada {selectedReservation.checkIn} /{" "}
              {selectedReservation.hasCar ? "Con carro" : "Sin carro"}
            </p>

            <p>7 Feb – 9 Feb</p>

            <hr />

            <h4>₡140,000</h4>
            <p>
              {selectedReservation.nights} noches × ₡
              {selectedReservation.pricePerNight.toLocaleString()}
            </p>

            <ul>
              <li>
                Alojamiento: ₡
                {selectedReservation.breakdown.alojamiento.toLocaleString()}
              </li>
              <li>
                Limpieza: ₡
                {selectedReservation.breakdown.limpieza.toLocaleString()}
              </li>
              <li>
                Servicios Básicos: ₡
                {selectedReservation.breakdown.servicios.toLocaleString()}
              </li>
              <li>
                Cargo Administrativo: ₡
                {selectedReservation.breakdown.administrativo.toLocaleString()}
              </li>
            </ul>
            <hr />

            <div className="checkInToggle">
              <span>Check In</span>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={selectedReservation.active}
                  onChange={toggleCheckIn}
                />
                <span className="slider" />
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
