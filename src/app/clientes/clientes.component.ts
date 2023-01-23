import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ServicesService } from './services/services.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit{

  clientes: Cliente[];
  paginador: any;
  clienteSelect: Cliente;

  constructor(private clienteServices: ServicesService,
              private activatedRouter: ActivatedRoute,
              private modalService: ModalService){}


  ngOnInit(): void {
   
    this.activatedRouter.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if(!page){
        page = 0;
      }
      this.clienteServices.getClientes(page)
      .pipe(
      tap((resp: any) => {
        console.log('ClientesComponent: tap3');
        (resp.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
      })
    ).subscribe(resp => {
      this.clientes = resp.content as Cliente[];
      this.paginador = resp;
    });
    });
    
  }

  delete(cliente: Cliente){
    Swal.fire({
      title: 'Estas seguro?',
      text: `¿Seguro de eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteServices.delete(cliente.id)
            .subscribe(resp =>{
              this.clientes = this.clientes.filter(cli => cli !== cliente)
              Swal.fire(
                'Eliminado',
                `Cliente ${cliente.nombre} ${cliente.apellido} eliminado`,
                'success'
              )
            })
      }
    })
  }

  abrirModal(cliente: Cliente){
    this.clienteSelect = cliente;
    this.modalService.abrirModal();
  }

}
