'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import api from '@/utils/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

const ProductDetailsPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${productId}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box className="p-6">
      {product ? (
        <>
          <Typography variant="h4" className="mb-4">{product.name}</Typography>
          <Typography variant="body1" className="mb-4">{product.description}</Typography>
          <Typography variant="h5" className="mb-4">₹{product.price}</Typography>
          <Typography variant="body2" className="mb-4">Stock available: {product.stock}</Typography>
        </>
      ) : (
        <Typography variant="body1">Product not found.</Typography>
      )}
    </Box>
  );
};

export default ProductDetailsPage;
