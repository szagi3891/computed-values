//@flow

let level = 0;
let refresh: Set<() => void> = new Set();

export const transaction = (funcToRun: () => void) => {
    level++;
    funcToRun();
    level--;

    if (level === 0) {
        const toRefresh = refresh;
        refresh = new Set();

        for (const item of toRefresh.values()) {
            item();
        }
    }
};

export const pushToRefresh = (funcToRefresh: () => void) => {
    if (level > 0) {
        refresh.add(funcToRefresh);
    } else {
        throw Error('The function can only be call in transcription mode.');
    }
};
