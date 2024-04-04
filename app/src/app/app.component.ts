import { Component, OnInit } from '@angular/core';
import { RegionList } from './common/factory/region.factory';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperService } from './common/service/helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  region: { [key: string]: any[] } = {
    masterList: [],
    list: [],
    countries: []
  };
  customerList: any[] = [];
  pinList: any[] = [];
  custForm: FormGroup;
  pinForm: FormGroup;
  formImgName: string = '';

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
    })
  }
  /**
   * Save customer details
   */
  saveCustomer() {
    this.customerList.push(this.custForm.value);
    this.helperService.saveCustomer(this.customerList);
    this.collaboratorList.push({ id: Date.now(), itemName: this.custForm.value.name });
    this.custForm.reset();
    console.log(this.custForm.value)
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
    this.pinList.push(this.pinForm.value);
    this.helperService.savePin(this.pinList);
    this.pinForm.reset();
    console.log(this.pinForm.value)
  }
  /**
   * Fetch Region and country details from service API
   */
  getRegionList() {
    this.region.masterList = RegionList;
    this.region.masterList.forEach((val: any) => {
      this.region.countries.push(val?.country);
      if (!this.region.list.includes(val.region)) {
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
        this.customerList = JSON.parse(customers);
        this.customerList.forEach((cust: any, index: number) => {
          this.collaboratorList.push({ id: index, itemName: cust.name });

        })
      }
    });
    this.helperService.getPinList().subscribe((pins: string) => {
      if (pins) {
        this.pinList = JSON.parse(pins);
      }
    });
  }
  /**
   * handle file from browsing
   */
  fileBrowseHandler(event: any) {
    this.formImgName = event?.target?.files[0].name;
    this.saveImgData(event?.target?.files[0]);
    console.log(event)
  }
  /**
   * on file drop handler
   */
  onFileDropped(event: any) {
    console.log(event)
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
