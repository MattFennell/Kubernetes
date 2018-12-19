export interface NotesMeta {
  error: string;
  isRequesting: {
    [id: string]: {
      isRequestingAddNotes: boolean;
      isRequestingDeleteNotes: boolean;
    };
  };
}
