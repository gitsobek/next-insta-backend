export type AppendArgument<F extends (...args: any[]) => any, A> = (x: A, ...args: Parameters<F>) => ReturnType<F>;

export type Period = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
