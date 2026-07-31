import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Download, UserPlus, Power } from "lucide-react";
import {
  getAllUsers,
  createUser,
  activateUser,
  deactivateUser,
  downloadUsersFile,
  downloadBlob,
} from "../../lib/api";
import {
  Card,
  Button,
  Input,
  StatusDot,
} from "../../components/ui/primitives";

export default function UserManagement() {

  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({

    full_name: "",

    email: "",

    password: "",

    role: "USER",

  });

  const loadUsers = () => {

    setIsLoading(true);

    getAllUsers()

      .then(({ data }) => {

        setUsers(data.users ?? data);

      })

      .catch((err) => {

        console.error(err);

        setUsers([]);

      })

      .finally(() => {

        setIsLoading(false);

      });

  };

  useEffect(() => {

    loadUsers();

  }, []);

  const handleCreate = async (e) => {

    e.preventDefault();

    try {

      await createUser(form);

      toast.success("User created successfully");

      setShowCreate(false);

      setForm({

        full_name: "",

        email: "",

        password: "",

        role: "USER",

      });

      loadUsers();

    }

    catch (err) {

      console.error(err);

      toast.error(

        err.response?.data?.detail ||

        "Could not create user"

      );

    }

  };

  const toggleActive = async (user) => {

    try {

      if (user.is_active) {

        await deactivateUser(user.id);

      }

      else {

        await activateUser(user.id);

      }

      loadUsers();

    }

    catch (err) {

      console.error(err);

      toast.error(

        err.response?.data?.detail ||

        "Could not update user status"

      );

    }

  };

  const handleDownload = async () => {

    try {

      const res = await downloadUsersFile();

      downloadBlob(

        res,

        "users.csv"

      );

      toast.success("Users exported");

    }

    catch (err) {

      console.error(err);

      toast.error(

        err.response?.data?.detail ||

        "Download failed"

      );

    }

  };

  return (

    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="font-display text-2xl font-semibold text-ink">

            Users

          </h1>

          <p className="text-muted text-sm mt-1">

            {users.length} registered

          </p>

        </div>

        <div className="flex gap-3">

          <Button

            variant="secondary"

            onClick={handleDownload}

          >

            <Download size={15} />

            Export

          </Button>

          <Button

            onClick={() =>

              setShowCreate(!showCreate)

            }

          >

            <UserPlus size={15} />

            Add User

          </Button>

        </div>

      </div>

      {showCreate && (

        <Card className="p-5">

          <form

            onSubmit={handleCreate}

            className="grid grid-cols-4 gap-3 items-end"

          >

            <Input

              label="Full Name"

              required

              value={form.full_name}

              onChange={(e) =>

                setForm({

                  ...form,

                  full_name: e.target.value,

                })

              }

            />

            <Input

              label="Email"

              type="email"

              required

              value={form.email}

              onChange={(e) =>

                setForm({

                  ...form,

                  email: e.target.value,

                })

              }

            />

            <Input

              label="Password"

              type="password"

              required

              value={form.password}

              onChange={(e) =>

                setForm({

                  ...form,

                  password: e.target.value,

                })

              }

            />

            <Button type="submit">

              Create

            </Button>

          </form>

        </Card>

      )}

      <Card className="overflow-hidden">

        <table className="w-full text-sm">

          <thead>

            <tr className="border-b border-line text-left">

              <th className="px-5 py-3 text-xs font-mono text-muted uppercase tracking-wide">

                Name

              </th>

              <th className="px-5 py-3 text-xs font-mono text-muted uppercase tracking-wide">

                Email

              </th>

              <th className="px-5 py-3 text-xs font-mono text-muted uppercase tracking-wide">

                Role

              </th>

              <th className="px-5 py-3 text-xs font-mono text-muted uppercase tracking-wide">

                Status

              </th>

              <th className="px-5 py-3"></th>

            </tr>

          </thead>

          <tbody>

            {isLoading && (

              <tr>

                <td

                  colSpan={5}

                  className="px-5 py-8 text-center text-muted"

                >

                  Loading...

                </td>

              </tr>

            )}

            {!isLoading &&

              users.length === 0 && (

                <tr>

                  <td

                    colSpan={5}

                    className="px-5 py-8 text-center text-muted"

                  >

                    No users found

                  </td>

                </tr>

              )}

            {users.map((u) => (

              <tr

                key={u.id}

                className="border-b border-line last:border-0"

              >

                <td className="px-5 py-3 text-ink">

                  {u.full_name ?? u.name}

                </td>

                <td className="px-5 py-3 text-muted font-mono text-xs">

                  {u.email}

                </td>

                <td className="px-5 py-3 text-muted">

                  {u.role}

                </td>

                <td className="px-5 py-3">

                  <span className="flex items-center gap-1.5 text-xs font-mono text-muted">

                    <StatusDot

                      status={

                        u.is_active

                          ? "live"

                          : "idle"

                      }

                    />

                    {u.is_active

                      ? "Active"

                      : "Inactive"}

                  </span>

                </td>

                <td className="px-5 py-3 text-right">

                  <button

                    onClick={() =>

                      toggleActive(u)

                    }

                    className="text-muted hover:text-ink transition-colors"

                  >

                    <Power size={15} />

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </Card>

    </div>

  );

}