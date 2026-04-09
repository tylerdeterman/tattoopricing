import React, { useState } from 'react';
import {
  Tile,
  Screen,
  ScrollView,
  Button,
  TextField,
  Text,
  useApi,
  reactExtension,
} from '@shopify/ui-extensions-react/point-of-sale';

// 1. Render the Tile on the POS Home Screen
export default reactExtension('pos.home.tile.render', () => <SmartGridTile />);

// 2. Render the Modal that pops up when the tile is tapped
reactExtension('pos.home.modal.render', () => <CheckoutModal />);

const SmartGridTile = () => {
  const api = useApi();
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

const CheckoutModal = () => {
  const api = useApi();
  const [artist, setArtist] = useState('');
  const [price, setPrice] = useState('');

  const handleAddToCart = () => {
    api.cart.addCustomSale({
      title: `Tattoo - ${artist || 'Artist'}`,
      quantity: 1,
      price: price,
      taxable: true, // Applies your 10.35% store tax
    });
    api.action.dismissModal();
  };

  return (
    <Screen name="Tattoo Checkout" title="Add Tattoo Sale">
      <ScrollView>
        <Text variant="headingLarge">Enter Tattoo Details</Text>

        <TextField
          label="Artist Name (e.g., Madi, Colin)"
          value={artist}
          onChange={setArtist}
        />

        <TextField
          label="Total Amount ($)"
          inputMode="numeric"
          value={price}
          onChange={setPrice}
        />

        <Button 
          title="Add to Cart" 
          onPress={handleAddToCart} 
        />
      </ScrollView>
    </Screen>
  );
};