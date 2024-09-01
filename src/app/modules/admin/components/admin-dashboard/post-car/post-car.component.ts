import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-car',
  templateUrl: './post-car.component.html',
  styleUrls: ['./post-car.component.scss'],
  providers: [DatePipe]
})
export class PostCarComponent implements OnInit {
  postCarForm!: FormGroup;
  isSpinning = false;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  listOfOption:Array<{label:string; value:string}>=[]
  listOfBrands = ["BMW", "AUDI", "FERRARI", "TESLA", "VOLVO", "TOYOTA", "HONDA", "FORD", "NISSAN", "HYUNDAI", "LEXUS", "KIA"];
  listOfType = ["Petrol", "Hybrid", "Diesel", "Electric", "CNG"];
  listOfColor = ["Red", "White", "Blue", "Black", "Orange", "Grey", "Silver"];
  listOfTransmission = ["Manual", "Automatic"];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private message: NzMessageService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.postCarForm = this.fb.group({
      brand: [null, [Validators.required]],
      name: [null, [Validators.required]],
      type: [null, [Validators.required]],
      transmission: [null, [Validators.required]],
      color: [null, [Validators.required]],
      year: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  postCar(): void {
    if (this.postCarForm.invalid) {
      this.message.error('Please fill in all required fields correctly!');
      return;
    }

    const carData = this.postCarForm.value;
    carData.year = this.datePipe.transform(carData.year, 'yyyy-MM-ddTHH:mm:ss');

    this.isSpinning = true;

    // Prepare the form data
    const formData = new FormData();
    formData.append('brand', carData.brand);
    formData.append('name', carData.name);
    formData.append('type', carData.type);
    formData.append('transmission', carData.transmission);
    formData.append('color', carData.color);
    formData.append('year', carData.year);
    formData.append('price', carData.price.toString());
    formData.append('description', carData.description);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.adminService.postCar(formData).subscribe({
      next: () => {
        this.message.success('Car posted successfully!');
        this.postCarForm.reset();
        this.imagePreview = null;
        this.selectedFile = null;
        this.isSpinning = false;
      },
      error: (err) => {
        this.message.error('Failed to post the car!');
        this.isSpinning = false;
      }
    });
  }
}
