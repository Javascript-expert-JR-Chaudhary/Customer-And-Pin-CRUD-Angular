import { Component, OnInit } from '@angular/core';
import { RegionList } from './common/factory/region.factory';

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

  formImgName: string = '';

  dropdownList = [
    { "id": 1, "itemName": "India" },
    { "id": 2, "itemName": "Singapore" },
    { "id": 3, "itemName": "Australia" },
    { "id": 4, "itemName": "Canada" },
    { "id": 5, "itemName": "South Korea" },
    { "id": 6, "itemName": "Germany" },
    { "id": 7, "itemName": "France" },
    { "id": 8, "itemName": "Russia" },
    { "id": 9, "itemName": "Italy" },
    { "id": 10, "itemName": "Sweden" }
  ];
  selectedItems = [];
  dropdownSettings = {
    singleSelection: false,
    enableCheckAll: false,
    enableSearchFilter: false,
  };

  constructor() {
    this.getRegionList();
  }


  ngOnInit() { }
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
   * handle file from browsing
   */
  fileBrowseHandler(event: any) {
    this.formImgName = event?.target?.files[0].name;
    console.log(event)
  }

  /**
   * on file drop handler
   */
  onFileDropped(event: any) {
    console.log(event)
    this.formImgName = event?.[0].name;
  }
  /**
   * 
   * @param item Selected item value
   */
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  /**
   * 
   * @param item Single Deselected item value
   */
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  /**
   * 
   * @param items Deselected all item value list
   */
  onDeSelectAll(items: any) {
    console.log(items);
  }
}
