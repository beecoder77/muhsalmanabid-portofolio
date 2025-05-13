export default function Loading() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-cyan-400 animate-spin"></div>
        <div
          className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin opacity-70"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>
      </div>
    </div>
  )
}
