import { NgModule, ModuleWithProviders } from '@angular/core';

import { TranslationModule } from './translation.module';
import { InjectorRef } from '../models/injector-ref';
import { LOCALE_CONFIG, TRANSLATION_CONFIG, L10N_ROOT, L10nConfig, Token } from '../models/l10n-config';
import { DefaultLocaleBuilder } from '../models/default-locale-builder';
import { LocalizedRouting } from '../models/localized-routing';
import { L10nLoader } from '../services/l10n-loader';
import { LocaleService } from '../services/locale.service';
import { LocaleStorage, BrowserStorage } from '../services/locale-storage';
import { TranslationService } from '../services/translation.service';
import { TranslationProvider, HttpTranslationProvider } from '../services/translation-provider';
import { TranslationHandler, DefaultTranslationHandler } from '../services/translation-handler';
import { L10nDatePipe } from '../pipes/l10n-date.pipe';
import { L10nDecimalPipe, L10nPercentPipe, L10nCurrencyPipe } from '../pipes/l10n-number.pipe';
import { L10nDateDirective } from '../directives/l10n-date.directive';
import {
    L10nDecimalDirective,
    L10nPercentDirective,
    L10nCurrencyDirective
} from '../directives/l10n-number.directive';

/**
 * Provides dependencies, pipes & directives for translating messages, dates & numbers.
 */
@NgModule({
    declarations: [
        L10nDatePipe,
        L10nDecimalPipe,
        L10nPercentPipe,
        L10nCurrencyPipe,
        L10nDateDirective,
        L10nDecimalDirective,
        L10nPercentDirective,
        L10nCurrencyDirective
    ],
    imports: [
        TranslationModule
    ],
    exports: [
        TranslationModule,
        L10nDatePipe,
        L10nDecimalPipe,
        L10nPercentPipe,
        L10nCurrencyPipe,
        L10nDateDirective,
        L10nDecimalDirective,
        L10nPercentDirective,
        L10nCurrencyDirective
    ]
})
export class LocalizationModule {

    /**
     * Use in AppModule: new instances of LocaleService & TranslationService.
     */
    public static forRoot(l10nConfig: L10nConfig, token: Token = {}): ModuleWithProviders<LocalizationModule> {
        return {
            ngModule: LocalizationModule,
            providers: [
                InjectorRef,
                { provide: LOCALE_CONFIG, useValue: l10nConfig.locale || {} },
                { provide: TRANSLATION_CONFIG, useValue: l10nConfig.translation || {} },
                { provide: L10N_ROOT, useValue: true },
                DefaultLocaleBuilder,
                LocalizedRouting,
                LocaleService,
                {
                    provide: LocaleStorage,
                    useClass: token.localeStorage || BrowserStorage
                },
                TranslationService,
                {
                    provide: TranslationProvider,
                    useClass: token.translationProvider || HttpTranslationProvider
                },
                {
                    provide: TranslationHandler,
                    useClass: token.translationHandler || DefaultTranslationHandler
                },
                L10nLoader
            ]
        };
    }

    /**
     * Use in feature modules with lazy loading: new instance of TranslationService.
     */
    public static forChild(l10nConfig: L10nConfig, token: Token = {}): ModuleWithProviders<LocalizationModule> {
        return {
            ngModule: LocalizationModule,
            providers: [
                InjectorRef,
                { provide: TRANSLATION_CONFIG, useValue: l10nConfig.translation || {} },
                { provide: L10N_ROOT, useValue: false },
                TranslationService,
                L10nLoader
            ]
        };
    }

    constructor(private injector: InjectorRef) {
        // Creates the instance of the InjectorRef, so that module dependencies are available.
    }

}
