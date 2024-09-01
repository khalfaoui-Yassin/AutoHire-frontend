import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../admin/services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrl: './get-bookings.component.scss'
})
export class GetBookingsComponent implements OnInit {
  bookings: any;
  isSpinning = false;

  constructor(private adminService: AdminService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.getBookings();
  }

  getBookings(): void {
    this.isSpinning = true;
    this.adminService.getCarBookings().subscribe({
      next: (res) => {
        this.isSpinning = false;
        this.bookings = res;
      },
      error: (err) => {
        this.isSpinning = false;
        this.message.error('فشل في الحصول على الحجوزات!');
      }
    });
  }

  changeBookingStatus(bookingId: number, status: string): void {
    this.isSpinning = true;
    this.adminService.changeBookingStatus(bookingId, status).subscribe({
      next: () => {
        this.getBookings();
        this.message.success('تم تغيير حالة الحجز بنجاح!', { nzDuration: 5000 });
      },
      error: (err) => {
        this.message.error('حدث خطأ ما', { nzDuration: 5000 });
      },
      complete: () => this.isSpinning = false
    });
  }
}

