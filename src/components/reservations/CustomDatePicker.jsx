import { useEffect, useState } from 'react';

const CustomDatePicker = ({ onDateChange }) => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    useEffect(() => {
        const currentDate = new Date();
        setDate(currentDate);
        onDateChange(currentDate);
    }, []);

    const onChange = (event, selectedValue) => {
        setShow(false);
        if (selectedValue) {
            setDate(selectedValue);
            onDateChange(selectedValue);
        }
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const dateString = date.toLocaleDateString();

    return (
        <div style={styles.container}>
            <div style={styles.dateContainer}>
                <span style={styles.dateText}>Valittu päivämäärä: {dateString}</span>
            </div>
            <button style={styles.button} onClick={showDatepicker}>
                <span style={styles.buttonText}>Valitse päivä</span>
            </button>

            {show && (
                <input
                    type="date"
                    value={date.toISOString().slice(0, 10)}
                    onChange={e => onChange(null, new Date(e.target.value))}
                />
            )}
        </div>
    );
};

const styles = {
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    dateContainer: {
        backgroundColor: '#D4F0F0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: '#8FCACA'
    },
    dateText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#D4F0F0',
        borderColor: '#8FCACA',
        borderWidth: 3,
        borderRadius: 5,
        cursor: 'pointer',
    },
    buttonText: {
        textAlign: 'center',
        color: 'black',
        fontSize: 16,
    },
};

export default CustomDatePicker;