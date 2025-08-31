export default function RoomList({ active, onSelect }) {
    const rooms = ["general", "random", "dev"];
    return (
      <div style={{ borderRight: "1px solid #ddd", paddingRight: 12, width: 160 }}>
        <h4>Rooms</h4>
        {rooms.map(r => (
          <div key={r}>
            <button
              onClick={() => onSelect(r)}
              style={{ background: r === active ? "#eef" : "#fff", width: "100%" }}
            >
              #{r}
            </button>
          </div>
        ))}
      </div>
    );
  }
  