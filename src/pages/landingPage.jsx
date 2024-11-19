import Hero from "../components/hero"
import Navbar from "../components/navbar"

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <Hero />

    </div>
  )
}

export default LandingPage