import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  
  private apikey: string = 'Y7L1ZtCMdXC8b1W4Cs8CcgnteFjef6Wy'
  private apiUrl: string = 'https://api.giphy.com/v1/gifs'
  private _historial: string[] = [];

  //https://app.quicktype.io/ -> generador de interfaces a partir de un json
  public results: Gif[] = []; 
  
  get historial() {
    return [...this._historial]
  }

  constructor(private http: HttpClient) {    
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.results = JSON.parse(localStorage.getItem('results')!) || []
  }

  buscarGifs(query: string) {
    
    if (query.length > 0 && !this._historial.includes(query.toLowerCase())) {
      // Unshift para que lo meta al principio
      this._historial.unshift(query.toLowerCase());
      // splice lo mantiene de este tamaño
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apikey)
      .set('q', query)
      .set('limit', '10');
    
    const url = this.apiUrl + query
    // `https://api.giphy.com/v1/gifs/search?api_key=Y7L1ZtCMdXC8b1W4Cs8CcgnteFjef6Wy&limit=10&q=${ query }` --> para meter parámetros se usa el acento grave
    
    this.http.get<SearchGifsResponse>(`${ this.apiUrl }/search`, {params: params}).subscribe((response) => {
      this.results = response.data
      localStorage.setItem('results', JSON.stringify(this.results));
    })
    

    
  }

}
