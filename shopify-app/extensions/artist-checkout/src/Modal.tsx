import React, { useState } from 'react';
import {
  Screen,
  ScrollView,
  Button,
  TextField,
  Text,
  useApi,
  reactExtension,
} from '@shopify/ui-extensions-react/point-of-sale';

const CheckoutModal = () => {
  const api = useApi<'pos.home.modal.render'>();
  const [artist, setArtist] = useState('');
  const [price, setPrice] = useState('');

  const handleAddToCart = () => {
    api.cart.addCustomSale({
      title: `Tattoo - ${artist || 'Artist'}`,
      quantity: 1,
      price: parseFloat(price) > 0 ? parseFloat(price).toFixed(2) : "0.00",
      taxable: true,
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

export default reactExtension('pos.home.modal.render', () => <CheckoutModal />);
