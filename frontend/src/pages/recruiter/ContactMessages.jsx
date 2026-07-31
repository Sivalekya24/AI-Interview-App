import { useEffect, useState } from "react";
import {
  Eye,
  Trash2,
  CheckCircle,
  Mail,
} from "lucide-react";

import {
  getContactMessages,
  markContactAsRead,
  deleteContactMessage,
} from "../../lib/api";

import { Card } from "../../components/ui/primitives";

export default function ContactMessages() {

  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleRead = async (id) => {
    try {
      await markContactAsRead(id);
      fetchMessages();

      if (selected?.id === id) {
        setSelected({
          ...selected,
          status: "READ",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this message?")) return;

    try {
      await deleteContactMessage(id);

      setSelected(null);

      fetchMessages();

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading messages...</p>;
  }

  return (
    <div className="space-y-8">

      <div>

        <p className="uppercase tracking-[0.35em] text-sm text-slate-400">

          Recruiter

        </p>

        <h1 className="font-display text-4xl mt-3">

          Contact Messages

        </h1>

      </div>

      <Card className="rounded-[28px] p-6 shadow-lg border-0">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-4">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Status</th>
                <th className="text-left">Date</th>
                <th className="text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {messages.map((message) => (

                <tr
                  key={message.id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="py-5">

                    {message.name}

                  </td>

                  <td>

                    {message.email}

                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        message.status === "READ"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >

                      {message.status}

                    </span>

                  </td>

                  <td>

                    {new Date(
                      message.created_at
                    ).toLocaleDateString()}

                  </td>

                  <td>

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => setSelected(message)}
                      >

                        <Eye
                          className="text-blue-600"
                          size={18}
                        />

                      </button>

                      {message.status === "NEW" && (

                        <button
                          onClick={() =>
                            handleRead(message.id)
                          }
                        >

                          <CheckCircle
                            className="text-green-600"
                            size={18}
                          />

                        </button>

                      )}

                      <button
                        onClick={() =>
                          handleDelete(message.id)
                        }
                      >

                        <Trash2
                          className="text-red-600"
                          size={18}
                        />

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </Card>

      {selected && (

        <Card className="rounded-[28px] p-8 shadow-lg border-0">

          <div className="flex items-center gap-3">

            <Mail className="text-[#0E4B8E]" />

            <h2 className="font-display text-2xl">

              Message Details

            </h2>

          </div>

          <div className="mt-8 space-y-6">

            <div>

              <p className="text-sm text-gray-500">

                Name

              </p>

              <h3 className="font-semibold">

                {selected.name}

              </h3>

            </div>

            <div>

              <p className="text-sm text-gray-500">

                Email

              </p>

              <h3 className="font-semibold">

                {selected.email}

              </h3>

            </div>

            <div>

              <p className="text-sm text-gray-500">

                Message

              </p>

              <p className="mt-2 leading-7">

                {selected.message}

              </p>

            </div>

          </div>

        </Card>

      )}

    </div>
  );
}