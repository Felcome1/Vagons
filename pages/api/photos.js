import fs from 'fs'
import path from 'path'

const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const files = fs.readdirSync(uploadsDir)
      const data = files.map(name => {
        const stat = fs.statSync(path.join(uploadsDir, name))
        return { name, mtimeMs: stat.mtimeMs }
      })
      res.status(200).json(data)
    } catch (e) {
      res.status(500).json([])
    }
  } else if (req.method === 'DELETE') {
    const { name } = req.query
    if (!name) return res.status(400).json({ error: 'No file name' })
    try {
      fs.unlinkSync(path.join(uploadsDir, name))
      res.status(200).json({ success: true })
    } catch (e) {
      res.status(500).json({ error: 'Delete error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

