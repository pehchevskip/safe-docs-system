export const localStorageKeys = {
  privateKeyFile:
    'privateKeyFile'
};

export const getFileFromLocalStorage = (key: string, fileName: string = key): File => {
  // not tested
  return new File([ localStorage.getItem(key) ], fileName, { type: 'text/plain' });
};

export const getFileFromLocalStorageAsText = (key: string): string => {
  return localStorage.getItem(key);
};

export const saveFileInLocalStorage = (key: string, file: File): void => {
  const fileReader = new FileReader();
  fileReader.onload = () => {
    localStorage.setItem(key, fileReader.result as string);
  };
  fileReader.readAsText(file);
}

export const clearFileInLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};
