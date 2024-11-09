declare global {
  interface Window {
    [key: string]: any;
  }
}

export const jsonp = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const callbackName = "jsonpgz";

    window[callbackName] = (result: any) => {
      resolve(result);
      document.body.removeChild(script);
      window[callbackName] = undefined;
    };

    script.src = url;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};
