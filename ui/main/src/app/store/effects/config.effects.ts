/* Copyright (c) 2020, RTE (http://www.rte-france.com)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {TranslateService} from "@ngx-translate/core";
import {Observable} from 'rxjs';
import {catchError, delay, filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {ConfigService} from '@ofServices/config.service';
import {AppState} from "@ofStore/index";
import {ConfigActionTypes, LoadConfig, LoadConfigFailure, LoadConfigSuccess} from "@ofActions/config.actions";
import {selectConfigRetry} from "@ofSelectors/config.selectors";
import {CONFIG_LOAD_MAX_RETRIES} from "@ofStates/config.state";

// those effects are unused for the moment
@Injectable()
export class ConfigEffects {

    /* istanbul ignore next */
    constructor(private store: Store<AppState>,
                private actions$: Actions,
                private service: ConfigService,
                private translate: TranslateService,

                @Inject('configRetryDelay')
                private retryDelay: number = 5000,
    ) {

        if (this.retryDelay > 0)
            this.retryConfigurationLoading = this.actions$
                .pipe(
                    ofType<LoadConfigFailure>(ConfigActionTypes.LoadConfigFailure),
                    withLatestFrom(this.store.select(selectConfigRetry)),
                    filter(([action, retry]) => retry < CONFIG_LOAD_MAX_RETRIES),
                    map(() => new LoadConfig()),
                    delay(this.retryDelay)
                );
        else
            this.retryConfigurationLoading = this.actions$
                .pipe(
                    ofType<LoadConfigFailure>(ConfigActionTypes.LoadConfigFailure),
                    withLatestFrom(this.store.select(selectConfigRetry)),
                    filter(([action, retry]) => retry < CONFIG_LOAD_MAX_RETRIES),
                    map(() => new LoadConfig())
                );
    }

    /**
     * Manages configuration load -> service request -> success/message
     */
    @Effect()
    loadConfiguration: Observable<Action> = this.actions$
        .pipe(
            ofType<LoadConfig>(ConfigActionTypes.LoadConfig),
            switchMap(action => this.service.fetchConfiguration()),
            map((config: any) => {
                this.initLocales(config);
                return new LoadConfigSuccess({config: config});
            }),
            catchError((err, caught) => {
                this.store.dispatch(new LoadConfigFailure(err));
                return caught;
            })
        );

    /**
     * Manages load retry upon message
     */
    @Effect()
    retryConfigurationLoading: Observable<Action>;

    private initLocales(config: any) {
        // init all supported languages
        if (config.i18n.supported.locales) this.translate.addLangs(config.i18n.supported.locales);
    }
    
}
