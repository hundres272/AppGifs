import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateHTTP, Gif } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = '7ijtI6QaCQJnOHWXcDHQfRUNzwjgJ35t';
  private servicioURL: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];
  public resultados: Gif[] = [];

  constructor(private http: HttpClient) {
    // console.log();
    this.getLocal();
  }
  
  getLocal () {
    const local = localStorage.getItem('gifs');
    if(local!==''){
      var vector = localStorage.getItem('gifs')?.split(',')||'';
      for (let i = 0; i < vector.length; i++) {
        this._historial.push(vector[i]);
        this.buscarGifs(this._historial[0]);
      }
    }
  }

  get historial(){
    return [...this._historial];
  }
  
  buscarGifs(query:string = ''){
    query=query.trim().toLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);
      localStorage.setItem('gifs',`${this._historial}`);
    }

    const params = new HttpParams()
      .set('api_key',this.apiKey)
      .set('q',query)
      .set('limit','10')

    this.http.get<DateHTTP>(`${this.servicioURL}/search`,{params})
    .subscribe( (resp) => {
      console.log(resp.data);
      this.resultados = resp.data;
    })
  }

}
