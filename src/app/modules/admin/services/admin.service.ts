import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/services/storage/storage.service';

const BASIC_URL = 'http://localhost:2003';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient, private storageService: StorageService) {}

  postCar(carDto: FormData): Observable<any> {
    return this.http.post(BASIC_URL + "/api/admin/car", carDto, {
      headers: this.createAuthorizationHeader()
    });
  }

  getAllCars(): Observable<any> {
    return this.http.get(BASIC_URL + "/api/admin/cars", {
      headers: this.createAuthorizationHeader()
    });
  }

  deleteCar(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + "/api/admin/car/" + id, {
      headers: this.createAuthorizationHeader()
    });
  }

  getCarById(id: number): Observable<any> {
    return this.http.get(BASIC_URL + "/api/admin/car/" + id, {
      headers: this.createAuthorizationHeader()
    });
  }

  updateCar(carId: number, carDto: any): Observable<any> {
    return this.http.put(BASIC_URL + "/api/admin/car/" + carId, carDto, {
      headers: this.createAuthorizationHeader()
    });
  }
  getCarBookings(): Observable<any> {
    return this.http.get(BASIC_URL + "/api/admin/car/bookings" , {
      headers: this.createAuthorizationHeader()
    });
  }
  changeBookingStatus(bookingId: number, status: string): Observable<any> {
    return this.http.get(`${BASIC_URL}/api/admin/car/booking/${bookingId}/${status}`, {
      headers: this.createAuthorizationHeader()
    });
  }
  
  searchCar(searchCarDto: any): Observable<any> {
    return this.http.post(BASIC_URL + "/api/admin/car/search", searchCarDto, {
      headers: this.createAuthorizationHeader()
    });
  }
  

  



  private createAuthorizationHeader(): HttpHeaders {
    const token = this.storageService.getToken();
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }
  
}
