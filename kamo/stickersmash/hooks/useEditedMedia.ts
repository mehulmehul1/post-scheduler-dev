import { createContext, useContext, useState, ReactNode } from 'react';

type EditedMedia = {
  uri: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  duration?: number;
  coverUri?: string;
};

const EditedMediaContext = createContext<
  [EditedMedia | undefined, (media: EditedMedia | undefined) => void]
>([undefined, () => undefined]);

export function EditedMediaProvider({ children }: { children: ReactNode }) {
  const state = useState<EditedMedia | undefined>(undefined);
  return (
    <EditedMediaContext.Provider value={state}>
      {children}
    </EditedMediaContext.Provider>
  );
}

export function useEditedMedia() {
  return useContext(EditedMediaContext);
}
