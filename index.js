import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'
import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from './validations.js'
import {
	UserController,
	PostController,
	CommentController,
} from './controllers/index.js'
import { handleValidationErrors, checkAuth } from './utils/index.js'

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

mongoose
	.connect(
		'mongodb+srv://gusliakovgleb:24871979Ee@blog-mern.ep5bn.mongodb.net/blog?retryWrites=true&w=majority&appName=Blog-Mern'
	)
	.then(() => console.log('DB Ok'))
	.catch(err => console.log('DB Error', err))

app.post('/upload', upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.post(
	'/auth/register',
	registerValidation,
	handleValidationErrors,
	UserController.register
)
app.post(
	'/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post(
	'/posts',
	handleValidationErrors,
	checkAuth,
	postCreateValidation,
	PostController.create
)
app.get('/posts', PostController.getAll)
app.get('/posts/popular', PostController.getAllByPopularity)
app.get('/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.get('/posts/tags/:id', PostController.getPostsByTags)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch(
	'/posts/:id',
	checkAuth,
	handleValidationErrors,
	PostController.update
)

// Comments
app.get('/comment', CommentController.getComments)
app.delete('/comment/:id', CommentController.removeComment)
app.post('/comment', checkAuth, CommentController.createComment)

app.listen(4444, err => {
	if (err) {
		return console.log(err)
	}
	console.log('Server OK')
})
