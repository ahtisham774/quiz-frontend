import { Paragraph } from "./ui/paragraph"

export function BetaAnnouncement() {
  return (
    <section className="space-y-4 bg-[#e5e5e7] text-[#7a7a7e] p-6 rounded-lg">
      <Paragraph>
        We've been working tirelessly to create a powerful app that takes your learning to the next level. Content is being updated daily, and we're thrilled to offer you this <span className="font-semibold">beta version</span> as part of our mission to provide the ultimate learning experience.
      </Paragraph>
      <Paragraph>
        Our goal is simple: to help you achieve the best grades possible and secure that university place you've been dreaming of.
      </Paragraph>
    </section>
  )
}

