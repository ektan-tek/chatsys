import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./material";


import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SelectorComponent } from './@component/selector/selector.component';
import { MainContentComponent } from './@component/main-content/main-content.component';
import { ServerContentComponent } from './@component/server-content/server-content.component';
import { ClientChatComponent } from './@component/client-chat/client-chat.component';
import { ChatFunctionComponent } from './@component/chat-function/chat-function.component';
import { ManageClientComponent } from './@component/manage-client/manage-client.component';

@NgModule({
  declarations: [AppComponent, SelectorComponent, MainContentComponent, ServerContentComponent, ClientChatComponent, ChatFunctionComponent, ManageClientComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    MaterialModule,
    HttpModule,

    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
