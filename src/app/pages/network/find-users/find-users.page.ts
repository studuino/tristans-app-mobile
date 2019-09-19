import { Component, OnInit } from '@angular/core';
import { BackendApiService } from 'services/backend-api/backend-api.service';

import { UserItem } from 'shared/models';

@Component({
  selector: 'app-find-users',
  templateUrl: './find-users.page.html',
  styleUrls: ['./find-users.page.scss'],
})
export class FindUsersPage implements OnInit {

  public userItemList: UserItem;
  private page = 1;
  private results = 20;

  constructor(private http: BackendApiService) { }

  /**
   * Show recommended users
   */
  public ngOnInit() {

    this.http.searchUsers('*', this.results, this.page).toPromise().then((res) => {
      console.log(res);
    });

  }

  /**
   * Search the data base for users with the proided string
   */
  public search() {

  }

}
