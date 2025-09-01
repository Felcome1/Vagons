import fs from 'fs'
import path from 'path'
import formidable from 'formidable-serverless'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const form = new formidable.IncomingForm()
  form.uploadDir = path.join(process.cwd(), 'public', 'uploads')
  form.keepExtensions = true

  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir, { recursive: true })
  }

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ message: 'Upload error' })

    const vagonNumber = fields.vagonNumber
    const file = files.file

    if (!vagonNumber || !file) {
      return res.status(400).json({ message: 'No file or vagonNumber' })
    }

    const ext = path.extname(file.name) || '.png'
    const newFileName = `${vagonNumber}${ext}`
    const newPath = path.join(form.uploadDir, newFileName)

    fs.renameSync(file.path, newPath)

    const publicPath = `/uploads/${newFileName}`
    res.status(200).json({ url: publicPath })
  })
}
