import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router'; // Corrected import
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../../../auth/services/storage/storage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { error } from 'console';

@Component({
  selector: 'app-book-car',
  templateUrl: './book-car.component.html',
  styleUrls: ['./book-car.component.scss']
})
export class BookCarComponent implements OnInit {
  
  carId!: number;
  car: any;
  processedImage: any;
  validateForm!: FormGroup;
  isSpinning = false;
  dateFormat: string = "dd-MM-yyyy";

  constructor(
    private services: CustomerService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router  ,
    private storageService:StorageService
    
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      toDate: [null, Validators.required],
      fromDate: [null, Validators.required]
    });
    this.carId = this.activatedRoute.snapshot.params['id'];
    this.getCarById();
  }

  getCarById() {
    this.services.getCarById(this.carId).subscribe((res) => {
      console.log(res);
      this.processedImage = 'data:image/jpeg;base64, ' + res.returnedImage;
      this.car = res;
    });
  }

  bookCar(data: any) {
    console.log(data);
    this.isSpinning = true;
  
    // Check if fromDate is before toDate
    if (new Date(data.fromDate) >= new Date(data.toDate)) {
      this.message.error("The 'From Date' must be before the 'To Date'.", { nzDuration: 5000 });
      this.isSpinning = false;
      return;
    }
  
    // Create bookCarDto using static method to get the userId
    let bookCarDto = {
      toDate: data.toDate,
      fromDate: data.fromDate,
      userId: this.storageService.getUserId(), // Using static method
      carId: this.carId
    };
  
    // Call the service to book the car
    this.services.bookACar(this.carId, bookCarDto).subscribe(
      (res) => {
        console.log(res);
        this.message.success("Booking request submitted successfully", { nzDuration: 5000 });
        this.router.navigateByUrl("/customer/dashboard");
      },
      (error) => {
        console.error('Booking error:', error);
        this.message.error("Something went wrong", { nzDuration: 5000 });
        this.isSpinning = false;
      }
    );
  }
  
  
  
  
  
}
