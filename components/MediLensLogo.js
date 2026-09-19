export default function MediLensLogo({ size = "normal" }) {
  const small = size === "small";

  return (
    <div className="flex items-center gap-3">

      {/* Green Heart Logo */}
      <div
        className={`
          ${small ? "w-9 h-9 text-lg" : "w-11 h-11 text-xl"}
          rounded-xl
          bg-emerald-600
          flex
          items-center
          justify-center
          text-white
          font-bold
          shadow-sm
        `}
      >
        M
      </div>

      <div>
        <h1
          className={`
            ${small ? "text-xl" : "text-2xl"}
            font-bold
            text-slate-900
            dark:text-white
          `}
        >
          Medi<span className="text-emerald-600">Lens</span>
        </h1>

        {!small && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            See Deeper. Understand Better.
          </p>
        )}
      </div>

    </div>
  );
}
