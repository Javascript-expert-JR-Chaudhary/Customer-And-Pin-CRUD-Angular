import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  /**
   * 
   * @returns Fetch customer list from local storage
   */
  getCustomerList(): any {
    return new BehaviorSubject(localStorage.getItem('customers'));
  }
  /**
   * Save customer details
   * @param customers customer list array
   */
  saveCustomer(customers: any) {
    localStorage.setItem('customers', JSON.stringify(customers));
  }
  /**
   * 
   * @returns Fetch pin list from local storage
   */
  getPinList(): any {
    return new BehaviorSubject(localStorage.getItem('pins'));
  }
  /**
   * Save pin details
   * @param customers pin list array
   */
  savePin(pins: any) {
    return localStorage.setItem('pins', JSON.stringify(pins));
  }
}
