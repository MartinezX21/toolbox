import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ACTIONS, PageLinks } from './constants';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export function formatNumber(num?: number, minDec = 0, maxDec = 2): string {
  if(num === undefined) {
      return "";
  }
  let formater = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: minDec, 
      maximumFractionDigits: maxDec
  });
  return formater.format(num);
}

export const getUrl = (baseUrl: string, params?: string[]) => {
  if(!params) {
    return baseUrl;
  }
  return baseUrl + "?" + params.join("&");
}

export function getTargetUrl(action?: string) {
  switch(action) {
    case ACTIONS.split:
      return PageLinks.split
    case ACTIONS.merge:
      return PageLinks.merge
    case ACTIONS.removePages:
      return PageLinks.removePages
    case ACTIONS.extractPages:
      return PageLinks.extractPages
    case ACTIONS.extractText:
      return PageLinks.imageOcr
    case ACTIONS.plotFunction:
      return PageLinks.plot
    default:
      return undefined
  }
}

export function getTargetActionName(action?: string) {
  switch(action) {
    case ACTIONS.split:
      return "Split"
    case ACTIONS.merge:
      return "Merge"
    case ACTIONS.removePages:
      return "Remove pages"
    case ACTIONS.extractPages:
      return "Extract pages"
    case ACTIONS.extractText:
      return "Extract text"
    case ACTIONS.plotFunction:
      return "Plot functions"
    default:
      return undefined
  }
}