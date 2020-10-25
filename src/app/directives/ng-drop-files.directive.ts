import { Directive, EventEmitter, ElementRef, HostListener, Input, Output} from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = []; 
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  // Realizamos un Hostlistener para realizar un callback cuando esta sucediendo una accion sobre el elemento al que estamos mandando la directiva
  // Con estos hostlistners estamos activando la clase que pone el borde azul, cuando arrastramos un arvhivo al div.
  
  // Cuando el mouse esta encima 
  @HostListener('dragover',['$event'])
  public onDragEnter(event: any){
    this._prevenirDetener(event);
    this.mouseSobre.emit(true);
  }

  // Cuando el mouse sale del div
  @HostListener('dragleave',['$event'])
  public onDragLeave(event: any){
    this.mouseSobre.emit(false);
  }

  // Cuando el mouse suelta el archivo sobre el div
  @HostListener('drop',['$event'])
  public onDrop(event: any){
    
    const transferencia = this._getTransferencia(event);
    
    if (!transferencia) {
      return;
    }
    
    this._extraerArchivos(transferencia.files);
    this._prevenirDetener(event);
    this.mouseSobre.emit(false);

  }

  // Esto es por compatibilidad con navegadores.
  private _getTransferencia(event:any){
    return event.dataTransfer? event.dataTransfer : event.originalEvent.dataTransfer;
  }


  private _extraerArchivos( archivosLista:FileList){
    
    for(const propiedad in Object.getOwnPropertyNames(archivosLista)){
      
      const archivoTemporal =archivosLista[propiedad];

      if(this._archivoPuedeSerCargado(archivoTemporal)){

        const nuevoArchivo= new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }
    }    
  }



  // Validaciones

  private _archivoPuedeSerCargado(archivo:File):boolean{
    if (!this._archivoYaFueDropeado(archivo.name) && this._imgFormat(archivo.type)) {
      return true;
    }else {
      return false;
    }
  }
 


  // Evitar que chrome abra el archivo en el navegador
  private _prevenirDetener(event){
    event.preventDefault();
    event.stopPropagation();
  }

  // Validar que el archivo ya existe en mi arreglo de archivos
  private _archivoYaFueDropeado(nombreArchivo:string):boolean{

    this.archivos.forEach(archivo => {
      
      if (archivo.nombreArchivo === nombreArchivo) {
        console.log(`El archivo ${nombreArchivo} ya esta en la lista`); 
        return true;
      }
    });
    return false;
  }

  // Verificar que sean imagenes
  // Retorna un numero positivo si es imagen, de lo contrario retorna un numero negativo.
  private _imgFormat( tipoArchivo: string): boolean{
     
    return tipoArchivo==='' || tipoArchivo === undefined ? false : tipoArchivo.startsWith('image');
  }


}
