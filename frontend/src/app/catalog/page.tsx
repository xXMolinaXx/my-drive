'use client'
import React, { useEffect, useState, useContext, Suspense } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MainLayout, { StoreContext } from "@/components/layout/MainLayout";
import { useSearchParams } from 'next/navigation'
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Grid, Pagination, TextField, Tooltip, Typography } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { config } from "@/common/configs/config";
import { IProduct } from "@/common/interface/product.interface";
import { addToCart } from "@/common/utils/cart";
import MainAlert from "@/components/alerts/MainAlert";
import { getCookieToken } from "@/common/utils/getCookieToken";
import Image from "next/image";
import { toast } from "react-toastify";

function Catalog2() {
  const { setShoppingCart, shoppingCart, user } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams()
  const search = searchParams.get('searchWord')
  const [products, setProducts] = useState<IProduct[]>([
    {
      category: '',
      name: '',
      price: 0,
      __v: 0,
      _id: '',
      categories: [
        { _id: '', name: '' }
      ]
    }
  ]);
  const [searchWord, setSearchWord] = useState('ninguno');
  const [skip, setSkip] = useState(0);
  const [limit,] = useState(24);
  const [amount, setAmount] = useState(0);
  const [page, setPage] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setmessageAlert] = useState('');
  const [discount, setDiscount] = useState<'senior' | 'superSenior' | 'normal'>('normal')
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSkip(value * limit - limit)
    setPage(value)
  };
  const onChangeImage = async (target: React.ChangeEvent<any>) => {
    try {
      setLoading(true)
      const file = target.currentTarget.files[0];
      if (file !== undefined) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", user._id);
        let data: any = await fetch(`${config.backend}/files/upload/${`${user._id}-${file.name}`}`, {
          method: "POST",
          body: formData,
          headers: {
            // "Content-Type": "application/json",
            // Accept: "application/json",
            Authorization: `Bearer ${getCookieToken()}`,
          },
        }).then(data => data.json());
        if (data.success) {
          toast.success("Imagen subida");
        } else if (data.statusCode === 500) {
          toast.error(data.message);
        }else {
          toast.error(data.message);
        }

      }
    } catch (error: any) {
      console.log(error);
      toast.error("Ocurrio un error al subir la imagen");
    }

    setLoading(false);
  };
  const handleSearchProducts = () => {
    setLoadingProducts(true);
    setProducts([])
    fetch(`${config.backend}/products/${skip}/${limit}/${search ? search : 'ninguno'}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
    }).then(data => data.json()).then(data => {
      if (data.statusCode === 200) {
        setProducts(data.data?.products || [])
        setAmount(Math.round(data.data?.count / limit))
        setLoadingProducts(false);
      } else {
        setOpenAlert(true);
        setmessageAlert(data.message)
      }
    }).catch(e => {
      setLoadingProducts(false)
      setOpenAlert(true);
      setmessageAlert(e.toString())
    })
  }

  return (
    <div className="sm:px-4   mb-14">
      <section className="mt-4 flex">
        <Button variant="contained" startIcon={loading ? <CircularProgress /> : <CloudUploadIcon />} disabled={loading} onClick={() => {
          //@ts-ignore
          document.getElementById(`fileInput`).click()
        }}>Nuevo</Button>
        <input
          id={`fileInput`}
          className="hidden"
          type="file"
          name="avatar"

          onChange={onChangeImage}
        />
      </section>
      <section className="">
        <Grid container spacing={2} justifyContent="center">
          {loadingProducts ? <CircularProgress /> : products?.map(data => (
            <Grid key={data._id} item xs={12} md={3} lg={3}>
              {/* @ts-ignore */}
              <CardComponent name={data.name} price={data.price} addToCart={() => handleAddToCart(data)} discount={discount} categories={data?.categories[0]?.name ? data?.categories[0]?.name : ''} />
            </Grid>
          ))}
          {products.length === 0 && <Typography variant="h5" textAlign={'center'} className="p-5"> Lo sentimos , no hemos encontrado lo que estas buscando</Typography>}
        </Grid>
        <Pagination className="mt-4" count={amount} page={page} color="primary" onChange={handleChange} />
      </section>
      <MainAlert handleClose={() => setOpenAlert(false)} message={messageAlert} open={openAlert} type="error" />
    </div>
  );
}
const CatalogPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Catalog2 />
    </Suspense>
  );
};

export default function Catalog() {
  return (
    <MainLayout>
      <CatalogPage />
    </MainLayout>
  )
}
interface PropCard {
  price: number,
  name: string,
  categories?: string,
  addToCart: () => void,
  discount: 'senior' | 'superSenior' | 'normal'
}
function CardComponent({ price = 100, name = 'Productos', addToCart, discount = 'normal', categories = '' }: PropCard) {
  return (
    <Card >
      {/* <div className="px-3 pt-3">
        <CardMedia
          sx={{ height: 100 }}
          image="/card.webp"
          title="green iguana"
        />
      </div> */}

      <CardContent>
        <Tooltip title={name}>
          <Typography variant="body1" component="div" noWrap={true}>
            {name}
          </Typography>
        </Tooltip>
        <Typography variant="body1" component="div" color="text.secondary" noWrap={true}>
          {categories}
        </Typography>
        <Typography className="font-semibold">
          L.
          {discount === 'normal' && (price)}
          {discount === 'senior' && (price - (price * 0.30))}
          {discount === 'superSenior' && (price - (price * 0.40))}
        </Typography>
        <Typography color={"text.secondary"} variant="body2">
          Descuento / ISV incluido
        </Typography>
      </CardContent>
      <CardActions className="flex justify-center">
        <Tooltip title="Agregar a carrito">
          <Button size="small" variant="contained" onClick={addToCart} ><AddShoppingCartIcon /></Button>
        </Tooltip>

      </CardActions>
    </Card>
  );
} 
