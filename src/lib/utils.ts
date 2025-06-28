import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encodeSvgForDataUri(svgString: string): string {
  const cleanSvg = svgString
    .replace(/[\r\n]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  const encoded = cleanSvg
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, '%20')
  
  return `data:image/svg+xml,${encoded}`
}
