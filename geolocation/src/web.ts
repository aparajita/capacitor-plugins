import { WebPlugin } from '@capacitor/core';

import type {
  GeolocationPlugin,
  GeolocationOptions,
  GeolocationPosition,
  GeolocationWatchCallback,
  GeolocationPermissionStatus,
} from './definitions';
import { extend } from './util';

export class GeolocationWeb extends WebPlugin implements GeolocationPlugin {
  constructor() {
    super({ name: 'Geolocation' });
  }

  async getCurrentPosition(
    options?: GeolocationOptions,
  ): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          resolve(pos);
        },
        err => {
          reject(err);
        },
        extend(
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
          options,
        ),
      );
    });
  }

  watchPosition(
    options: GeolocationOptions,
    callback: GeolocationWatchCallback,
  ): string {
    const id = navigator.geolocation.watchPosition(
      pos => {
        callback(pos);
      },
      err => {
        callback(null, err);
      },
      extend(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
        options,
      ),
    );

    return `${id}`;
  }

  async clearWatch(options: { id: string }): Promise<void> {
    window.navigator.geolocation.clearWatch(parseInt(options.id, 10));
  }

  async checkPermissions(): Promise<GeolocationPermissionStatus> {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      throw this.unavailable('Permissions API not available in this browser');
    }

    const permission = await window.navigator.permissions.query({
      name: 'geolocation',
    });
    return { location: permission.state };
  }

  async requestPermissions(): Promise<GeolocationPermissionStatus> {
    return { location: 'granted' };
  }
}

const Geolocation = new GeolocationWeb();

export { Geolocation };