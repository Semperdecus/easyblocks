import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { EditorContextType } from "../_internals";
import {
  CompilationMetadata,
  CompiledShopstoryComponentConfig,
  FetchOutputResources,
} from "../types";

type EasyblocksCanvasState = {
  meta: CompilationMetadata;
  compiled: CompiledShopstoryComponentConfig;
  externalData: FetchOutputResources;
  formValues: EditorContextType["form"]["values"];
  definitions: EditorContextType["definitions"];
  locale: EditorContextType["contextParams"]["locale"];
  locales: EditorContextType["locales"];
  isEditing: EditorContextType["isEditing"];
  devices: EditorContextType["devices"];
  focussedField: EditorContextType["focussedField"];
};

const EasyblocksCanvasContext = createContext<EasyblocksCanvasState | null>(
  null
);

type EasyblocksCanvasProviderProps = {
  children: ReactNode;
};

const EasyblocksCanvasProvider: React.FC<EasyblocksCanvasProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<EasyblocksCanvasState | null>(null);

  useEffect(() => {
    const handler = (event: any) => {
      if (event.data.type === "@easyblocks/canvas-data") {
        const data = JSON.parse(event.data.data);
        setState((prevState) => ({ ...prevState, ...data }));
      }
    };
    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, []);

  return (
    <EasyblocksCanvasContext.Provider value={state}>
      {children}
    </EasyblocksCanvasContext.Provider>
  );
};

const useEasyblocksCanvasContext = () => {
  return useContext(EasyblocksCanvasContext);
};

export { EasyblocksCanvasProvider, useEasyblocksCanvasContext };
