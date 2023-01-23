import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Cliente } from '../cliente';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Region } from '../region';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient,
              private route: Router) { }

  getClientes(page: number): Observable<any>{
    // return of(clientes);
    return this.http.get(this.urlEndPoint+'/page/'+page)
          .pipe(
            tap((resp: any) =>{
              console.log('ServicesService: tap1');
              (resp.content as Cliente[]).forEach(cliente => {
                console.log(cliente.nombre);
              })
            }),
            map((resp: any)=>{
              (resp.content as Cliente[]).map(cliente => {
                cliente.nombre = cliente.nombre.toUpperCase();
                let datePipe = new DatePipe('en-US');
                //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE, MMMM d, yyyy'); 
                //formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
                return cliente;
              });
              return resp;
            }),
            tap((resp: any) =>{
              console.log('ServicesService: tap2');
              (resp.content as Cliente[]).forEach(cliente => {
                console.log(cliente.nombre);
              })
            })
          );
  }

  create(Cliente: Cliente): Observable<Cliente>{
    return this.http.post(this.urlEndPoint, Cliente, {headers: this.httpHeaders})
          .pipe(
            map((resp: any) => resp.cliente as Cliente),
            catchError(e=>{
              if(e.status == 400){
                return throwError((() => new Error(e)));
              }
              this.route.navigate(['/clientes'])
              Swal.fire(e.error.Mensaje, e.error.error, 'error');
              return throwError((() => new Error(e)));
            })
          );
  }     

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)
            .pipe(
              catchError(e=>{
                this.route.navigate(['/clientes'])
                Swal.fire('Error al editar', e.error.Mensaje, 'error');
                return throwError((() => new Error(e)));
              })
            );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders})
            .pipe(
              catchError(e=>{
                if(e.status == 400){
                  return throwError((() => new Error(e)));
                }
                this.route.navigate(['/clientes'])
                Swal.fire(e.error.Mensaje, e.error.error, 'error');
                return throwError((() => new Error(e)));
              })
            );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders})
            .pipe(
              catchError(e=>{
                this.route.navigate(['/clientes'])
                Swal.fire(e.error.Mensaje, e.error.error, 'error');
                return throwError((() => new Error(e)));
              })
            );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{
    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload/`, formData, {
      reportProgress: true,
    });

    return this.http.request(req);
  }

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }
}
