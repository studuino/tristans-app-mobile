import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { Observable } from 'rxjs';

import { Profile, UserItem, ContentCard, Error, Token, CanvasUploaded } from 'shared/models';
import { GlobalStore } from 'state/global.store';

import { environment } from 'environments/environment';

/** @todo Add .pipe(catchError(this.handleError)); to all requests in the future */
/** @todo reform the return data and url endpoints when finished with api */
@Injectable()
export class BackendApiService {

  private apiUrl: string = (environment.serveFromCache ? 'api/' : environment.serverUrl);

  constructor(
    private http: HttpClient,
    private globalStore: GlobalStore,
    private fileTransfer: FileTransfer,
  ) { }

  /**
   * Generate the http headers for routes requiring authorization
   * @return Object with http headers
   */
  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.globalStore.state.jwt}` });
  }

  /**
   * Send the server the authcode and return a cookie for the user to login with
   * @param  authCode Auth code for server authentication with google
   * @return Observable<any> (Response from the server)
   */
  public googleLogIn(authCode: string): Observable<Token> {
    return this.http.post<Token>(`${this.apiUrl}auth/google-authcode`, { code: authCode });
  }

  /**
   * Test request for required profile data from local DB
   * @param  id Id string of the user profile
   * @return    Array of user profiles
   */
  public getProfileById(id: number): Observable<Profile> {
    return this.http.get<Profile>(`api/profile/${id}`);
  }

  /**
   * Get an array of user items for a specific view
   * @param  segment   What kind of useritems to be populated
   * @param  userId    Id of the user we are collecting the network user items from
   * @param  results   How many user items to return per request
   * @param  page      Pagnation: How many user items in we are (results*page)
   * @return          Array of user items
   */
  public getNetworkUserItems(segment: string, userId: number, results: number, page: number): Observable<UserItem[]> {

    const params: HttpParams = new HttpParams()
      .set('category', segment)
      .set('results', results.toString())
      .set('page', page.toString());

    return this.http.get<UserItem[]>(`api/user/${userId}/network`, { params });
  }

  /**
   * Get a user item from an id
   * @param  userId ID of user
   * @return        User Item
   */
  public getUserItemById(userId: number): Observable<UserItem> {
    return this.http.get<UserItem>(`api/user/${userId}`);
  }

  /**
   * Get a list of content cards that the user can view
   * @param  target   Which view we will be populating
   * @param  userId   Id of the user we are collecting content for
   * @param  results  How many content cards to return per request
   * @param  page     Pagnation: How many content cards in we are (results*page)
   * @return          Array of content cards
   */
  public getContentCards(target: string, userId: number, results: number, page: number): Observable<ContentCard[]> {
    console.log(`'Page: ${page}`);

    const params: HttpParams = new HttpParams()
      .set('target', target)
      .set('userId', userId.toString())
      .set('results', results.toString())
      .set('page', page.toString());

    return this.http.get<ContentCard[]>('api/content',  { params });
  }

  /**
   * Get a set of memes that were created from a specific canvas
   * @param  canvasId Id of the canvas we want to retrieve memes from
   * @param  results  How many memes to return per request
   * @param  page     Pagnation: How many content cards in we are (results*page)
   * @return          Array of content cards
   */
  public getCanvasMemes(canvasId: number, results: number, page: number): Observable<ContentCard[]> {

    console.log(`'Page: ${page}`);

    const params: HttpParams = new HttpParams()
      .set('results', results.toString())
      .set('page', page.toString());

    return this.http.get<ContentCard[]>(`api/canvas/${canvasId}/memes`, { params });

  }

  /**
   * Get a canvas card from an id
   * @param  canvasId ID of canvas
   * @return          Canvas card
   */
  public getCanvasById(canvasId: number): Observable<ContentCard> {
    return this.http.get<ContentCard>(`${this.apiUrl}canvas/${canvasId}`);
  }

  /**
   * Upload a canvas to the server
   * @param  filePath    Local path of the fiile
   * @param  description Description of the canvas
   * @return             Indication of success
   */
  public async uploadCanvas(filePath: string, description?: string): Promise<CanvasUploaded | Error[]> {

    if (environment.serveFromCache) {
      const canvas: CanvasUploaded = { canvasId: 5 };
      return canvas; // Cannot serve from in memory DB since file transfer is not intetcepted
    }

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    const options: FileUploadOptions = {
      fileKey: 'canvas',
      fileName: 'canvasFile',
      params: {
        description,
      },
    };

    return fileTransfer.upload(filePath, `${environment.serverUrl}canvas/upload`, options).then(
      (res) => {
        const canvasUploaded: CanvasUploaded = JSON.parse(res.response);
        return canvasUploaded;
      },
      (err) => {
        const errors: Error[] = JSON.parse(err.body).errors;
        return errors;
      },
    );

  }

  /**
   * Search users in the database
   * @param  query    String to query the database with
   * @param  results  How many user items to return per request
   * @param  page     Pagnation: How many useritems in we are (results*page)
   * @return          List of users
   */
  public searchUsers(query: string, results: number, page: number): Observable<UserItem[]> {

    const params: HttpParams = new HttpParams()
      .set('query', query)
      .set('results', results.toString())
      .set('page', page.toString());

    return this.http.get<UserItem[]>('api/search/users', { params });

  }

}
