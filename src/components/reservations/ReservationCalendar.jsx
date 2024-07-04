import AdminCalendar from "./Calendar";

export default function ReservationCalendar() {
    return (
        <div className="centered-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3>
                Varauskalenteri
            </h3>
            <AdminCalendar />
        </div>
    )
}