class DocumentListenerService {
  public static addListener = (event: string, listen: EventListenerOrEventListenerObject): void => {
    document.addEventListener(event, listen);
  };

  public static removeListener = (
    event: string,
    listen: EventListenerOrEventListenerObject
  ): void => {
    document.removeEventListener(event, listen);
  };
}
export default DocumentListenerService;
