"use client";

import { QuickDemoEasyblocksProvider } from "@/app/easyblocks/QuickDemoEasyblocksProvider";
import { easyblocksConfig } from "@/app/easyblocks/easyblocks.config";
import { ExternalData, FetchOutputResources } from "@easyblocks/core";
import { EasyblocksEditor } from "@easyblocks/react";
import { useState } from "react";
import { createMyCustomFetch } from "../easyblocks/myCustomFetch";

const myCustomFetch = createMyCustomFetch(easyblocksConfig.accessToken);

export default function EeasyblocksEditorPage() {
  const [externalData, setExternalData] = useState<ExternalData>({});

  return (
    <QuickDemoEasyblocksProvider>
      <EasyblocksEditor
        config={easyblocksConfig}
        externalData={externalData}
        onExternalDataChange={async (externals) => {
          const fetchedExternalData = await myCustomFetch(externals);
          const removedExternals = Object.entries(externals)
            .filter(
              ([id, externalDataValue]) =>
                externalDataValue.externalId === null && externalData[id]
            )
            .map(([externalId]) => externalId);

          const newExternalData: ExternalData = {
            ...externalData,
            ...fetchedExternalData,
          };

          for (const removedExternalId of removedExternals) {
            delete newExternalData[removedExternalId];
          }

          setExternalData(newExternalData);
        }}
      />
    </QuickDemoEasyblocksProvider>
  );
}
