declare const process: {
    exit(code?: number): void,
};

declare const setTimeout: (callback: () => void, timeout: number) => void;
