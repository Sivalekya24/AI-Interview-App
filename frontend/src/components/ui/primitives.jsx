export function Card({
  className = "",
  children,
  ...props
}) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-3xl shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {

  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {

    primary:
      "bg-[#6E8EDB] text-white hover:bg-[#5C7AEA]",

    secondary:
      "bg-white border border-[#6E8EDB] text-[#6E8EDB] hover:bg-[#6E8EDB] hover:text-white",

    ghost:
      "bg-transparent text-gray-600 hover:text-[#5C7AEA]",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  error,
  className = "",
  ...props
}) {

  return (

    <label className="block">

      {label && (

        <span className="block text-sm font-medium text-gray-700 mb-2">

          {label}

        </span>

      )}

      <input
        className={`
          w-full
          h-14
          rounded-2xl
          bg-[#EEF3FF]
          border
          border-[#D7E3FF]
          px-5
          text-gray-900
          placeholder:text-gray-400
          outline-none
          transition
          focus:border-[#5C7AEA]
          focus:ring-4
          focus:ring-[#5C7AEA]/20
          ${className}
        `}
        {...props}
      />

      {error && (

        <span className="text-red-600 text-sm mt-2 block">

          {error}

        </span>

      )}

    </label>

  );

}

const STATUS_STYLES = {

  live: "bg-green-500",

  idle: "bg-gray-400",

  violation: "bg-red-500",

  warning: "bg-yellow-500",

};

export function StatusDot({
  status = "idle",
}) {

  return (

    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${STATUS_STYLES[status]}`}
    />

  );

}