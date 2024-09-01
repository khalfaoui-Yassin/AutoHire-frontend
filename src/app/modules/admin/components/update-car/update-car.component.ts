import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrls: ['./update-car.component.scss']
})
export class UpdateCarComponent implements OnInit {
  isSpinning = false;
  carId: number | undefined;
  imgChanged = false;
  selectedFile: any;
  imagePreview: string | ArrayBuffer | null = null;
  existingImage: string | null = null;
  updateForm!: FormGroup; 
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfBrands = ["BMW", "AUDI", "FERRARI", "TESLA", "VOLVO", "TOYOTA", "HONDA", "FORD", "NISSAN", "HYUNDAI", "LEXUS", "KIA"];
  listOfType = ["Petrol", "Hybrid", "Diesel", "Electric", "CNG"];
  listOfColor = ["Red", "White", "Blue", "Black", "Orange", "Grey", "Silver"];
  listOfTransmission = ["Manual", "Automatic"];

  constructor(
    private adminService: AdminService, 
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      brand: [null, [Validators.required]],
      name: [null, [Validators.required]],
      type: [null, [Validators.required]],
      transmission: [null, [Validators.required]],
      color: [null, [Validators.required]],
      year: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });
    
    this.carId = this.activatedRoute.snapshot.params['id'];
    if (this.carId) {
      this.getCarById();
    }
  }

  getCarById(): void {
    this.isSpinning = true;

    if (this.carId !== undefined) {
      this.adminService.getCarById(this.carId).subscribe((res) => {
        this.isSpinning = false;
        const carDto = res;
        this.existingImage = 'data:image/jpeg;base64,' + res.returnedImage;
        console.log(carDto);
        console.log(this.existingImage);
        this.updateForm.patchValue(carDto);
      });
    }
  }

  updateCar(): void {
    if (this.updateForm.invalid) {
      this.message.error('Please fill in all required fields correctly!');
      return;
    }
  
    const carData = this.updateForm.value;
    console.log('Car Data:', carData);
  
    this.isSpinning = true;
  
    const formData = new FormData();
    formData.append('brand', this.updateForm.get('brand')?.value);
    formData.append('name', this.updateForm.get('name')?.value);
    formData.append('type', this.updateForm.get('type')?.value);
    formData.append('transmission', this.updateForm.get('transmission')?.value);
    formData.append('color', this.updateForm.get('color')?.value);
    formData.append('year', this.updateForm.get('year')?.value);
    formData.append('price', this.updateForm.get('price')?.value);
    formData.append('description', this.updateForm.get('description')?.value);
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
  
    // Ensure carId is not undefined
    if (this.carId !== undefined) {
      this.adminService.updateCar(this.carId, formData).subscribe({
        next: () => {
          this.message.success('Car updated successfully!');
          this.updateForm.reset();
          this.imagePreview = null;
          this.selectedFile = null;
          this.isSpinning = false;
        },
        error: (err) => {
          console.error('Error updating car:', err);
          this.message.error('Failed to update car. Please check the input and try again.');
          this.isSpinning = false;
        }
      });
    } else {
      this.message.error('Car ID is not available.');
      this.isSpinning = false;
    }
  }
  

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.imgChanged = true;
    this.existingImage = null;
    this.previewImage();
  }

  previewImage(): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }
}
