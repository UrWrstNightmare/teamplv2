import React from 'react';
import { FullCalendar } from 'primereact/fullcalendar';
import { EventService } from '../service/EventService';

export class FullCalendarDemo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [],
            options: {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                defaultView: 'dayGridMonth',
                defaultDate: '2017-02-01',
                header: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                editable: true
            }
        };
        this.eventService = new EventService();
    }

    componentDidMount() {
        this.eventService.getEvents().then(data => this.setState({events: data}));
    }

    render() {
        return (
            <FullCalendar events={this.state.events} options={this.state.options} />
        );
    }
}