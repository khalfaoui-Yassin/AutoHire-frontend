import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
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
  year: number;
}

@Component({
  selector: 'app-search-car',
  templateUrl: './search-car.component.html',
  styleUrls: ['./search-car.component.scss']  // Fixed typo
})

export class SearchCarComponent {

  searchCarForm!: FormGroup;
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfBrands = ["BMW", "AUDI", "FERRARI", "TESLA", "VOLVO", "TOYOTA", "HONDA", "FORD", "NISSAN", "HYUNDAI", "LEXUS", "KIA"];
  listOfType = ["Petrol", "Hybrid", "Diesel", "Electric", "CNG"];
  listOfColor = ["Red", "White", "Blue", "Black", "Orange", "Grey", "Silver"];
  listOfTransmission = ["Manual", "Automatic"];
  isSpinning = false;
  cars: any = [];

  constructor(
    private fb: FormBuilder,
    private service: AdminService
  ) {
    this.searchCarForm = this.fb.group({
      brand: [null],
      type: [null],
      transmission: [null],
      color: [null],
    });
  }

  searchCar() {
    this.isSpinning = true;
    this.cars = [];  // Clear previous search results

    console.log(this.searchCarForm.value);

    if (this.searchCarForm.invalid) {
      this.isSpinning = false;
      return;
    }

    this.service.searchCar(this.searchCarForm.value).subscribe((res) => {
      res.carDtoList.forEach((element:Car) => {  // Fixed typo
        element.processedImg = 'data:image/jpeg;base64,' + element.returnedImage;
        this.cars.push(element);
      });
      this.isSpinning = false;
    }, (error) => {
      
    });
  }

}
