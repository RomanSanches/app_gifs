import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = [];
  private apiKey    : string   = 'j5OdsapN5jkPZn1X4FOGWaVBuHUo0DEf';
  private serviceUrl: string   = 'https://api.giphy.com/v1/gifs'

  //cambiar any por su tipo correcto
  public resultados: Gif[]= [];

  get historial() {

    return [...this._historial];
  }

  constructor(private http: HttpClient){
          //el ! es para que el modo estricto no se queje
        this._historial = JSON.parse(localStorage.getItem('historial')! )|| [];
        this.resultados = JSON.parse(localStorage.getItem('resultado')! )|| [];

  }

  buscarGifs(query: string){

    query = query.trim().toLowerCase();

    if (!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

      localStorage.setItem("historial", JSON.stringify(this._historial))
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.serviceUrl}/search`,{params})
      .subscribe((resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem("resultado", JSON.stringify(this.resultados))
      });

  }
}
