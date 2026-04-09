import React, { useState, useEffect } from 'react';
import {
  Screen,
  ScrollView,
  Button,
  RadioButtonList,
  TextField,
  Text,
  Banner,
  useApi,
  reactExtension,
} from '@shopify/ui-extensions-react/point-of-sale';

const ARTISTS_URL = 'https://tattoopricing-wfcj3.ondigitalocean.app/api/artists';

const CheckoutModal = () => {
  const api = useApi<'pos.home.modal.render'>();
  const [artists, setArtists] = useState<string[]>([]);
  const [artist, setArtist] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(ARTISTS_URL)
      .then((r) => r.json())
      .then((data: { name: string }[]) => {
        setArtists(data.map((a) => a.name));
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load artists. Check your connection.');
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async () => {
    if (!artist) {
      setError('Please select an artist.');
      return;
    }
    const amount = parseFloat(price);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setError('');
    try {
      await api.cart.addCustomSale({
        title: `Tattoo - ${artist}`,
        quantity: 1,
        price: amount.toFixed(2),
        taxable: true,
      });
      api.action.dismissModal();
    } catch (e) {
      setError(`Could not add to cart: ${String(e)}`);
    }
  };

  return (
    <Screen name="Tattoo Checkout" title="Add Tattoo Sale">
      <ScrollView>
        <Banner
          title={error}
          variant="error"
          visible={!!error}
          hideAction={false}
          onPress={() => setError('')}
        />

        <Text variant="headingLarge">Add Tattoo Sale</Text>

        <Text variant="headingSmall">Select Artist</Text>
        {loading ? (
          <Text>Loading artists…</Text>
        ) : (
          <RadioButtonList
            items={artists}
            onItemSelected={setArtist}
            initialSelectedItem={artist}
          />
        )}

        <TextField
          label="Total Amount ($)"
          value={price}
          onChange={setPrice}
        />

        <Button title="Add to Cart" onPress={handleAddToCart} />
      </ScrollView>
    </Screen>
  );
};

export default reactExtension('pos.home.modal.render', () => <CheckoutModal />);
