import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FileItem } from '../models/file-item';
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class UploadImagesService {

  private CARPETA_IMAGENES= 'img';


  constructor(private db:AngularFirestore) {

  }

  cargarImagenesFirebase(imagenes:FileItem[]){

    const storageRef = firebase.storage().ref();
    
    for(const img of imagenes){

      img.estaSubiendo=true;

      if (img.progreso>=100){
        continue;
      }

      const uploadTask:firebase.storage.UploadTask = storageRef.child(`${this.CARPETA_IMAGENES}/${img.nombreArchivo}`).put(img.archivo); 

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapchot:firebase.storage.UploadTaskSnapshot) => img.progreso=(snapchot.bytesTransferred/snapchot.totalBytes) * 100,
        (error) => console.error('Error al subir',error),
        async ()=> {

          console.log('Imagen cargada correctamente');
          await uploadTask.snapshot.ref.getDownloadURL()
          .then(downloadUrl=> {
            console.log(downloadUrl);
            img.url=downloadUrl})
            .catch(err=>console.log(err));
          
            img.estaSubiendo=false;


          // La imagen a esta altura ya se encuentra guardada en el storage de firebase, aqui lo que hacemos es crear una referencia a la base de datos.
            console.log(img);
            console.log(img.nombreArchivo);
            console.log(img.url);
            
          this.guardarImagen({
            nombre:img.nombreArchivo,
            url:img.url
          })
        });
    }
  }

  // Lo que se encuentra dentro del argumento de la funcion es una declaracion del modelo del tipo de elemento que va a recibir la funcion.
  private guardarImagen(imagen:{nombre:string, url:string}){
    
    this.db.collection(`/${this.CARPETA_IMAGENES}`)
      .add(imagen).then(resp=>console.log(resp)).catch(err=>console.log(err))
  }


}
