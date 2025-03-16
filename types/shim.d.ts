declare module "virtual:fib" {
  export function fib(n: number): number;
}

declare module "virtual:env" {
  export const ENV: Record<string, string>;
}
