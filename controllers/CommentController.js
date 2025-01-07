import CommentSchema from '../models/Comment.js'

export const createComment = async (req, res) => {
	try {
		const doc = new CommentSchema({
			user: req.userId,
			text: req.body.text,
		})

		const comment = await doc.save()
		res.json(comment)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось опубликовать комментарий',
		})
	}
}

export const getComments = async (req, res) => {
	try {
		const comments = await CommentSchema.find().populate('user').exec()

		res.json(comments)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить комментарии',
		})
	}
}

export const removeComment = async (req, res) => {
	try {
		const id = req.params.id
		const doc = await CommentSchema.findOneAndDelete({ _id: id })

		if (!doc) {
			return res.status(404).json({ message: 'Комментарий не найден' })
		}
		res.json({ isDeleted: true })
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось удалить комментарий',
		})
	}
}
