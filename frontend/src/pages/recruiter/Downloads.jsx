import { useState } from 'react'
import toast from 'react-hot-toast'
import { Download, Users, ListVideo } from 'lucide-react'
import { downloadUsersFile, downloadInterviewsFile, downloadBlob } from '../../lib/api'
import { Card, Button } from '../../components/ui/primitives'

const EXPORTS = [
  {
    key: 'users',
    icon: Users,
    title: 'All users',
    description: 'Every registered candidate and recruiter account, with role and status.',
    handler: downloadUsersFile,
    filename: 'users.csv',
  },
  {
    key: 'interviews',
    icon: ListVideo,
    title: 'All interviews',
    description: 'Interview records with scores, status, and violation counts.',
    handler: downloadInterviewsFile,
    filename: 'interviews.csv',
  },
]

export default function Downloads() {
  const [pending, setPending] = useState(null)

  const handleDownload = async (item) => {
    setPending(item.key)
    try {
      const res = await item.handler()
      downloadBlob(res, item.filename)
      toast.success(`${item.title} exported`)
    } catch (err) {

    console.error(err)

    toast.error(

        err.response?.data?.detail ||

        "Export failed"

    )
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Downloads</h1>
        <p className="text-muted text-sm mt-1">Export platform data as CSV</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {EXPORTS.map((item) => (
          <Card key={item.key} className="downloads-card p-6">
            <div className="downloads-icon w-9 h-9 rounded-md flex items-center justify-center mb-4">
              <item.icon size={16} className="downloads-primary" />
            </div>
            <p className="downloads-heading text-sm font-medium">{item.title}</p>
            <p className="text-xs downloads-secondary mt-1.5 leading-relaxed">{item.description}</p>
            <Button
              variant="secondary"
              className="mt-4 w-full"
              disabled={pending === item.key}
              onClick={() => handleDownload(item)}
            >
              <Download size={14} /> {pending === item.key ? 'Preparing…' : 'Download CSV'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
