import React from 'react';
import {
  Tile,
  useApi,
  reactExtension,
} from '@shopify/ui-extensions-react/point-of-sale';

const SmartGridTile = () => {
  const api = useApi<'pos.home.tile.render'>();
  return (
    <Tile
      title="Add Tattoo"
      subtitle="Facet & Form"
      enabled
      onPress={() => {
        api.action.presentModal();
      }}
    />
  );
};

export default reactExtension('pos.home.tile.render', () => <SmartGridTile />);
