
import { Paragraph } from "./ui/paragraph"

export function ContactSection() {
  return (
    <section className="space-y-4">
      <Paragraph>
        Want to join us and be part of something exciting? Drop us a message at{" "}
        <a target="_blank" rel="noreferrer" href="mailto:coach@my-science.com" className="text-[#467886] hover:underline">
          coach@my-science.com
        </a>{" "}
        to find out how you can get involved. Let's get ready to ace those spring exams together!
      </Paragraph>
      <p className="text-sm text-gray-800 italic">
        *If you want to know more about what cognitive science tells us,{" "}
        <a href="#" target="_blank" rel="noreferrer"  className="text-[#467886] hover:underline">
          this poster
        </a>{" "}
        is a good start.
      </p>
    </section>
  )
}

