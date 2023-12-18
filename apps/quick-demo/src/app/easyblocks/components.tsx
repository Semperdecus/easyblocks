"use client";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { builtinEditableComponents } from "@easyblocks/editable-components";
import { Image } from "./components/Image/Image.client";
import { Video } from "./components/Video/Video.client";
import { Stack } from "./components/Stack/Stack.client";
import { Buttons } from "./components/Buttons/Buttons.client";
import { RootSections } from "./components/RootSections/RootSections.client";
import { Grid } from "./components/Grid/Grid.client";
import { TwoCards } from "./components/TwoCards/TwoCards.client";
import { BackgroundColor } from "./components/BackgroundColor/BackgroundColor.client";
import { Button } from "./components/Button/Button.client";

const $Link = (props: any) => {
  const { url, shouldOpenInNewWindow, trigger: TriggerElement } = props;

  return (
    <TriggerElement.type
      {...TriggerElement.props}
      as={"a"}
      href={url}
      target={shouldOpenInNewWindow ? "_blank" : undefined}
    />
  );
};

const $AlertAction = (props: any) => {
  const { text, trigger: TriggerElement } = props;

  return (
    <TriggerElement.type
      {...TriggerElement.props}
      as={"button"}
      onClick={() => {
        alert(text);
      }}
    />
  );
};

const components = {
  ...builtinEditableComponents(),
  ProductCard,
  $Link,
  $AlertAction,
  RootSections,
  Buttons,
  Button,
  Image: Image,
  Video: Video,
  Stack,
  Grid,
  TwoCards,
  BackgroundColor,
};

export { components };
