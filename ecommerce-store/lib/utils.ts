import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const formatter = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "BDT"
// });


export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currencyDisplay:"narrowSymbol",
  currency: "BDT"
});
