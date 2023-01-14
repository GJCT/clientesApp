import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cliente } from '../cliente';
import { clientes } from '../clientes.json';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor() { }

  getClientes(): Observable<Cliente[]>{
    return of(clientes);
  }
}
