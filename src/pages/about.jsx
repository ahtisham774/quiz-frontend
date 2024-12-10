import { Container } from '../components/about/ui/container'
import { Heading } from '../components/about/ui/heading'
import { Paragraph } from '../components/about/ui/paragraph'
import { FeatureCard } from '../components/about/feature-card'
import { BetaAnnouncement } from '../components/about/beta-announcement'
import { ContactSection } from '../components/about/contact-section'
import Navbar from '../components/navbar'

export default function AboutPage () {
  const features = [
    {
      title: 'Active Recall',
      description:
        'Strengthen your foundational knowledge and develop your long-term memory through targeted practice. Teachers call this retrieval practice.'
    },
    {
      title: 'Accurate Feedback',
      description:
        "Understand exactly where you're excelling and where to improve with performance insights."
    },
    {
      title: 'Bite-Sized Learning',
      description:
        'Complex topics are broken down into manageable chunks, easing the stress of learning or as teachers say, "reducing your cognitive load!"'
    },
    {
      title: 'Smart Sequencing',
      description:
        'Topics are presented in the ideal order to build your knowledge layer by layer. This helps to build what scientists call, your schema*.'
    }
  ]

  return (
    <div className='flex flex-col w-full'>
      <Navbar />
      <Container>
        <div className='space-y-12'>
          <section className='space-y-4'>
            <Heading level={1}>Welcome to Your Personal Physics Coach!</Heading>
            <Paragraph>
              Your journey to mastering A level physics and achieving your dream
              grades starts here. This programme isn't just another set of
              random resources—it's carefully designed with you in mind,
              grounded in research into how we learn best so you learn smarter,
              not harder.
            </Paragraph>
          </section>

          <section className='space-y-6'>
            <Heading level={2}>Here's what makes our approach unique:</Heading>
            <div className='grid gap-6 md:grid-cols-2'>
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </section>

          <BetaAnnouncement />

          <ContactSection />
        </div>
      </Container>
    </div>
  )
}
