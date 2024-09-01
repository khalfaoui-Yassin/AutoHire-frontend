import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';

interface Car {
  id:number;
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
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  cars: any = [];

  constructor(private adminService: AdminService,
    private message :NzMessageService
  ) {}

  ngOnInit() {
    this.getAllCars();
  }

  getAllCars() {
    this.adminService.getAllCars().subscribe((res: Car[]) => {
      console.log(res);
      res.forEach((element: Car) => {
        element.processedImg = 'data:image/jpeg;base64,' + element.returnedImage;
        this.cars.push(element);
      });
    });
  }

  deleteCar(id:number){
    console.log(id);
    this.adminService.deleteCar(id).subscribe((res)=>{
      this.getAllCars();
      this.message.success("Car deleted successfully", {nzDuration: 5000});
    })

  }
}
