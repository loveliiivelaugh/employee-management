import { useCallback, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import useUtilityStore from '@store/utilityStore';
import { Button } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import "react-big-calendar/lib/css/react-big-calendar.css";


// Event {
//     title: string,
//     start: Date,
//     end: Date,
//     allDay?: boolean
//     resource?: any,
//   }

// const eventsList = [
//     {
//         title: "238 Steps",
//         start: new Date(),
//         end: new Date()
//     },
//     {
//         title: "6:42 Hours Slept",
//         start: new Date(),
//         end: new Date()
//     }
// ]

const localizer = momentLocalizer(moment)

const MyCalendar = () => {
    const utilityStore = useUtilityStore();
    const [events, setEvents] = useState([]);
    const handleSelectSlot = useCallback(
        ({ start, end }: any) => utilityStore.setModal({
            open: true,
            // const title = window.prompt('New Event name')
            // if (title) {
            //     setEvents((prev) => [...prev, { start, end, title }])
            // }
            content: (
                <>
                    Confirm Date {moment(start).format("M/D/YYYY")} ?
                    And at what time?
                    <TimePicker onChange={(event) => console.log("timechanged: ", event)} />
                    <Button onClick={() => utilityStore.setModal({ open: false })}>
                        Confirm
                    </Button>
                </>
            )
        }),
        [setEvents]
    )

    const handleSelectEvent = useCallback(
        (event: any) => window.alert(event.title),
        []
    )
    return (
        <div style={{ width: "100%" }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                // scrollToTime={scrollToTime}
                style={{
                    height: 500,
                    // display: "flex", 
                    // justifyContent: "center", 
                    width: "100%",
                    color: "inherit"
                }}
            />
        </div>
    )
};

export default MyCalendar