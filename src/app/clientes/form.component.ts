import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ServicesService } from './services/services.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit{
  public cliente: Cliente = new Cliente();
  public titulo: string = 'Crear cliente';
  public errores: string[];
  regiones: Region[];

  constructor(private clientesService: ServicesService,
              private router: Router,
              private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      if(id){
        this.clientesService.getCliente(id).subscribe((cliente)=> this.cliente = cliente);
      }
    });
    this.clientesService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  create(){
    this.clientesService.create(this.cliente)
    .subscribe(cliente=>{
      this.router.navigate(['/clientes'])
      Swal.fire('Nuevo cliente', `El cliente: ${cliente.nombre}, ha sido creado`, 'success')
    }, err=>{
      this.errores = err.error.errors as string[];
      console.log(err.error.errors);
      console.log('Código de error por backend:' + err.status)
    }
    );
  }

  cargarCliente(){
    this.activatedRoute.params.subscribe(params =>{
      let id = params ['id']
      if(id){
        this.clientesService.getCliente(id)
            .subscribe((cliente)=>this.cliente = cliente)
      }
    })
  }

  update(){
    this.clientesService.update(this.cliente)
        .subscribe(json=>{
          this.router.navigate(['/clientes']);
          Swal.fire('Cliente actualizado', `${json.Mensaje}: ${json.cliente.nombre}`, 'success')
        }, err=>{
          this.errores = err.error.errors as string[];
          console.log(err.error.errors);
          console.log('Código de error por backend:' + err.status)
        });
  }

  compararRegion(o1: Region, o2: Region): boolean{
    if(o1 == undefined && o2 == undefined){
      return true
    }
    return o1 == null || o2 == null? false: o1.id === o2.id;
  }
  
}
