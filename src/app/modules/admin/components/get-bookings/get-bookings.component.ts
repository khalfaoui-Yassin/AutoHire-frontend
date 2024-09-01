import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrls: ['./get-bookings.component.scss']
})
export class GetBookingsComponent {
  bookings: any;
  isSpinning = false;

  constructor(private adminService: AdminService, private message: NzMessageService) {
    this.getBookings();
  }

  getBookings() {
    this.isSpinning = true;
    this.adminService.getCarBookings().subscribe((res) => {
      this.isSpinning = false;
      console.log(res);
      this.bookings = res.map((booking: any) => ({
        ...booking,
        fromDate: this.convertToDate(booking.fromDate),
        toDate: this.convertToDate(booking.toDate)
      }));
    }, error => {
      this.isSpinning = false;
      this.message.error("Failed to load bookings", { nzDuration: 5000 });
    });
  }

  convertToDate(dateString: any): Date | null {
    if (!dateString) {
      return null;
    }
  
    let date = new Date(dateString);
  
    // Check if it's a valid date, if not try to parse it as a timestamp
    if (isNaN(date.getTime())) {
      date = new Date(parseInt(dateString, 10));
    }
  
    // If it's still invalid, return null
    return isNaN(date.getTime()) ? null : date;
  }
  
  

  changeBookingStatus(bookingId: number, status: string) {
    this.isSpinning = true;
    console.log(bookingId, status);
    this.adminService.changeBookingStatus(bookingId, status).subscribe((res) => {
      this.isSpinning = false;
      console.log(res);
      this.getBookings();
      this.message.success("Booking status changed successfully", { nzDuration: 5000 });
    }, error => {
      this.isSpinning = false;
      this.message.error("Failed to change booking status", { nzDuration: 5000 });
    });
  }
}
