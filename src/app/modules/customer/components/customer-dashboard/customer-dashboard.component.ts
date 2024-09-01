import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerService } from '../../services/customer.service';

interface Car {
  id: number;
  returnedImage: string;
  processedImg?: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  color: string;
  transmission: string;
  type: string;
  year: Date;
}

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {

  cars: Car[] = [];

  constructor(
    private customerService: CustomerService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.getAllCars();
  }

  getAllCars() {
    this.customerService.getAllCars().subscribe(
      (res: Car[]) => {
        console.log(res);
        this.cars = res.map((car: Car) => ({
          ...car,
          processedImg: 'data:image/jpeg;base64,' + car.returnedImage
        }));
      },
      (error) => {
        this.message.error('Error loading cars');
        console.error(error);
      }
    );
  }
}
