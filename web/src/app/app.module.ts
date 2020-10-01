import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';

import { AppComponent } from './app.component';
import { CrpytingCompComponent } from './crpyting-comp/crpyting-comp.component';
import { UploadDocsFormComponent } from './upload-docs-form/upload-docs-form.component';

@NgModule({
  declarations: [
    AppComponent,
    CrpytingCompComponent,
    UploadDocsFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MultiSelectModule,
    FileUploadModule,
    TabViewModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
