import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converte FormData em um objeto tipado, tratando chaves terminadas em '[]'
 * como arrays.
 */
export function formDataToObject<T = Record<string, any>>(formData: FormData): T {
  const object: Record<string, any> = {};

  formData.forEach((value, key) => {
    // Identifica se a chave deve ser tratada como array (termina em [])
    const isArrayKey = key.endsWith('[]');
    const cleanKey = isArrayKey ? key.slice(0, -2) : key;

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
