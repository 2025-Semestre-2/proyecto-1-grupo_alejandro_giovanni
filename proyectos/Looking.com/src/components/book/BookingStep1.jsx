function BookingStep1({ bookingData, setBookingData, next, cancel }) {
  const total = bookingData.roomPrice * bookingData.nights;

  return (
    <div className="bookingStep">
      <div className="textCenter marginLoss">
        <h1>Información de reserva</h1>
        <p>Por favor confirmar los siguientes datos</p>
      </div>

      <div className="twoColumn">
        {/* Izquierda */}
        <div>
          <img src="/room.jpg" className="roomImage" />
          <h3>Habitación Deluxe</h3>
          <p>
            Va a pagar ₡{total.toLocaleString()}
            <br />
            por {bookingData.nights} noches
          </p>
        </div>

        {/* Derecha */}
        <div className="formColumn">
          <label>¿Cuántas personas van?</label>
          <input
            type="number"
            min="1"
            value={bookingData.people}
            onChange={(e) =>
              setBookingData({ ...bookingData, people: e.target.value })
            }
          />

          <label>Seleccione los días de su estadía</label>

          <div className="dateRow">
            <div className="dateField">
              <span className="dateLabel">Llegada</span>
              <input type="date" />
            </div>

            <div className="dateField">
              <span className="dateLabel">Salida</span>
              <input type="date" />
            </div>
          </div>

          <label>Seleccione la hora de llegada</label>
          <input type="time" />

          <label>¿Va a llevar un vehículo?</label>
          <select>
            <option>No</option>
            <option>Sí</option>
          </select>
        </div>
      </div>

      <div className="buttonRow">
        <button className="buttonMain" onClick={next}>
          Información de Pago
        </button>
        <button className="buttonMain cancel" onClick={cancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default BookingStep1;
