// Helper functions for Element Components

import { DOM } from '../../../Modules/DOM'

namespace Helpers {
    export function loadOnFirstAppearance(hook: Element, className: string = 'preload'): Promise<void> {
        return new Promise((resolve, reject) => {
            hook.classList.add(className);

            DOM.onFirstAppearance(hook, () => {
                hook.classList.remove(className);
                resolve();
            }, { offset: 0.5 });
        });
    }
}

export = Helpers;