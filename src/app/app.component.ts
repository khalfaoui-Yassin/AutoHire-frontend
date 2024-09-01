import { Component, OnInit } from '@angular/core';
import { StorageService } from './auth/services/storage/storage.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'car_rental_angular';
  isCustomerLoggedIn: boolean = false;
  isAdminLoggedIn: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private router: Router, private storageService: StorageService) { }

  ngOnInit() {
    // Update login state on route change
    this.subscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isAdminLoggedIn =  this.storageService.isAdminLoggedIn();
          this.isCustomerLoggedIn =  this.storageService.isCustomerLoggedIn();
        }
      })
    );

    // Initialize login state on component initialization
    this.isAdminLoggedIn =  this.storageService.isAdminLoggedIn();
    this.isCustomerLoggedIn =  this.storageService.isCustomerLoggedIn();
  }

  logout() {
    this.storageService.logout();
    this.router.navigateByUrl("/login");
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // Clean up subscriptions
  }
}
