import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ServicesService } from './services/services.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit{

  cliente: Cliente[];

  constructor(private clienteServices: ServicesService){}


  ngOnInit(): void {
    this.clienteServices.getClientes()
    .subscribe(cliente => this.cliente = cliente);
  }

}
