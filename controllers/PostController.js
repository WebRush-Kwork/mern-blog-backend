import PostScheme from '../models/Post.js'

export const getAll = async (req, res) => {
	try {
		const posts = await PostScheme.find().populate('user').exec()

		res.json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить статьи',
		})
	}
}

export const getAllByPopularity = async (req, res) => {
	try {
		const posts = await PostScheme.find()
			.sort({ viewsCount: 'descending' })
			.populate('user')
			.exec()

		res.json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить статьи по популярности',
		})
	}
}

export const getPostsByTags = async (req, res) => {
	try {
		const params = req.params.id
		const posts = await PostScheme.find({ tags: params })
			.populate('user')
			.exec()
		res.json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить статьи по тегам',
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id

		const doc = await PostScheme.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			}
		)
			.populate('user')
			.exec()

		if (!doc) {
			return res.status(404).json({ message: 'Статья не найдена' })
		}

		res.json(doc)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось открыть статью',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const postId = req.params.id

		const doc = await PostScheme.findOneAndDelete({
			_id: postId,
		})

		if (!doc) {
			return res.status(404).json({ message: 'Статья не найдена' })
		}
		res.json({ isDeleted: true })
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось удалить статью',
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id

		await PostScheme.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags.split(','),
				imageUrl: req.body.imageUrl,
				user: req.userId,
			}
		)

		res.json({ success: true })
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось обновить статью',
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new PostScheme({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags.split(','),
			imageUrl: req.body.imageUrl,
			user: req.userId,
		})
		const post = await doc.save()

		res.json(post)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось создать статью',
		})
	}
}

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostScheme.find().limit(5).exec()

		const tags = posts
			.map(obj => obj.tags)
			.flat()
			.slice(0, 5)

		res.json(tags)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось создать статью',
		})
	}
}
