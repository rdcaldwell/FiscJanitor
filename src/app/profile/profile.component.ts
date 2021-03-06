import { Component, OnInit } from '@angular/core';
import { AuthenticationService, User } from '../services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public userProfile: User;

  constructor(private authenticationService: AuthenticationService) { }

  /**
   * Gets profile of current user.
   */
  ngOnInit() {
    this.authenticationService.profile().subscribe(user => {
      this.userProfile = user;
    }, (err) => {
      console.error(err);
    });
  }

}
