import express from "express";
import CartManager from "../functions/cartManager.js";

export const cartsRouter = express.Router();

const cartManager = new CartManager("carts.json");

// cartsRouter.get

cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();

    if (carts) {
      res.json(carts);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// cartsRouter.post

cartsRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//cartsRouter.get("/:cid", async

cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(parseInt(cartId));

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ message: `no pudimos ${cartId} encontrarlo` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// cartsRouter.post("/:cid/product/:pid", async

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    // Verificar si el carrito existe
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: `No encontrmos ${cartId} esto` });
    }

    // Verificar si el producto existe
    const product = await cartManager.getProductById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Producto ${productId} no encontrado` });
    }

    await cartManager.addProductToCart(cartId, productId);
    res.json({
      message: `Producto ${productId} agregado ${cartId}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
