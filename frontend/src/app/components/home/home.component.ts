import { Component} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{

  calendarOptions: CalendarOptions = {
    // locale: esLocale,
    allDaySlot: false,

    slotDuration: '01:00',

    headerToolbar: {
      left: 'timeGridWeek,timeGridDay',
      center: 'title',
      right: 'prev,next today'
    },

    titleFormat: { // will produce something like "Tuesday, September 18, 2018"
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    },

    height: 'auto',

    slotMinTime: '7:00:00',
    slotMaxTime: '20:00:00',

    initialView: 'timeGridWeek', // bind is important!

    events: [
      {title: 'RESERVADO', start: '2022-12-13 07:00:00', end: '2022-12-13 09:00:00', color: '#C21010'}

    ],
    
    slotLabelFormat:{
      
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      meridiem: 'lowercase'
    },

    // eventTimeFormat: { // like '14:30:00'
    //   hour: 'numeric', 
    //   minute: '2-digit',
    // }

    hiddenDays: [ 0 ] 

  };


}
