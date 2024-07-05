!Info tambahan: Tidak bisa di deploy karena ada bug di env, yg membuat env tidak terbaca.

env berisi:
export const SECRET: string = process.env.SECRET
// CLOUDINARY
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
export const CLOUDINARY_CLOUDNAME = process.env.CLOUDINARY_CLOUDNAME
export const DATABASE_URL = process.env.DATABASE_URL
// NODEMAILER
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
export const EMAIL_USER = process.env.EMAIL_USER

// Order Routes
router.get('/order', [authMiddleware, aclMiddleware(["user"])], historyOrder)
router.post('/order', [authMiddleware, aclMiddleware(["user"])], createOrder)

// Product Routes
router.post('/product', single, createProduct)
router.get('/product', getAllProducts)
router.get('/product/:id', getProduct)
router.put('/product:/id', updateProduct)
router.delete('/product', deleteProduct)

// Category Routes
router.post('/category', createCategory)
router.get('/category', getAllCategories)
router.get('/category/:id', getCategory)
router.put('/category/:id', updateCategory)
router.delete('/category/:id', deleteCategory)

// Authentication
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get("/auth/me", [authMiddleware, aclMiddleware(["user"])], authController.me);
router.put("/auth/profile", authMiddleware, authController.profile);