import { Injectable } from '@angular/core';
import {Registro} from "./models/registro.model";
import {Storage} from "@ionic/storage";
import {NavController} from "@ionic/angular";
import {InAppBrowser} from "@ionic-native/in-app-browser/ngx";

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  guardados: Registro[] = [];
  constructor(private storage: Storage, private navCrl: NavController, private inAppBrowser: InAppBrowser) { }

  async cargarStorage(){
    this.guardados = (await this.storage.get('registros') || [])
  }

  async guardarRegistro (format: string, text: string) {
    await this.storage.create();
    await this.cargarStorage();

    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);

    this.storage.set('registros', this.guardados);
    this.abrirRegistro(nuevoRegistro);
  }

  abrirRegistro(registro: Registro){
    this.navCrl.navigateForward('/navscan/navscan/historial');

    switch (registro.type){
      case 'http':
        this.inAppBrowser.create(registro.text, '_system');
        break;
      case 'geo':
        this.navCrl.navigateForward(`/navscan/navscan/historial/mapa/${registro.text}`);
        break;
    }

  }
}
