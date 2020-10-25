import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


export interface Item{nombre:string, url:string};

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>

  constructor(private fs:AngularFirestore) { 
    this.itemsCollection = fs.collection<Item>('img');
    this.items= this.itemsCollection.valueChanges();
  }

  ngOnInit(): void {
  }


  
}
