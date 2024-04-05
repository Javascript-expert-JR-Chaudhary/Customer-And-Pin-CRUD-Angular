import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RegionList } from './common/factory/region.factory';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperService } from './common/service/helper.service';
import { Customer } from './common/interface/customer';
import { Pin } from './common/interface/pin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('customerFormEl') customerFormEl: ElementRef<HTMLElement>;
  @ViewChild('pinFormEl') pinFormEl: ElementRef<HTMLElement>;
  @ViewChild('fileDropRef') fileDropRef: ElementRef;
  // Region properties
  region: { [key: string]: any[] } = {
    masterList: [],
    list: [],
    countries: []
  };
  // Customer and Pin properties
  customerList: Customer[] = [];
  pinList: Pin[] = [];
  custForm: FormGroup;
  pinForm: FormGroup;
  formImgName: string = '';
  // Multiselect dropdown properties
  collaboratorList = [];
  dropdownSettings = {
    singleSelection: false,
    enableCheckAll: false,
    enableSearchFilter: false,
  };

  constructor(private helperService: HelperService) {
    this.createCustomerForm();
    this.createPinForm();
    this.getPinAndCustomerList();
    this.getRegionList();
  }

  ngOnInit() { }
  /**
   * Create form schema for customer details
   */
  createCustomerForm() {
    this.custForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      region: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required)
    });
  }
  /**
   * Save customer details
   */
  saveCustomer() {
    if (this.custForm.valid) {
      this.customerList.push(this.custForm.value);
      this.helperService.saveCustomer(this.customerList);
      // After saving customer details add customer inside collaborator list
      let lastId: number = this.collaboratorList.length;
      this.collaboratorList.push({ id: lastId++, itemName: this.custForm.value.name });
      console.log('Sometime collaborator list is noy updated due to lib issue');
      console.log(this.collaboratorList)
      // Close and reset form
      this.customerFormEl.nativeElement.click();
      this.custForm.reset();
      this.helperService.success({ message: 'Customer added successfully!', title: 'Success' });
    } else {
      // Display valition error msg
      Object.keys(this.custForm.controls).forEach(key => {
        this.custForm.controls[key].markAsDirty();
      });
    }
  }
  /**
   * Create form schema for pin details
   */
  createPinForm() {
    this.pinForm = new FormGroup({
      title: new FormControl('', Validators.required),
      collaborators: new FormControl([], Validators.required),
      image: new FormControl('', Validators.required),
      privacy: new FormControl('', Validators.required)
    })
  }
  /**
   * Save pin details
   */
  savePin() {
    if (this.pinForm.valid) {
      this.pinList.push(this.pinForm.value);
      this.helperService.savePin(this.pinList);
      // Close and reset form
      this.pinFormEl.nativeElement.click();
      this.pinForm.reset();
      this.helperService.success({ message: 'Pin added successfully!', title: 'Success' });
    } else {
      // Display valition error msg
      Object.keys(this.pinForm.controls).forEach(key => {
        this.pinForm.controls[key].markAsDirty();
      });
    }
  }
  /**
   * On modal close reset form value
   */
  resetPinForm() {
    this.pinForm.reset();
    this.formImgName = '';
    this.fileDropRef.nativeElement.value = "";
  }
  /**
   * Fetch Region and country details from service API
   */
  getRegionList() {
    this.region.masterList = RegionList;
    this.region.masterList.forEach((val: any) => {
      // Country List
      this.region.countries.push(val?.country);
      if (!this.region.list.includes(val.region)) {
        // Region list
        this.region.list.push(val.region);
      }
    });
  }
  /**
   * Fetch pin and customer list
   */
  getPinAndCustomerList() {
    this.helperService.getCustomerList().subscribe((customers: string) => {
      if (customers) {
        // Set customer list
        this.customerList = JSON.parse(customers);
        this.customerList.forEach((cust: Customer, index: number) => {
          // Set collaborator list
          this.collaboratorList.push({ id: index, itemName: cust.name });
        })
      }
    });
    this.helperService.getPinList().subscribe((pins: string) => {
      if (pins) {
        // Set pin list
        this.pinList = JSON.parse(pins);
      }
    });
  }
  /**
   * handle file from browsing selection event
   */
  fileBrowseHandler(event: any) {
    this.formImgName = event?.target?.files[0].name;
    this.saveImgData(event?.target?.files[0]);
  }
  /**
   * On file drop handler
   */
  onFileDropped(event: any) {
    this.formImgName = event?.[0].name;
    this.saveImgData(event?.[0])
  }
  /**
   *  Save file as base64
   * @param file Selected file evt object
   */
  saveImgData(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Save file base64 data
      this.pinForm.patchValue({
        image: reader.result
      });
    };
  }
  /**
   * 
   * @param event Selected option value like, country or region name
   * @param name Type like, country or region
   */
  handleRegionAndCountryList(event, name) {
    console.log(event.target.value, name)
    let value: string = event.target.value;
    if (value && name == 'country') {
      // Handle region selection according country value
      let region = this.region.masterList.find((reg: any) => reg.country == value);
      if (region.region != this.custForm.value) {
        this.custForm.patchValue({
          region: region.region
        })
      }
    } else if (value && name == 'region') {
      // On region selection manage region countries list
      let region: any[] = this.region.masterList.filter((reg: any) => reg.region == value);
      this.region.countries = region.map((reg: any) => reg.country);
      if (!this.region.countries.includes(this.custForm.value.country)) {
        this.custForm.patchValue({
          country: ''
        })
      }
    }
  }
}
