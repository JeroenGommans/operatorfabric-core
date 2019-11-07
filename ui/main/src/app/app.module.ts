/* Copyright (c) 2018, RTE (http://www.rte-france.com)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StateModule} from '@ofStore/state.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ServicesModule} from '@ofServices/services.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {LoginComponent} from "./components/login/login.component";
import {IconComponent} from './components/icon/icon.component';
import {TranslateModule} from "@ngx-translate/core";
import {translateConfig} from "./translate.config";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faExternalLinkAlt, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {InfoComponent} from './components/navbar/info/info.component';
import {UtilitiesModule} from "./modules/utilities/utilities.module";

import {
  AuthModule,
  OidcSecurityService,
  ConfigResult,
  OidcConfigService,
  OpenIdConfiguration
} from 'angular-auth-oidc-client';

export function loadConfig(oidcConfigService: OidcConfigService) {
  console.log('APP_INITIALIZER STARTING');
  return () => oidcConfigService.load_using_stsServer('http://localhost:89/auth/realms/dev');
}

library.add(faExternalLinkAlt);
library.add(faSignOutAlt)

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        StateModule.forRoot(),
        ServicesModule.forRoot(),
        NgbModule,
        TranslateModule.forRoot(translateConfig),
        FontAwesomeModule,
        UtilitiesModule,
        AuthModule.forRoot()
    ],
    declarations: [AppComponent, NavbarComponent, LoginComponent, IconComponent, InfoComponent],
    providers: [ { provide: LocationStrategy, useClass: HashLocationStrategy },
      OidcSecurityService,
      OidcConfigService,
      { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [OidcConfigService], multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private oidcSecurityService: OidcSecurityService, private oidcConfigService: OidcConfigService) {

    this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

        const config: OpenIdConfiguration = {
            stsServer: 'http://localhost:89/auth/realms/dev',
            redirect_url: 'http://localhost:4200',
            client_id: 'opfab-client',
            response_type: 'id_token token',
            scope: 'openid email profile',
            trigger_authorization_result_event: true,
            post_logout_redirect_uri: 'http://localhost:4200/unauthorized',
            start_checksession: false,
            silent_renew: false,
            silent_renew_url: 'http://localhost:4200/silent-renew.html',
            post_login_route: '/home',
            forbidden_route: '/forbidden',
            unauthorized_route: '/unauthorized',
            log_console_warning_active: true,
            log_console_debug_active: true,
            max_id_token_iat_offset_allowed_in_seconds: 30,
            history_cleanup_off: true,
            // iss_validation_off: false
            // disable_iat_offset_validation: true
        };

        this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
    });

    console.log('APP STARTING');
  }
}
