import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { UploadImagesService } from '../../providers/upload-images.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit {


  estaSobreElemento=false;
  archivos:FileItem[]=[];


  constructor(public _ui:UploadImagesService) { }

  ngOnInit(): void {
  }

  cargarImagenes(){
    this._ui.cargarImagenesFirebase(this.archivos);
  }

  LimpiarArchivos(){
    this.archivos = [];
  }
}
