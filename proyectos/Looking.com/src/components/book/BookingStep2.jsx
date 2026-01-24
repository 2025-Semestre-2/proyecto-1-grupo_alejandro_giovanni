function BookingStep2({ bookingData, next, back, cancel }) {
  const total = bookingData.roomPrice * bookingData.nights;

  return (
    <div className="bookingStep">
      <div className="textCenter">
        <h1>Pago</h1>
        <p>Por favor llenar los siguientes datos</p>
      </div>

      <div className="twoColumn">
        {/* Izquierda */}
        <div>
          <h3>Transferencia</h3>
          <p>
            {bookingData.nights} noches en Hotel Paraíso
            <br />
            Guanacaste, Liberia
          </p>

          <h2>Total: ₡{total.toLocaleString()}</h2>
          <p>
            {bookingData.nights} noches * ₡{bookingData.roomPrice}
          </p>

          <ul>
            <li>- Amenidad: ₡5,000</li>
          </ul>
        </div>

        {/* Derecha */}
        <div className="formColumn">
          <label>Método de Pago</label>
          <select>
            <option>Efectivo</option>
            <option>Tarjeta</option>
          </select>
        </div>
      </div>

      <div className="buttonRow">
        <button className="buttonMain" onClick={next}>
          Realizar Reserva
        </button>
        <button className="buttonMain cancel" onClick={cancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default BookingStep2;
