import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { App } from './app/app';
import { appConfig } from './app/app.config';

const mergedProviders = [
  ...(appConfig?.providers ?? []),
  importProvidersFrom(HttpClientModule)
];

bootstrapApplication(App, { ...appConfig, providers: mergedProviders })
  .catch((err) => console.error(err));
