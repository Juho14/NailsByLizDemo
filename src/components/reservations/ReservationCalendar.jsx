import AdminCalendar from "./Calendar";

export default function ReservationCalendar() {
    return (
        <div className="centered-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1>
                Varauskalenteri
            </h1>
            <AdminCalendar />
        </div>
    )
}