import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { StorageService } from '../../../auth/services/storage/storage.service';

const BASIC_URL = 'http://localhost:2003';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  // Method to fetch all cars
  getAllCars(): Observable<any> {
    return this.http.get(BASIC_URL + "/api/customer/cars", {
      headers: this.createAuthorizationHeader()
    });
  }

  // Method to get car details by ID
  getCarById(carId: number): Observable<any> {
    return this.http.get(BASIC_URL + "/api/customer/car/" + carId, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }
  
  // Method to book a car
  bookACar(carId: number, bookCarDto: any): Observable<any> {
    return this.http.post<[]>(BASIC_URL + "/api/customer/car/book/" + carId, bookCarDto, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Method to get bookings by user ID
  getBookingsByUserId(): Observable<any> {
    const userId = this.storageService.getUserId();
    return this.http.get(BASIC_URL + "/api/customer/car/bookings/" + userId, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      catchError(this.handleError)
    );
  }

  searchCar(searchCarDto: any): Observable<any> {
    return this.http.post(BASIC_URL + "/api/customer/car/search", searchCarDto, {
      headers: this.createAuthorizationHeader()
    });
  }

  // Method to create authorization header with Bearer token
  private createAuthorizationHeader(): HttpHeaders {
    const token = this.storageService.getToken();
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }


  // Error handler for HTTP requests
  private handleError(error: any): Observable<never> {
    console.error('Backend returned code', error.status, 'body was:', error.error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
