import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { error } from 'console';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent {
  bookings:any;
  isSpinning=false;
  constructor(private servicee:CustomerService){
    this.getMyBookings();
  }

  getMyBookings() {
    this.isSpinning = true;
    this.servicee.getBookingsByUserId().subscribe(
      (res) => {
        this.isSpinning = false;
  
        this.bookings = res.map((booking: any) => ({
          ...booking,
          fromDate: new Date(booking.fromDate),
          toDate: new Date(booking.toDate),
        }));
      },
      (error) => {
        this.isSpinning = false;
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
      }
    );
  }
  
  
  
  }
