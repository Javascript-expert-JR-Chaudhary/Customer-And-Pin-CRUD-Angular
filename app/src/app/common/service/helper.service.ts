import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Customer } from '../interface/customer';
import { Pin } from '../interface/pin';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  constructor(private toastr: ToastrService) { }
  /**
   * 
   * @param data Message and title details
   */
  success(data: { [key: string]: string }) {
    this.toastr.success(data['message'], data['title']);
  }
  /**
   * 
   * @returns Fetch customer list from local storage
   */
  getCustomerList() {
    return new BehaviorSubject(localStorage.getItem('customers'));
  }
  /**
   * Save customer details
   * @param customers customer list array
   */
  saveCustomer(customers: Customer[]) {
    localStorage.setItem('customers', JSON.stringify(customers));
  }
  /**
   * 
   * @returns Fetch pin list from local storage
   */
  getPinList() {
    return new BehaviorSubject(localStorage.getItem('pins'));
  }
  /**
   * Save pin details
   * @param customers pin list array
   */
  savePin(pins: Pin[]) {
    return localStorage.setItem('pins', JSON.stringify(pins));
  }
}
