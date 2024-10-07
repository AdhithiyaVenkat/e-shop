import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import Link from 'next/link';

interface ProductProps {
  product: {
    _id: string;
    name: string;
    price: number;
    stock: number;
  };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  return (
    <Card className="shadow-lg">
      <CardContent>
        <Typography variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: ₹{product.price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stock: {product.stock}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          component={Link}
          href={`/product/${product._id}`}
          className="text-blue-500 hover:underline"
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
