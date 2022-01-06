import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from 'src/app/dialog/logout/logout.component';
import { browserRefresh } from '../../services/user.service';

@Component({
  selector: 'app-quickmode',
  templateUrl: './quickmode.component.html',
  styleUrls: ['./quickmode.component.scss'],
})
export class QuickmodeComponent implements OnInit {
  mode: string = 'Delivery';
  time: string = '';
  userId: any;
  user_obj: any;

  barangays = [
    { name: 'Barangay Asinan' },
    { name: 'Barangay Banicain' },
    { name: 'Barangay Barretto' },
    { name: 'Barangay East Bajac-Bajac' },
    { name: 'Barangay East Tapinac' },
    { name: 'Barangay Gordon Heights' },
    { name: 'Barangay Kababae' },
    { name: 'Barangay Kalaklan' },
    { name: 'Barangay Kalalake' },
    { name: 'Barangay Mabayuan' },
    { name: 'Barangay New Cabalan' },
    { name: 'Barangay New Ilalim' },
    { name: 'Barangay Old Cabalan' },
    { name: 'Barangay Pag-Asa' },
    { name: 'Barangay Sta. Rita' },
    { name: 'Barangay West Bajac-Bajac' },
    { name: 'Barangay West Tapinac' },
  ];

  subic = [
    { name: 'Aningway Sacatihan' },
    { name: 'Asinan Poblacion' },
    { name: 'Asinan Proper' },
    { name: 'Baraca-Camachile' },
    { name: 'Batiawan' },
    { name: 'Calapacuan' },
    { name: 'Calapandayan' },
    { name: 'Cawag' },
    { name: 'Ilwas' },
    { name: 'Mangan-Vaca' },
    { name: 'Matain' },
    { name: 'Naugsol' },
    { name: 'Pamatawan' },
    { name: 'San Isidro' },
    { name: 'Santo Tomas' },
    { name: 'Wawandue' },
  ];

  olongapo = [
    { name: 'Barangay Asinan' },
    { name: 'Barangay Banicain' },
    { name: 'Barangay Barretto' },
    { name: 'Barangay East Bajac-Bajac' },
    { name: 'Barangay East Tapinac' },
    { name: 'Barangay Gordon Heights' },
    { name: 'Barangay Kababae' },
    { name: 'Barangay Kalaklan' },
    { name: 'Barangay Kalalake' },
    { name: 'Barangay Mabayuan' },
    { name: 'Barangay New Cabalan' },
    { name: 'Barangay New Ilalim' },
    { name: 'Barangay Old Cabalan' },
    { name: 'Barangay Pag-Asa' },
    { name: 'Barangay Sta. Rita' },
    { name: 'Barangay West Bajac-Bajac' },
    { name: 'Barangay West Tapinac' },
  ];

  selectedValue: any = null;

  municipality: string = 'Olongapo City';
  public browserRefresh: boolean;
  showSpinner:boolean = false;

  bouquet_obj: any;

  constructor(
    public router: Router,
    private dataService: DataService,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
      this.reload();
  }

  reload() {
    this.browserRefresh = browserRefresh;
    if (browserRefresh == true) {
      alert('Cannot Reload in this page, Redirect back to quick flower page');
      this.router.navigate(['nav/quick']);
    }
    else {
      this.bouquet_obj = history.state.data;
      this.user_obj = this.userService.getUser();
      this.userId = this.user_obj.user_id;
    }
  }

  onChange(deviceValue: any) {
    // console.log(deviceValue.value);
    this.mode = deviceValue.value;
  }

  timeChange(deviceValue: any) {
    // console.log(deviceValue.value);
    this.time = deviceValue.value;
  }

  change(deviceValue: any) {
    // console.log(deviceValue.value);
    this.municipality = deviceValue.value;

    if (deviceValue.value == 'Subic') {
      this.barangays = this.subic;
    } else if (deviceValue.value == 'Olongapo City') {
      this.barangays = this.olongapo;
    }
  }

  barangayChange(deviceValue: any) {
    // console.log(deviceValue.value);
  }

  tConvert(time: any) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    // console.log(time.join(''));
    return time.join(''); // return adjusted time or original string
  }

  formatDate(date:any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  onSubmit(e: any) {
    var today = new Date();
    var date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    date = this.formatDate(date);

    e.preventDefault();

    if (date < e.target[6].value) {
      var desiredTime = this.tConvert(e.target[7].value);
      let user_id = this.userId;
      let order_flower = this.bouquet_obj.quick_name;
      let main_flower: any = null;
      let secondary_flower: any = null;
      let tertiary_flower: any = null;
      let quantity: number = null;
      let order_totalprice = this.bouquet_obj.quick_price + 50;
      let order_id: string = null;
      let order_payment = this.mode;
      let order_time = desiredTime;
      let order_date = e.target[6].value;

      let order_recipient = e.target[0].value;

      let order_address =
        e.target[3].value + ', ' + e.target[2].value + ', ' + e.target[1].value;
      let order_landmark = e.target[4].value;
      let order_contact = e.target[5].value;

      let order_message = e.target[8].value;
      let order_purpose = e.target[9].value;
      if (quantity == 6 || quantity == 9) {
        tertiary_flower = null;
      }
      if (order_id == null) {
        order_id = 'null';
      }
      const filldialog = this.dialog.open(LogoutComponent, {
        id: 'fill_mode',
      });
      filldialog.afterClosed().subscribe((result: boolean) => {
        if (result == true) {
          this.showSpinner = true;
            this.dataService
            .processData(
              btoa('checkout').replace('=', ''),
              {
                user_id,
                order_flower,
                main_flower,
                secondary_flower,
                tertiary_flower,
                order_id,
                quantity,
                order_totalprice,
                order_recipient,
                order_payment,
                order_date,
                order_time,
                order_landmark,
                order_address,
                order_message,
                order_purpose,
                order_contact,
              },
              2
            )
            .subscribe(
              (dt: any) => {
                // console.log(dt.a);
                let load = this.dataService.decrypt(dt.a);
                // console.log(load.status);
                this.showSpinner = false;
                this.snackbar(load.status.message);
                this.router.navigate(['nav/toPay']);
              },
              (er) => {
                this.showSpinner = false;
                this.snackbar('Invalid Inputs');
              }
            );
        }
        else {
          console.log("dialog closed");
        }
      });

    } else if (date == e.target[6].value) {
      var sample = new Date().getTime() + 2 * 60 * 60 * 1000; // get your number
      var datez = new Date(sample); // create Date object

      var time = datez.toLocaleTimeString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      });
      var desiredTime = this.tConvert(e.target[7].value);

      if (time < e.target[7].value) {
        // console.log(desiredTime);
        // console.log(time);
        let user_id = this.userId;
        let order_flower = this.bouquet_obj.quick_name;
        let main_flower: any = null;
        let secondary_flower: any = null;
        let tertiary_flower: any = null;
        let quantity: number = null;
        let order_totalprice = this.bouquet_obj.quick_price + 50;
        let order_id: string = null;
        let order_payment = this.mode;
        let order_time = desiredTime;
        let order_date = e.target[6].value;

        let order_recipient = e.target[0].value;

        let order_address =
          e.target[3].value +
          ', ' +
          e.target[2].value +
          ', ' +
          e.target[1].value;
        let order_landmark = e.target[4].value;
        let order_contact = e.target[5].value;

        let order_message = e.target[8].value;
        let order_purpose = e.target[9].value;
        // console.log(e.target[3].value);
        if (quantity == 6 || quantity == 9) {
          tertiary_flower = null;
        }
        if (order_id == null) {
          order_id = 'null';
        }
        const filldialog = this.dialog.open(LogoutComponent, {
          id: 'fill_mode',
        });
        filldialog.afterClosed().subscribe(result => {
          if (result == true) {
            this.showSpinner = true;
              this.dataService
              .processData(
                btoa('checkout').replace('=', ''),
                {
                  user_id,
                  order_flower,
                  main_flower,
                  secondary_flower,
                  tertiary_flower,
                  order_id,
                  quantity,
                  order_totalprice,
                  order_recipient,
                  order_payment,
                  order_date,
                  order_time,
                  order_landmark,
                  order_address,
                  order_message,
                  order_purpose,
                  order_contact,
                },
                2
              )
              .subscribe(
                (dt: any) => {
                  // console.log(dt.a);
                  let load = this.dataService.decrypt(dt.a);
                  // console.log(load.status);
                  this.showSpinner = false;
                  this.snackbar(load.status.message);
                  this.router.navigate(['nav/toPay']);
                },
                (er) => {
                  this.showSpinner = false;
                  this.snackbar('Invalid Inputs');
                }
              );
          }
          else {
            console.log("dialog closed");
          }
        });
      } else {
        this.snackbar('No time for the florist');
      }
    } else {
      this.snackbar('Invalid date');
    }
  }

  pickSubmit(e: any) {
    var today = new Date();
    var date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();

    e.preventDefault();

    date = this.formatDate(date);

    if (date < e.target[0].value) {
      var desiredTime = this.tConvert(e.target[1].value);
      let user_id = this.userId;
      let order_flower = this.bouquet_obj.quick_name;
      let main_flower: any = null;
      let secondary_flower: any = null;
      let tertiary_flower: any = null;
      let quantity: number = null;
      let order_id: string = null;
      let order_totalprice = this.bouquet_obj.quick_price;
      let order_payment = this.mode;
      let address: any = null;
      let order_time = desiredTime;
      let order_date = e.target[0].value;
      let order_address: any = null;
      let order_landmark: any = null;
      let order_contact = e.target[2].value;

      let order_message = e.target[3].value;
      let order_purpose = e.target[4].value;

      if (quantity == 6 || quantity == 9) {
        tertiary_flower = null;
      }
      if (order_id == null) {
        order_id = 'null';
      }
      const filldialog = this.dialog.open(LogoutComponent, {
        id: 'fill_mode',
      });
      filldialog.afterClosed().subscribe((result: boolean) => {
        if (result == true) {
          this.showSpinner = true;
            this.dataService
            .processData(
              btoa('checkout').replace('=', ''),
              {
                user_id,
                order_flower,
                main_flower,
                order_id,
                secondary_flower,
                tertiary_flower,
                quantity,
                order_totalprice,
                order_payment,
                address,
                order_date,
                order_time,
                order_landmark,
                order_address,
                order_message,
                order_purpose,
                order_contact,  
              },
              2
            )
            .subscribe(
              (dt: any) => {
                // console.log(dt.a);
                let load = this.dataService.decrypt(dt.a);
                // console.log(load.status);
                this.showSpinner = false;
                this.snackbar(load.status.message);
                this.router.navigate(['nav/toPay']);
              },
              (er) => {
                this.showSpinner = false;
                this.snackbar('Invalid Inputs');
              }
            );
        }
        else {
          console.log("dialog closed");
        }
      });

    } else if (date == e.target[0].value) {
      var sample = new Date().getTime() + 2 * 60 * 60 * 1000; // get your number
      var datez = new Date(sample); // create Date object

      var time = datez.toLocaleTimeString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
      });

      var desiredTime = this.tConvert(e.target[1].value);
      if (time < e.target[1].value) {
        // console.log(desiredTime);
        let user_id = this.userId;
        let order_flower = this.bouquet_obj.quick_name;
        let main_flower: any = null;
        let secondary_flower: any = null;
        let tertiary_flower: any = null;
        let quantity: number = null;
        let order_id: string = null;
        let order_totalprice = this.bouquet_obj.quick_price;
        let order_payment = this.mode;
        let address: any = null;
        let order_time = desiredTime;
        let order_date = e.target[0].value;

        let order_address: any = null;
        let order_landmark: any = null;
        let order_contact = e.target[2].value;

        let order_message = e.target[3].value;
        let order_purpose = e.target[4].value;
        // console.log(e.target[2].value);
        if (quantity == 6 || quantity == 9) {
          tertiary_flower = null;
        }
        if (order_id == null) {
          order_id = 'null';
        }
        const filldialog = this.dialog.open(LogoutComponent, {
          id: 'fill_mode',
        });
        filldialog.afterClosed().subscribe(result => {
          if (result == true) {
            this.showSpinner = true;
              this.dataService
              .processData(
                btoa('checkout').replace('=', ''),
                {
                  user_id,
                  order_flower,
                  order_id,
                  main_flower,
                  secondary_flower,
                  tertiary_flower,
                  quantity,
                  order_totalprice,
                  order_payment,
                  address,
                  order_date,
                  order_time,
                  order_landmark,
                  order_address,
                  order_message,
                  order_purpose,
                  order_contact,
                },
                2
              )
              .subscribe(
                (dt: any) => {
                  // console.log(dt.a);
                  let load = this.dataService.decrypt(dt.a);
                  // console.log(load.status);
                  this.showSpinner = false;
                  this.snackbar(load.status.message);
                  this.router.navigate(['nav/toPay']);
                },
                (er) => {
                  this.showSpinner = false;
                  this.snackbar('Invalid Inputs');
                }
              );
          }
          else {
            console.log("dialog closed");
          }
        });
      } else {
        this.snackbar('No time for the florist');
      }
    } else {
      this.snackbar('Invalid date');
    }
  }

  snackbar(message: string) {
    this._snackBar.open(message, '', {
      duration: 1000,
    });
  }
}
