import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

/**
 * Combine multiple class name inputs into a single class string with Tailwind-aware merging.
 *
 * @param inputs - Class name values (strings, arrays, objects, etc.) to be combined
 * @returns The final class string with duplicates and conflicting Tailwind classes resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert a FormData into a typed object, treating keys that end with `[]` as arrays.
 *
 * Keys ending with `[]` have the suffix removed and their entries are collected into arrays.
 * If a key appears multiple times without `[]`, its values are converted into an array and appended.
 * Values are kept as provided by FormData (strings or File/Blob).
 *
 * @param formData - The FormData to convert.
 * @returns The resulting object constructed from the FormData, typed as `T`.
 */
export function formDataToObject<T = Record<string, any>>(formData: FormData): T {
  const object: Record<string, any> = Object.create(null);
  const blockedKeys = new Set(['__proto__', 'prototype', 'constructor']);

  formData.forEach((value, key) => {
    // Identifica se a chave deve ser tratada como array (termina em [])
    const isArrayKey = key.endsWith('[]');
    const cleanKey = isArrayKey ? key.slice(0, -2) : key;

    if (blockedKeys.has(cleanKey)) return;
    // Se a chave já existe no objeto
    if (Object.prototype.hasOwnProperty.call(object, cleanKey)) {
      // Garante que o valor atual seja transformado em um array se ainda não for
      if (!Array.isArray(object[cleanKey])) {
        object[cleanKey] = [object[cleanKey]];
      }
      object[cleanKey].push(value);
    } else {
      // Se for uma chave de array, cria o array mesmo com um único item
      // Caso contrário, atribui o valor diretamente (string ou File)
      object[cleanKey] = isArrayKey ? [value] : value;
    }
  });

  return object as T;
}
