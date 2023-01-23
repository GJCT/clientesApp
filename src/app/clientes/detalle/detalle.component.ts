import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ServicesService } from '../services/services.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit{

  @Input() cliente: Cliente;
  private selectFoto: File;
  progreso: number = 0; 
  modal = this.modalService;
  clienteSelect: Cliente;

  constructor(private clienteService: ServicesService,
              private activatedRoute: ActivatedRoute,
              private modalService: ModalService){}
  ngOnInit(): void {}

  seleccionarFoto(event){
    this.selectFoto = event.target.files[0];
    this.progreso = 0;
    console.log(this.selectFoto);
    if(this.selectFoto.type.indexOf('image') < 0){
      Swal.fire('Error en imagen: ', 'El archivo debe ser una foto', 'error');
      this.selectFoto = null;
    }
  }

  subirFoto(){
    if(!this.selectFoto){
      Swal.fire('Error upload: ', 'Seleccione una foto', 'error');
    }else{
      this.clienteService.subirFoto(this.selectFoto, this.cliente.id)
    .subscribe(event =>{
      // this.cliente = cliente;
      if(event.type === HttpEventType.DownloadProgress){
        this.progreso = Math.round((event.loaded/event.total)*100);
      }else if(event.type === HttpEventType.Response){
        let response: any = event.body;
        this.cliente = response.cliente as Cliente
        Swal.fire('La foto a sido cargada', response.mensaje, 'success');
      }
      
    });
    }
    
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.selectFoto = null;
    this.progreso = 0;
  }

  abrirModal(cliente: Cliente){
    this.clienteSelect = cliente;
    this.modalService.abrirModal();
  }

}
