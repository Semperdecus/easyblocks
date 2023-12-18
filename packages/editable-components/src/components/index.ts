import BackgroundColor from "./$backgroundColor/$backgroundColor.client";
import Buttons from "./$buttons/$buttons.client";
import ImageClient from "./$image/$image.client";
import ImageEditor from "./$image/$image.editor";
import RootGrid from "./$RootGrid/$RootGrid.client";
import RootSections from "./$RootSections/$RootSections.client";
import Stack from "./$stack/$stack";
import TwoItems from "./$twoItems/$twoItems";
import VideoClient from "./$video/$video.client";
import VideoEditor from "./$video/$video.editor";
import BannerCard_v2 from "./BannerCard2/BannerCard2";
import BasicCard from "./BasicCard/BasicCard.client";
import CardPlaceholder from "./CardPlaceholder/CardPlaceholder.client";
import ComponentContainer from "./ComponentContainer/ComponentContainer.client";
import Grid from "./Grid/Grid";
import Placeholder from "./Placeholder/Placeholder";
import Playground from "./Playground/Playground.client";
import Separator from "./Separator/Separator.client";
import StandardButton from "./StandardButton/StandardButton.client";
import TwoCards from "./TwoCards/TwoCards";
import VimeoPlayer from "./vimeoPlayer/vimeoPlayer.client";
import SectionWrapper from "./SectionWrapper/SectionWrapper";

const defaultEditableComponents = Object.freeze({
  "$image.client": ImageClient,
  "$image.editor": ImageEditor,
  "$video.client": VideoClient,
  "$video.editor": VideoEditor,
  $backgroundColor: BackgroundColor,
  $BannerCard2: BannerCard_v2,
  $BannerSection2: SectionWrapper,
  $BasicCard: BasicCard,
  $BasicCardBackground: BasicCard,
  $buttons: Buttons,
  $CardPlaceholder: CardPlaceholder,
  $ComponentContainer: ComponentContainer,
  $Grid: SectionWrapper,
  $GridCard: Grid,
  $Placeholder: Placeholder,
  $Playground: Playground,
  $RootGrid: RootGrid,
  $RootSections: RootSections,
  $separator: Separator,
  $stack: Stack,
  $StandardButton: StandardButton,
  $TwoCards: SectionWrapper,
  $TwoCardsCard: TwoCards,
  $twoItems: TwoItems,
  $vimeoPlayer: VimeoPlayer,
});

function builtinEditableComponents(
  componentsOverrides: Partial<typeof defaultEditableComponents> = {}
) {
  return {
    ...defaultEditableComponents,
    ...componentsOverrides,
  };
}

const defaultBuiltinClientOnlyEditableComponents = Object.freeze({
  "$image.client": ImageClient,
  "$video.client": VideoClient,
  $backgroundColor: BackgroundColor,
  $BannerCard2: BannerCard_v2,
  $BannerSection2: SectionWrapper,
  $BasicCard: BasicCard,
  $BasicCardBackground: BasicCard,
  $buttons: Buttons,
  $CardPlaceholder: CardPlaceholder,
  $ComponentContainer: ComponentContainer,
  $Grid: SectionWrapper,
  $GridCard: Grid,
  $Playground: Playground,
  $RootGrid: RootGrid,
  $RootSections: RootSections,
  $separator: Separator,
  $stack: Stack,
  $StandardButton: StandardButton,
  $TwoCards: SectionWrapper,
  $TwoCardsCard: TwoCards,
  $twoItems: TwoItems,
  $vimeoPlayer: VimeoPlayer,
});

function builtinClientOnlyEditableComponents(
  componentsOverrides: Partial<
    typeof defaultBuiltinClientOnlyEditableComponents
  > = {}
) {
  return {
    ...defaultBuiltinClientOnlyEditableComponents,
    ...componentsOverrides,
  };
}

export { builtinEditableComponents, builtinClientOnlyEditableComponents };
